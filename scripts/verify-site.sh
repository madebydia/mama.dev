#!/usr/bin/env bash
set -euo pipefail

site_dir="${1:-public}"
plausible_script="pa-FbfZnrKrtH_PX4s12h-v-.js"
html_count=0

python3 scripts/verify-food-menu.py

while IFS= read -r -d '' html_file; do
  html_count=$((html_count + 1))
  script_count="$( (grep -o "$plausible_script" "$html_file" || true) | wc -l | tr -d ' ' )"
  if [[ "$script_count" != "1" ]]; then
    echo "Expected one shared Plausible script in $html_file; found $script_count" >&2
    exit 1
  fi
done < <(find "$site_dir" -type f -name '*.html' -print0)

if [[ "$html_count" -eq 0 ]]; then
  echo "No rendered HTML files found in $site_dir" >&2
  exit 1
fi

activity_total="$(sed -n 's/^shown: //p' data/repo-activity.yaml)"
rendered_dots="$( (grep -o 'class="commit-dot"' "$site_dir/index.html" || true) | wc -l | tr -d ' ' )"
if [[ -z "$activity_total" || "$rendered_dots" != "$activity_total" ]]; then
  echo "Expected $activity_total repository activity dots; found $rendered_dots" >&2
  exit 1
fi

if grep -R -q 'pa-npN8w62yxyktyIX5ssSBd.js' "$site_dir" --include='*.html'; then
  echo "The retired airplane-only Plausible script is still present" >&2
  exit 1
fi

for required_file in \
  index.html \
  collection/index.html \
  collection/assets/lexus-lx.png \
  collection/assets/hot-wheels-limozeen.png \
  collection/assets/beluga-xl.png \
  collection/assets/super-guppy.png \
  collection/assets/cessna-172.png \
  collection/assets/sources.tsv \
  worksheets/index.html \
  worksheets/files/airplane-words-have-jobs.pdf \
  worksheets/previews/airplane-words-have-jobs.jpg \
  worksheets/files/kid-pilot-call-and-response-checklists.pdf \
  worksheets/previews/kid-pilot-call-and-response-checklists.jpg \
  worksheets/files/parts-of-a-beluga-whale.pdf \
  worksheets/previews/parts-of-a-beluga-whale.jpg \
  worksheets/files/build-action-switch-cards.pdf \
  worksheets/previews/build-action-switch-cards.jpg \
  games/index.html \
  games/word-train/index.html \
  what-to-eat/index.html \
  what-to-eat/foods.json \
  what-to-eat/images/chicken.webp \
  what-to-eat/images/fish.webp \
  what-to-eat/images/yogurt.webp \
  what-to-eat/images/apple.webp \
  airplane-games/logic-hangar.html \
  one-true-story/stories/wright-brothers.html \
  log-templates/index.html \
  robots.txt \
  sitemap.xml \
  CNAME; do
  if [[ ! -f "$site_dir/$required_file" ]]; then
    echo "Missing required output: $required_file" >&2
    exit 1
  fi
done

if ! grep -q 'id:"build-action-switch-cards"' "$site_dir/worksheets/index.html"; then
  echo "Build-Action Switch Cards catalog record is missing" >&2
  exit 1
fi

collection_image_count="$(find "$site_dir/collection/assets" -maxdepth 1 -type f -name '*.png' | wc -l | tr -d ' ')"
if [[ "$collection_image_count" != "47" ]]; then
  echo "Expected 47 collection images; found $collection_image_count" >&2
  exit 1
fi

if ! grep -q 'aria-label=Collection>COLLECTION</div>' "$site_dir/collection/index.html"; then
  echo "Collection header is missing" >&2
  exit 1
fi

for collection_label in 'All vehicles' 'Land vehicles' 'Air & space'; do
  if ! grep -q "$collection_label" "$site_dir/collection/index.html"; then
    echo "Collection filter is missing: $collection_label" >&2
    exit 1
  fi
done

