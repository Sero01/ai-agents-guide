#!/usr/bin/env python3
"""
Schema registry for site/src/data/models.json (schema_version 2).

Single source of truth for which benchmarks exist, which ones are scored,
and which provenance tiers are acceptable. Imported by validate_models.py
and migrate_models_schema.py.

Design rule that motivates this file: the v1 schema enforced *completeness*
("every row has 8 benchmark cells") with no provenance requirement. Vendors
publish 1-2 of those 8, so the only way to satisfy the invariant was to
invent the rest. v2 inverts it: provenance is mandatory, gaps are legal.
"""

# ── Provenance tiers ──────────────────────────────────────────────────────────
#
# A cell may only carry a value if its `source` is one of these keys.
# `scoreable` decides whether the cell may contribute to the composite.

# Artificial Analysis licence gate.
#
# Verified 2026-07-22 against artificialanalysis.ai/data-api: the free tier is
# "internal use only; no redistribution", and redistribution rights for
# "customer-facing products, publications, and data feeds" require a
# commercial agreement. agentguides.dev is a public, ad-monetised publication,
# so republishing AA's benchmark values there is redistribution.
#
# While this is False, AA figures may be used as an internal cross-check and
# cited by link, but never copied into published cells. Flip to True only once
# a commercial licence is actually in hand.
AA_REDISTRIBUTION_LICENSED = False

SOURCES = {
    # Independently run evaluations. Highest trust: the evaluator controls
    # the harness and publishes its methodology.
    "artificial_analysis": {
        "label": "Artificial Analysis",
        "url": "https://artificialanalysis.ai",
        "kind": "independent",
        "scoreable": True,
        # Gated: see AA_REDISTRIBUTION_LICENSED above.
        "redistributable": AA_REDISTRIBUTION_LICENSED,
    },
    "swebench": {
        "label": "SWE-bench",
        "url": "https://www.swebench.com",
        "kind": "independent",
        "scoreable": True,
        "redistributable": True,
    },
    "lmarena": {
        "label": "LMArena",
        "url": "https://arena.ai",
        "kind": "independent",
        "scoreable": True,
        "redistributable": True,
    },
    # Vendor-reported: authoritative for what the lab claims, but self-run.
    # Labs publish model cards to be quoted, so these are freely citable
    # with attribution. Scoreable, but the UI must label it vendor-reported.
    "vendor": {
        "label": "Vendor model card",
        "url": None,
        "kind": "vendor",
        "scoreable": True,
        "redistributable": True,
    },
    # Explicitly-marked estimate. Never scored, always visibly flagged.
    # Exists so an estimate can be *recorded* without masquerading as data.
    "estimate": {
        "label": "Estimated",
        "url": None,
        "kind": "estimate",
        "scoreable": False,
        "redistributable": True,
    },
    # Pre-v2 values whose origin was never recorded. Never scored.
    # Migration target only; new cells may not use this.
    "unsourced_legacy": {
        "label": "Unsourced (pre-2026-07 data)",
        "url": None,
        "kind": "legacy",
        "scoreable": False,
        "redistributable": True,
    },
}

WRITEABLE_SOURCES = {"artificial_analysis", "swebench", "lmarena", "vendor", "estimate"}

# Secondary summaries that restate (and frequently fabricate) benchmark
# numbers. Verified 2026-07-22: several published Claude Sonnet 5 SWE-bench
# Verified / GPQA Diamond figures that appear in no Anthropic release.
# A URL on any of these hosts is rejected outright.
BLOCKED_SOURCE_HOSTS = {
    "morphllm.com",
    "benchlm.ai",
    "wan27.org",
    "requesty.ai",
    "kingy.ai",
    "aitoolsreview.co.uk",
    "llm-boss.com",
    "theairankings.com",
    "o-mega.ai",
    "emergent.sh",
    "coursiv.io",
    "techsy.io",
    "codingfleet.com",
    "labellerr.com",
    "whatllm.org",
    "automatio.ai",
    "gemma4all.com",
    "tech-insider.org",
    "smartchunks.com",
    "iternal.ai",
    "localaimaster.com",
    "metatext.io",
}

# ── Benchmark registry ────────────────────────────────────────────────────────
#
# status: "live"     - actively reported by at least one tier-1 source in 2026
#         "legacy"   - retired or superseded; displayed, never scored
# retired: why it left the live set, shown in the UI next to the column
# superseded_by: successor column id, where one exists

