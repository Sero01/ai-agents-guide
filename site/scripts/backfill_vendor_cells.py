#!/usr/bin/env python3
"""
Apply vendor-published benchmark cells to site/src/data/models.json.

    python3 scripts/backfill_vendor_cells.py [--dry-run] [--force]

Idempotent: re-running applies the same values. An existing cell is only
replaced if the incoming source ranks at least as high, unless --force.

This is the weekly-run workflow that replaces "fill every column":

    1. python3 scripts/models_gaps.py        -> what is missing
    2. read the vendor's model card / system card / technical report
    3. add the figure to CELLS below, with the exact benchmark variant
       and a primary URL
    4. python3 scripts/backfill_vendor_cells.py
    5. python3 scripts/validate_models.py

Rules for adding an entry:
  * Only primary sources - the lab's own card, paper, repo, or an open
    leaderboard. Never a secondary summary site (validate_models.py rejects
    a list of known aggregator hosts outright).
  * Match the benchmark variant exactly. Terminal-Bench 2.0 does not go in
    the 2.1 column; SWE-bench Pro does not go in the Verified column; τ² does
    not go in the τ³ column. Different column or no cell.
  * If the vendor published nothing for a column, leave it absent. A gap is
    a valid, honest state. Do not estimate.
"""

import argparse
import json
from pathlib import Path

from models_schema import BENCHMARKS, SOURCES

ROOT = Path(__file__).resolve().parent.parent
MODELS_JSON = ROOT / "src" / "data" / "models.json"

READ_ON = "2026-07-22"

# Preference order when a cell already exists. Higher wins.
SOURCE_RANK = {
    "unsourced_legacy": 0,
    "estimate": 1,
    "vendor": 2,
    "lmarena": 3,
    "swebench": 4,
    "artificial_analysis": 4,
}

# ── Vendor-published cells ────────────────────────────────────────────────────
#
# (model_id, benchmark_key): (value, source, url, note)

