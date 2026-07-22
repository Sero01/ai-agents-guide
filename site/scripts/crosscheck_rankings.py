#!/usr/bin/env python3
"""
Check our published per-benchmark orderings against external leaderboards.

    python3 scripts/crosscheck_rankings.py

Credibility gate for the weekly run. If our table says X > Y where every
independent leaderboard says Y > X, the table is wrong regardless of how well
each individual cell is sourced - and a leaderboard that contradicts consensus
has no reason to exist.

LICENSING: the reference orderings below are used strictly as an internal QA
oracle and are never written to models.json or rendered on the site.
Artificial Analysis' free tier permits exactly this ("internal use only with
attribution") while prohibiting redistribution, so comparing against AA here
is compliant where republishing their figures would not be.

Reports two classes of problem:
  INVERSION - our data orders a pair opposite to external consensus
  NOISE     - we imply a rank from a gap too small to be meaningful
"""

import json
from itertools import combinations
from pathlib import Path

from models_schema import BENCHMARKS, LIVE_BENCHMARKS, SOURCES

ROOT = Path(__file__).resolve().parent.parent
MODELS_JSON = ROOT / "src" / "data" / "models.json"

# Gaps at or below this are treated as ties, not orderings. SWE-bench Verified
# and Pro both report to 0.1 on a 500-problem set, where a single problem is
# 0.2 - so sub-point gaps are not resolvable.
NOISE_FLOOR = 1.0

# ── External reference orderings (internal QA only, never published) ──────────
#
# Ordered best -> worst. Read 2026-07-22.

# `kind` matters. A composite reference (AA Index, LiveBench global average)
# measures overall capability and CANNOT be used to judge a single-benchmark
# ordering: Gemini 3.1 Pro genuinely beats Kimi K3 on GPQA (94.3 vs 93.5) while
# ranking below it overall, and both facts are true. Comparing the two produces
# false alarms, so composite references are reported as DIVERGENCE (editorial
# context) rather than INVERSION (an error).
#
# A real inversion needs a like-for-like reference - another leaderboard's
# ordering on the *same* benchmark. We publish no composite, so we currently
# have no like-for-like comparison against AA's index at all.

REFERENCES: dict[str, dict] = {
    "artificial_analysis_index_v4_1": {
        "label": "Artificial Analysis Intelligence Index v4.1",
        "url": "https://artificialanalysis.ai/leaderboards/models",
        "kind": "composite",
        "scores": {
            "claude-fable-5": 60, "gpt-5-6-sol": 59, "kimi-k3": 57,
            "claude-opus-4-8": 56, "gpt-5-6-terra": 55, "grok-4-5": 54,
            "claude-sonnet-5": 53, "gpt-5-6-luna": 51, "glm-5-2": 51,
            "gemini-3-5-flash": 50, "gemini-3-1-pro": 46, "qwen-3-7-max": 46,
        },
    },
    "livebench": {
        "label": "LiveBench global average",
        "url": "https://livebench.ai",
        "kind": "composite",
        "scores": {
            "gpt-5-6-sol": 82.4, "claude-fable-5": 80.8, "gpt-5-5": 79.9,
        },
    },
}


def scoreable(cell: object) -> bool:
    if not isinstance(cell, dict) or cell.get("value") is None:
        return False
    s = SOURCES.get(cell.get("source") or "")
    return bool(s and s["scoreable"] and s.get("redistributable", True))


def main() -> None:
    data = json.loads(MODELS_JSON.read_text())
    models = {m["id"]: m for m in data["models"]}
    names = {mid: m["name"] for mid, m in models.items()}

    inversions: list[str] = []
    divergences: list[str] = []
    noise: list[str] = []

    for key in LIVE_BENCHMARKS:
        ours = {mid: m["benchmarks"][key]["value"]
                for mid, m in models.items()
                if scoreable((m.get("benchmarks") or {}).get(key))}
        if len(ours) < 2:
            continue

        for a, b in combinations(ours, 2):
            va, vb = ours[a], ours[b]
            if va == vb:
                continue
            hi, lo = (a, b) if va > vb else (b, a)
            gap = abs(va - vb)

            for ref in REFERENCES.values():
                rs = ref["scores"]
                if hi not in rs or lo not in rs or rs[lo] <= rs[hi]:
                    continue
                msg = (f"{BENCHMARKS[key]['label']}: {names[hi]} {ours[hi]} > "
                       f"{names[lo]} {ours[lo]}, but {ref['label']} has "
                       f"{names[lo]} ({rs[lo]}) > {names[hi]} ({rs[hi]})")
                if ref.get("kind") == "composite":
                    divergences.append(msg + "  [expected: benchmark vs composite]")
                else:
                    inversions.append(msg)

            if gap < NOISE_FLOOR:
                noise.append(
                    f"{BENCHMARKS[key]['label']}: {names[hi]} {ours[hi]} vs "
                    f"{names[lo]} {ours[lo]} - gap {gap:.1f} is below the "
                    f"{NOISE_FLOOR} noise floor; render as a tie, not a rank")

    print("CROSS-CHECK vs EXTERNAL LEADERBOARDS")
    print("(reference data used as internal QA only - never published)\n")

    print(f"INVERSIONS ({len(inversions)}) - we contradict a like-for-like source")
    for i in inversions:
        print(f"  ! {i}")
    if not inversions:
        print("  none  (no like-for-like per-benchmark reference loaded yet)")

    print(f"\nDIVERGENCE vs OVERALL CONSENSUS ({len(divergences)}) - not errors,")
    print("but pairs where a benchmark win runs against overall reputation.")
    print("These are the rows most likely to be misread as an overall ranking.\n")
    for d in sorted(set(divergences))[:8]:
        print(f"  ~ {d}")
    if len(set(divergences)) > 8:
        print(f"  ... and {len(set(divergences))-8} more")

    print(f"\nSPURIOUS PRECISION ({len(noise)}) - gap too small to rank")
    for n in noise:
        print(f"  ~ {n}")
    if not noise:
        print("  none")

    print(f"\n{len(inversions)} inversion(s), {len(set(divergences))} divergence(s), {len(noise)} sub-noise pair(s)")


if __name__ == "__main__":
    main()
