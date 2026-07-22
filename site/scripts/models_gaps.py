#!/usr/bin/env python3
"""
Report which ranked models are short of sourced benchmark data.

    python3 scripts/models_gaps.py            # models below the floor
    python3 scripts/models_gaps.py --all      # every current model

Used by the weekly maintainer run to decide what to chase, replacing the old
"fill all 8 cells" habit with "find a real source for the cells we're missing".
Prints nothing actionable when every ranked model clears the floor.
"""

import argparse
import json
from pathlib import Path

from models_schema import (
    BENCHMARKS,
    LIVE_BENCHMARKS,
    MIN_SCORED_CELLS,
    RANKED_STATUSES,
    SOURCES,
)

ROOT = Path(__file__).resolve().parent.parent
MODELS_JSON = ROOT / "src" / "data" / "models.json"


def scoreable(cell: object) -> bool:
    if not isinstance(cell, dict) or cell.get("value") is None:
        return False
    src = SOURCES.get(cell.get("source") or "")
    return bool(src and src["scoreable"] and src.get("redistributable", True))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="include models above the floor")
    args = ap.parse_args()

    data = json.loads(MODELS_JSON.read_text())
    rows = []

    for m in data["models"]:
        if m.get("status") not in RANKED_STATUSES:
            continue
        cells = m.get("benchmarks") or {}
        have = [k for k in LIVE_BENCHMARKS if scoreable(cells.get(k))]
        missing = [k for k in LIVE_BENCHMARKS if not scoreable(cells.get(k))]
        if args.all or len(have) < MIN_SCORED_CELLS:
            rows.append((len(have), m["id"], m.get("vendor", "?"),
                         m.get("vendor_link", ""), have, missing))

    rows.sort()

    print(f"floor = {MIN_SCORED_CELLS} sourced live cells\n")
    for n, mid, vendor, link, have, missing in rows:
        flag = "OK " if n >= MIN_SCORED_CELLS else "GAP"
        print(f"[{flag}] {mid}  ({vendor})  {n} sourced")
        if have:
            print(f"        have:    {', '.join(BENCHMARKS[k]['label'] for k in have)}")
        print(f"        missing: {', '.join(BENCHMARKS[k]['label'] for k in missing)}")
        if link:
            print(f"        vendor:  {link}")
        print()

    gaps = sum(1 for r in rows if r[0] < MIN_SCORED_CELLS)
    print(f"{gaps} ranked model(s) below the floor")


if __name__ == "__main__":
    main()