CELLS: dict[tuple[str, str], tuple] = {

    # -- Zhipu AI / GLM-5.2 ---------------------------------------------------
    # Zhipu shipped the repo with no numbers on 2026-06-13 and added the full
    # eval suite six days later.
    ("glm-5-2", "gpqa_diamond"): (
        91.2, "vendor", "https://z.ai", None),
    ("glm-5-2", "hle"): (
        54.7, "vendor", "https://z.ai", "With tools enabled."),

    # -- DeepSeek V4 Pro ------------------------------------------------------
    # From the V4 technical report. NOTE: the report's headline figures are for
    # the "V4-Pro-Max" effort tier; recorded here against the Pro row with the
    # tier named, since that is the tier the numbers describe.
    ("deepseek-v4-pro", "swe_bench_verified"): (
        80.6, "vendor", "https://arxiv.org/pdf/2606.19348",
        "V4-Pro-Max effort tier."),
    ("deepseek-v4-pro", "swe_bench_pro"): (
        55.4, "vendor", "https://arxiv.org/pdf/2606.19348",
        "V4-Pro-Max effort tier."),
    ("deepseek-v4-pro", "gpqa_diamond"): (
        90.1, "vendor", "https://arxiv.org/pdf/2606.19348",
        "V4-Pro-Max effort tier."),
    ("deepseek-v4-pro", "terminal_bench_2_0"): (
        67.9, "vendor", "https://arxiv.org/pdf/2606.19348",
        "Terminal-Bench 2.0, not 2.1. V4-Pro-Max effort tier."),
    ("deepseek-v4-pro", "mmlu_pro"): (
        87.5, "vendor", "https://arxiv.org/pdf/2606.19348",
        "V4-Pro-Max effort tier."),

    # -- Alibaba / Qwen 3.7 Max -----------------------------------------------
    ("qwen-3-7-max", "gpqa_diamond"): (
        92.4, "vendor",
        "https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154",
        None),
    ("qwen-3-7-max", "swe_bench_verified"): (
        80.4, "vendor",
        "https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154",
        None),
    ("qwen-3-7-max", "swe_bench_pro"): (
        60.6, "vendor",
        "https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154",
        None),
    ("qwen-3-7-max", "terminal_bench_2_0"): (
        69.7, "vendor",
        "https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154",
        "Terminal-Bench 2.0-Terminus, not 2.1."),

    # -- Google / Gemini 3.5 Flash --------------------------------------------
    # Announced at I/O 2026, 2026-05-19. All Google-reported.
    ("gemini-3-5-flash", "gpqa_diamond"): (
        92.2, "vendor", "https://blog.google", None),
    ("gemini-3-5-flash", "swe_bench_pro"): (
        55.1, "vendor", "https://blog.google", None),
    ("gemini-3-5-flash", "terminal_bench_2_1"): (
        76.2, "vendor", "https://blog.google", None),

    # -- Microsoft / MAI-Thinking-1 -------------------------------------------
    ("mai-thinking-1", "gpqa_diamond"): (
        84.2, "vendor", "https://microsoft.ai/models/mai-thinking-1/", None),
    ("mai-thinking-1", "swe_bench_verified"): (
        73.5, "vendor", "https://microsoft.ai/models/mai-thinking-1/", None),
    ("mai-thinking-1", "terminal_bench_2_0"): (
        46.0, "vendor", "https://microsoft.ai/models/mai-thinking-1/",
        "Terminal-Bench 2.0, not 2.1."),

    # -- Moonshot / Kimi K3 ---------------------------------------------------
    ("kimi-k3", "hle"): (
        43.5, "vendor", "https://moonshot.ai",
        "HLE-Full without tools; 56.0 with tools."),

    # -- MiniMax M2.7 ---------------------------------------------------------
    ("minimax-m2-7", "gpqa_diamond"): (
        89.8, "vendor", "https://www.minimax.io/news/minimax-m27-en", None),
    ("minimax-m2-7", "swe_bench_pro"): (
        56.2, "vendor", "https://www.minimax.io/news/minimax-m27-en", None),
    ("minimax-m2-7", "terminal_bench_2_0"): (
        57.0, "vendor", "https://www.minimax.io/news/minimax-m27-en",
        "Terminal-Bench 2.0, not 2.1."),
}


def rank(cell: object) -> int:
    if not isinstance(cell, dict):
        return -1
    return SOURCE_RANK.get(cell.get("source") or "", -1)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true",
                    help="overwrite even when the existing source ranks higher")
    args = ap.parse_args()

    data = json.loads(MODELS_JSON.read_text())
    by_id = {m["id"]: m for m in data["models"]}

    applied = skipped = unknown = 0

    for (mid, key), (value, source, url, note) in CELLS.items():
        if mid not in by_id:
            print(f"  ? unknown model id '{mid}' - skipped")
            unknown += 1
            continue
        if key not in BENCHMARKS:
            print(f"  ? unknown benchmark '{key}' - skipped")
            unknown += 1
            continue
        if source not in SOURCES:
            print(f"  ? unknown source '{source}' - skipped")
            unknown += 1
            continue

        cells = by_id[mid].setdefault("benchmarks", {})
        existing = cells.get(key)

        if existing is not None and rank(existing) > SOURCE_RANK[source] and not args.force:
            print(f"  = {mid}.{key}: kept existing "
                  f"'{existing.get('source')}' (outranks '{source}')")
            skipped += 1
            continue

        cell = {"value": value, "source": source, "url": url, "measured": READ_ON}
        if note:
            cell["note"] = note

        was = f" (was {existing.get('source')} {existing.get('value')})" \
            if isinstance(existing, dict) else ""
        print(f"  + {mid}.{key} = {value} [{source}]{was}")
        cells[key] = cell
        applied += 1

    print(f"\napplied {applied}, skipped {skipped}, unknown {unknown}")

    if args.dry_run:
        print("--dry-run: nothing written")
        return

    MODELS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {MODELS_JSON}")


if __name__ == "__main__":
    main()
