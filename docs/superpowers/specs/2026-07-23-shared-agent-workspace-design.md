# Shared Agent Workspace — Design

**Date:** 2026-07-23
**Status:** Approved (design), pending implementation plan
**Author:** Sero01 + Claude Code (brainstorming session)

## 1. Vision

A collaborative workspace where three participants — **the user, Claude Code, and Codex** — work together around one shared context. The user drives a single conversation; either agent can be addressed, sees what the other has done, and can hand work back and forth. Concretely: ask Claude to plan something, tag Codex to review it, and Codex already has the plan in view without the user re-pasting anything.

Both agents run under the user's **subscriptions** (Claude Pro, Codex on ChatGPT plan). There is no per-token dollar billing anywhere in this system.

## 2. What "shared context" means

Guaranteed at three layers:

1. **Shared conversation** — one transcript. Every user message and every agent reply is one visible thread. From the user's seat, all three are in one room having one conversation.
2. **Shared files** — one working directory. When the driver edits `auth.ts`, the reviewer reads that same file on disk, not a copy.
3. **Private-but-synced reasoning** — each agent runs its **own resumable session**. Each keeps its own chain of thought; they stay aligned because each receives a **catch-up delta** of what happened while it was not the one speaking. The user never manages this.

This is the strongest form of shared context achievable across two different vendors' CLIs. A single shared reasoning/memory store is explicitly out of scope (not native to either CLI; would force full-transcript replay every turn and destroy each agent's private scratch reasoning).

## 3. Decisions (locked)

| Area | Decision |
|---|---|
| Surface | Custom chat surface, agents run headless with structured (JSON) output. Not tmux-driven TUIs. |
| Context model | Persistent per-agent sessions + catch-up deltas. **Both adapters must be sessionful.** |
| Autonomy | Agent-to-agent handoff allowed, **hop-limited** (default 3), returns control to the user when spent. |
| Concurrency | **One writer, one reviewer.** Driver has read/write; reviewer is spawned read-only and reports findings. Roles reassignable per task (`/swap`). |
| v1 shell | Minimal REPL (readline loop, colored prefixed output). TUI is a later skin over the proven broker. |
| Billing | Subscription only. No dollar budgets. Guards are usage-based (hops + wall-clock). |

## 4. The decisive requirement

**Both adapters must be sessionful, or both must receive reconstructable full context.** Per-agent cursors require persistent per-agent memory. A fresh process that only receives a post-cursor delta cannot recover anything before that cursor. Therefore:

- **Claude** runs resident with streaming JSON I/O.
- **Codex** runs turn-based but sessionful: capture its session id from the first `--json` stream, then `codex exec resume <SESSION_ID>` on every subsequent turn.

If this requirement is not met, the cursor model is unsound and the whole design fails.

## 5. Architecture

Python 3.12, single process, async. One broker holds all policy; the REPL is a thin renderer; agents sit behind a uniform adapter interface.

```
  you ─┬─► repl.py ──► broker.py ──┬─► adapters/claude.py ──► claude -p (resident stream-json)
       │       ▲          │        └─► adapters/codex.py  ──► codex exec [resume <id>] --json
       └───────┘          │
        rendered      transcript.jsonl
         events       + per-agent cursors
```

| Module | Owns | Rationale |
|---|---|---|
| `repl.py` | readline loop, `@mention` + `/command` parsing, colored prefixed output | Swappable — the TUI later replaces only this |
| `broker.py` | routing, hop chain, loop guard, usage guard, admission checks | The only place with policy; all risk concentrated here |
| `transcript.py` | append-only JSONL event log with monotonic `event_id`, per-agent read cursors | Pure data; testable without any agent |
| `protocol.py` | the collaboration contract injected into each agent's turn | Agents can only hand off via a structured directive; this teaches them how |
| `adapters/base.py` | `async run(request) -> AsyncIterator[Event]` contract | Hides the resident/turn-based asymmetry from the broker |
| `adapters/claude.py` | resident process, stream-json I/O, event normalization | One file per CLI |
| `adapters/codex.py` | first-turn spawn + session-id capture, `resume` on later turns | Encapsulates Codex's turn-based nature |
| `roles.py` | `driver` / `reviewer` → concrete CLI permission flags per agent | Permission policy in one auditable place |

## 6. Adapter contract

```python
async def run(request: AgentRequest) -> AsyncIterator[Event]:
    ...   # stream ends with exactly one terminal event

AgentRequest = {
    agent, chain_id, hop, role,
    events,               # the catch-up delta, including the triggering message ONCE
    cwd, permission_profile,
    wall_clock_timeout,
    context_meta,         # cursor position, prior usage readout
}
```

Every stream ends with **exactly one** terminal event: `TurnCompleted | TurnFailed | TurnCancelled`.

### Claude adapter (resident)

```
claude -p \
  --input-format stream-json \
  --output-format stream-json \
  --verbose \
  --include-partial-messages
```

Messages are queued into the live process; subsequent turns are additional stream-json inputs. Session continuity is inherent to the resident process. (`--session-id <uuid>` may be assigned for durability across restarts.)

### Codex adapter (turn-based, sessionful)

- First turn: `codex exec --json <prompt>` — capture the session id from the stream.
- Later turns: `codex exec resume <SESSION_ID> --json <prompt>`.
- `--json` emits JSONL including terminal usage.

**Empirical unknown (confirm on first adapter run):** the exact event name that carries Codex's session id in the `--json` stream (candidates: `thread.started`, `session_configured`). The adapter must confirm this live rather than assume; everything else is verified against codex-cli 0.145.0.

