#!/usr/bin/env python3
"""Render carousel images from the catalog PDFs. Requires Poppler on PATH.

Run after adding or replacing a multi-page worksheet; commit the resulting JPGs.
Catalog page counts must match the PDFs. No PDF files are changed.
"""

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "legacy-pages/worksheets"
source = (ROOT / "index.html").read_text()
worksheets = json.loads(re.search(r"const worksheets = (\[.*?\]);", source, re.S)[1])

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--check", action="store_true", help="Check carousel assets without Poppler")
parser.add_argument("--site-dir", type=Path, default=ROOT, help="Worksheet directory to check")
args = parser.parse_args()
if args.check:
    total = 0
    for item in worksheets:
        if item["pages"] < 2:
            continue
        for page in range(1, item["pages"] + 1):
            image = args.site_dir / "previews" / f"{item['id']}-page-{page}.jpg"
            if not image.is_file() or not image.read_bytes().startswith(b"\xff\xd8\xff"):
                raise SystemExit(f"Missing or invalid carousel image: {image}")
            total += 1
    print(f"Verified {total} carousel images.")
    raise SystemExit(0)

# Validate the full catalog before writing any images.
for item in worksheets:
    info = subprocess.check_output(["pdfinfo", str(ROOT / item["file"])], text=True)
    count = int(re.search(r"^Pages:\s+(\d+)", info, re.M)[1])
    if count != item["pages"]:
        raise SystemExit(f"{item['id']}: catalog says {item['pages']} pages; PDF has {count}")

total = 0
with tempfile.TemporaryDirectory(prefix="worksheet-previews-") as scratch:
    for item in worksheets:
        if item["pages"] < 2:
            continue
        for page in range(1, item["pages"] + 1):
            name = f"{item['id']}-page-{page}"
            prefix = Path(scratch) / name
            subprocess.run([
                "pdftoppm", "-f", str(page), "-l", str(page), "-singlefile",
                "-scale-to", "1400", "-jpeg", "-jpegopt", "quality=85",
                str(ROOT / item["file"]), str(prefix),
            ], check=True)
            (ROOT / "previews" / f"{name}.jpg").write_bytes(prefix.with_suffix(".jpg").read_bytes())
            total += 1
        print(f"Rendered {item['pages']} pages: {item['id']}")
print(f"Rendered {total} carousel images.")
