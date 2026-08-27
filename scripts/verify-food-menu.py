#!/usr/bin/env python3
"""Validate the data and local image references for the what-to-eat menu."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MENU_DIR = ROOT / "legacy-pages" / "what-to-eat"
DATA_FILE = MENU_DIR / "foods.json"
SECTIONS = {"Proteins", "Dairy", "Fruits", "Vegetables", "Carbs", "And More"}
COLORS = {"red", "blue", "yellow", "green"}
NUTRITION_FIELDS = {"portion", "calories", "protein", "carbs", "fat"}


def main() -> None:
    foods = json.loads(DATA_FILE.read_text())
    if not isinstance(foods, list) or not foods:
        raise SystemExit("foods.json must contain a non-empty list")

    ids = set()
    for index, food in enumerate(foods, start=1):
        label = food.get("id", f"item {index}")
        required = {"id", "name", "section", "categories", "color", "nutrition"}
        missing = required - food.keys()
        if missing:
            raise SystemExit(f"{label}: missing {', '.join(sorted(missing))}")
        if food["id"] in ids:
            raise SystemExit(f"{label}: duplicate id")
        ids.add(food["id"])
        if food["section"] not in SECTIONS:
            raise SystemExit(f"{label}: unknown section {food['section']!r}")
        if food["color"] not in COLORS:
            raise SystemExit(f"{label}: unknown color {food['color']!r}")
        if not isinstance(food["categories"], list) or not food["categories"]:
            raise SystemExit(f"{label}: categories must be a non-empty list")
        if set(food["nutrition"]) != NUTRITION_FIELDS:
            raise SystemExit(f"{label}: nutrition fields must be {sorted(NUTRITION_FIELDS)}")
        for field in ("calories", "protein", "carbs", "fat"):
            value = food["nutrition"][field]
            if not isinstance(value, (int, float)) or value < 0:
                raise SystemExit(f"{label}: {field} must be a non-negative number")
        image_path = food.get("image")
        if not image_path:
            raise SystemExit(f"{label}: image is required")
        if Path(image_path).is_absolute() or not (MENU_DIR / image_path).is_file():
            raise SystemExit(f"{label}: image does not exist: {image_path}")

    print(f"Verified {len(foods)} foods with {len(foods)} illustrations.")


if __name__ == "__main__":
    main()