BENCHMARKS = {
    # ---- live, scored -------------------------------------------------------
    "aa_intelligence_index": {
        "label": "AA Index",
        "status": "live",
        "scored": True,
        "scale": "index",  # 0-100 composite, not an accuracy percentage
        "note": "Artificial Analysis Intelligence Index. Version-tagged; "
                "scores are frozen at the version they were measured under.",
    },
    "gpqa_diamond": {
        "label": "GPQA Diamond",
        "status": "live",
        "scored": True,
        "scale": "pct",
    },
    "swe_bench_verified": {
        "label": "SWE-bench Verified",
        "status": "live",
        "scored": True,
        "scale": "pct",
        "note": "Never mix with SWE-bench Pro; Pro runs ~20pt lower on the "
                "same model.",
    },
    "swe_bench_pro": {
        "label": "SWE-bench Pro",
        "status": "live",
        "scored": True,
        "scale": "pct",
    },
    "terminal_bench_2_1": {
        "label": "Terminal-Bench 2.1",
        "status": "live",
        "scored": True,
        "scale": "pct",
        "note": "Supersedes Terminal-Bench Hard (AA Index v4.1).",
    },
    "hle": {
        "label": "HLE",
        "status": "live",
        "scored": True,
        "scale": "pct",
        "note": "Humanity's Last Exam. Record whether tools were enabled in "
                "the cell note - the two variants differ by ~25pt.",
    },
    "tau3_banking": {
        "label": "τ³-Banking",
        "status": "live",
        "scored": True,
        "scale": "pct",
        "note": "Supersedes τ²-Bench Telecom (AA Index v4.1).",
    },
    "mmmu_pro": {
        "label": "MMMU-Pro",
        "status": "live",
        "scored": True,
        "scale": "pct",
    },

    # ---- legacy, displayed but never scored ---------------------------------
    "mmlu_pro": {
        "label": "MMLU-Pro",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Dropped from the AA Intelligence Index; still run as a "
                   "standalone eval but no longer reported by most vendors.",
    },
    "humaneval": {
        "label": "HumanEval",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Saturated - frontier models cluster at 92-96%, so it no "
                   "longer separates them.",
    },
    "math_500": {
        "label": "MATH-500",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Retired from active reporting by Artificial Analysis "
                   "(Index v4.1).",
    },
    "mmmu": {
        "label": "MMMU",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Superseded by the harder MMMU-Pro variant.",
        "superseded_by": "mmmu_pro",
    },
    "aider_polyglot": {
        "label": "Aider Polyglot",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Upstream leaderboard is unmaintained - its top entry is "
                   "still GPT-5 (high) at 88.0 and it tracks no 2026 model.",
    },
    "tau_bench": {
        "label": "τ²-Bench",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Superseded by τ³-Banking (AA Index v4.1).",
        "superseded_by": "tau3_banking",
    },
    "terminal_bench_2_0": {
        "label": "Terminal-Bench 2.0",
        "status": "legacy",
        "scored": False,
        "scale": "pct",
        "retired": "Superseded by Terminal-Bench 2.1. Kept as its own column "
                   "because several vendors (DeepSeek, Qwen, MiniMax) published "
                   "only 2.0 - folding those into the 2.1 column would repeat "
                   "the version-mixing this schema exists to prevent.",
        "superseded_by": "terminal_bench_2_1",
    },
}

LIVE_BENCHMARKS = [k for k, v in BENCHMARKS.items() if v["status"] == "live"]
SCORED_BENCHMARKS = [k for k, v in BENCHMARKS.items() if v["scored"]]
LEGACY_BENCHMARKS = [k for k, v in BENCHMARKS.items() if v["status"] == "legacy"]

# ── Model lifecycle ───────────────────────────────────────────────────────────
#
# Mirrors LMArena's availability-based policy: rank what people can actually
# buy today, keep everything else visible but out of the ranking.

MODEL_STATUSES = {
    "current",     # generally available, newest in its series -> ranked
    "superseded",  # available, but a newer same-series model exists -> unranked
    "historical",  # legacy row retained for reference -> unranked
    "unreleased",  # announced/previewed, no public access -> unranked, no pricing
}

RANKED_STATUSES = {"current"}

# A composite is only shown when at least this many *scoreable* live cells
# are present. Below the floor the model shows "-" rather than a number
# computed from a lucky subset of easy benchmarks.
MIN_SCORED_CELLS = 3

SCHEMA_VERSION = 2