## 7. Message flow (write-ahead ordered)

1. Append the user event to the transcript with a monotonic `event_id`.
2. Select the target; compute the delta = events in `(cursor[target], triggering_event]`.
3. Send that delta **exactly once**. The triggering message is part of the delta, never also passed separately.
4. Stream the response; persist normalized events as they arrive while rendering them live. (Partial streamed output is either recoverable or explicitly declared non-canonical.)
5. Append a single terminal turn event containing `status`, `usage`, and final text.
6. **Only after durable append**, advance `cursor[target]` through the terminal event. (An agent is never told what it itself just said.)
7. Parse a structured routing directive from the **final assistant message only**, outside fenced code, trailing block preferred.
8. Before another hop, run admission checks (Section 9). If they pass, go to step 2 with the new target and `hop + 1`; otherwise return control to the user.
9. On crash, replay unacknowledged events. Delivery is therefore explicitly **at-least-once**.

The transcript is the source of truth **for broker-visible coordination only**. Agent session stores and filesystem mutations hold state the JSONL does not reproduce.

## 8. Routing: mentions vs. routes

Two different trust levels:

- **Human input is trusted.** When the user types `@claude` / `@codex` in the REPL, that routes directly.
- **Agent output is untrusted prose.** An agent hands off *only* by emitting a trailing structured directive:

  ```
  <route target="codex">Review the authentication changes.</route>
  ```

  Directives are accepted only from the final assistant text, outside fenced code blocks, preferably as a trailing block. A free-form `@claude` inside an agent's prose (e.g. quoting a README) is **ignored** — it cannot launch a hop. This is enforced so that quoted or generated text can never trigger routing.

`protocol.py` injects, per turn, the contract that teaches each agent: who its partner is, its current role (driver/reviewer), and that the only way to hand off is a trailing `<route>` block.

## 9. Guards (usage-based, subscription model)

The failure mode is **not** a surprise bill — it is burning Pro/ChatGPT quota and tripping a rate limit that locks the user out of both the workspace and normal Claude Code work. Guards protect quota, not money.

| Guard | Rule |
|---|---|
| Hop limit | Default 3 per user message. `/hop 5` raises it for one message only, then reverts. `0` disables agent-to-agent routing. |
| Wall-clock cap | Per-chain elapsed-time ceiling. |
| Loop guard | Self-mentions dropped; a route identical to one already in the current chain is dropped. |
| Rate-limit sentinel | If a turn returns a rate-limit/usage-limit error, the chain aborts and reports which agent hit the wall. |

**Admission check before each hop:** `hop < limit` AND `elapsed < wall_clock_cap` AND previous turn was not a rate-limit/usage error.

`usage` numbers from each CLI's JSON stream are **surfaced, not billed** — a live readout (`↳ hop 2/3 · ~18k tokens this chain`) so the user can see a runaway before it trips a limit. They gate nothing by dollars. No `--max-budget-usd` anywhere (it is an API-key control, inert under subscription auth).

A chain that ends by exhausting a guard says so explicitly (`↳ hop 3/3 → returned to you`) rather than appearing to have simply finished.

## 10. Roles and permissions

`roles.py` maps role → concrete CLI flags per agent:

| Role | Claude | Codex |
|---|---|---|
| driver (rw) | default permission mode | `-s workspace-write` |
| reviewer (ro) | `--permission-mode plan` + `--disallowedTools Edit Write` | `-s read-only` |

The reviewer literally cannot mutate the working directory, making the "one writer, one reviewer" concurrency model conflict-free by construction. `/swap` reassigns roles per task.

## 11. Process failure handling

Every adapter must handle: wall-clock timeout, cancellation, process-group termination (no orphaned children), stderr draining, malformed-JSON tolerance, and exit-status → terminal event mapping. No failure may leave the broker waiting forever or the cursor advanced past an unpersisted turn.

## 12. Testing strategy

- **`transcript.py`** — unit-tested with no agents: event_id monotonicity, cursor advance only after durable append, delta computation `(cursor, triggering]`, crash-replay (at-least-once) semantics.
- **`broker.py`** — tested against a fake adapter (deterministic scripted events): hop counting, loop-guard dedup, admission checks, `<route>` parsing (including rejection of mentions inside fenced code and prose).
- **`adapters/*`** — integration-tested against the real CLIs, minimal turns: Claude resident round-trip; Codex session-id capture + `resume` continuity; terminal-event shape; timeout/kill paths.
- **End-to-end** — the canonical scenario: user → `@claude` plan → agent `<route>` to codex → codex review → returns to user at hop limit, with one clean transcript and correct cursors for both agents.

## 13. Out of scope for v1

- TUI / web UI (REPL first; TUI is a later skin).
- Resident Codex via `codex app-server` (viable upgrade path for live turn lifecycle + token streaming; not needed for v1).
- Parallel worktrees / true simultaneous writers (deferred; v1 is one-writer-one-reviewer).
- More than two agents.
- Shared single reasoning/memory store (not achievable across vendors).

## 14. Verified against local binaries

- codex-cli 0.145.0: `codex exec resume <SESSION_ID>` ✓, `codex exec --json` ✓, `-s read-only|workspace-write` ✓, `codex app-server` (experimental) ✓
- Claude Code 2.1.217: `--input-format`/`--output-format stream-json` ✓, `--include-partial-messages` ✓, `--verbose` ✓, `--permission-mode` ✓, `--disallowedTools` ✓, `--session-id` ✓, `--max-budget-usd` ✓ (unused — API-billing only)
