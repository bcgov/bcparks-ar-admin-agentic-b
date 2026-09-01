#!/usr/bin/env python3
"""Update backlog md/csv row GitHub column from pending to issue number."""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
KEY = sys.argv[2]
ISSUE = sys.argv[3].lstrip("#")

md = ROOT / "docs/bcparks-ar-admin-rapid-assessment-tickets.md"
csv_path = ROOT / "docs/bcparks-ar-admin-rapid-assessment-tickets.csv"

text = md.read_text()
pattern = rf"(\| {re.escape(KEY)} \|[^\n]*\| yes \| )pending( \|)"
new_text, n = re.subn(pattern, rf"\1#{ISSUE}\2", text, count=1)
if n != 1:
    raise SystemExit(f"Could not update {KEY} in markdown (matches={n})")
md.write_text(new_text)

rows = list(csv.reader(csv_path.open()))
header = rows[0]
idx = header.index("github")
id_idx = header.index("id")
updated = False
for row in rows[1:]:
    if row[id_idx] == KEY and row[idx] == "pending":
        row[idx] = f"#{ISSUE}"
        updated = True
        break
if not updated:
    raise SystemExit(f"Could not update {KEY} in csv")
with csv_path.open("w", newline="") as f:
    csv.writer(f, quoting=csv.QUOTE_ALL).writerows(rows)

print(f"Updated {KEY} -> #{ISSUE}")