for collection_title in 'Cars, trucks,<br class="mobile-title-break"> aircraft & spacecraft.' 'Cars &<br class="mobile-title-break"> trucks.' 'Aircraft &<br class="mobile-title-break"> spacecraft.'; do
  if ! grep -q "$collection_title" "$site_dir/collection/index.html"; then
    echo "Collection filter title is missing: $collection_title" >&2
    exit 1
  fi
done

if ! grep -q 'footer-copy>Household collection index · audited 2026-08-29' "$site_dir/collection/index.html"; then
  echo "Collection index footer is missing" >&2
  exit 1
fi

if grep -q '46 cataloged models.' "$site_dir/collection/index.html"; then
  echo "Redundant collection footer count is still present" >&2
  exit 1
fi

if grep -qi 'scale not recorded' "$site_dir/collection/index.html"; then
  echo "Unresolved collection scale note is still present" >&2
  exit 1
fi

for surprise_detail in 'surprise:!0' 'Shh, it’s a surprise' 'Click and hold to reveal' 'Press and hold to reveal surprise model' 'surpriseHoldDuration=900' 'classList.remove("is-revealed")' 'setAttribute("aria-hidden","true")'; do
  if ! grep -q "$surprise_detail" "$site_dir/collection/index.html"; then
    echo "Collection surprise-card behavior is missing: $surprise_detail" >&2
    exit 1
  fi
done

if ! grep -q 'ref:"CESSNA 172 SKYHAWK",surprise:!0' "$site_dir/collection/index.html"; then
  echo "Cessna is not configured as the surprise model" >&2
  exit 1
fi

if ! grep -q 'ref:"GDG86 · B07DTMXT6Z",surprise:!0' "$site_dir/collection/index.html"; then
  echo "Mickey Mouse Band Concert Covelight is not configured as a surprise model" >&2
  exit 1
fi

for collection_total in 'visible-count>47</strong><br>showing' '<strong>31</strong><br>land' '<strong>16</strong><br>air + space'; do
  if ! grep -q "$collection_total" "$site_dir/collection/index.html"; then
    echo "Collection total is missing: $collection_total" >&2
    exit 1
  fi
done

for collection_scale in 'White · 1:69' 'Light blue · 1:61' 'White / gray · 1:99' 'non-uniform Sky Busters scale' 'approx. 1:480 from published dimensions' 'approx. 1:420 by length · toy proportions'; do
  if ! grep -q "$collection_scale" "$site_dir/collection/index.html"; then
    echo "Collection scale detail is missing: $collection_scale" >&2
    exit 1
  fi
done

if ! grep -q 'Acquired November 1, 2025 · propellers broken' "$site_dir/collection/index.html"; then
  echo "Super Guppy condition note is missing" >&2
  exit 1
fi

for collection_model in 'Airbus A320 Beluga' 'Airbus A330 Beluga XL' 'Aero Spacelines 377SGT Super Guppy'; do
  model_count="$(grep -o "$collection_model" "$site_dir/collection/index.html" | wc -l | tr -d ' ')"
  if [[ "$model_count" != "1" ]]; then
    echo "Expected one collection record for $collection_model; found $model_count" >&2
    exit 1
  fi
done

if grep -qE 'footer-mark|Matchbox, Daron, and Skymarks|Product photography is stored locally' "$site_dir/collection/index.html"; then
  echo "Retired collection footer branding or copy is still present" >&2
  exit 1
fi

dad_collection_notes="$(grep -o "Dad's collection" "$site_dir/collection/index.html" | wc -l | tr -d ' ')"
if [[ "$dad_collection_notes" != "10" ]]; then
  echo "Expected 10 Dad's collection notes; found $dad_collection_notes" >&2
  exit 1
fi

if ! grep -q '@media(max-width:500px)' "$site_dir/collection/index.html" || ! grep -q '.collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))' "$site_dir/collection/index.html"; then
  echo "Collection mobile grid is not two columns" >&2
  exit 1
fi

echo "Verified $html_count HTML pages with one shared Plausible head each."
