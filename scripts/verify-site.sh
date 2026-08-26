#!/usr/bin/env bash
set -euo pipefail

site_dir="${1:-public}"
plausible_script="pa-FbfZnrKrtH_PX4s12h-v-.js"
html_count=0

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
if [[ "$collection_image_count" != "44" ]]; then
  echo "Expected 44 collection images; found $collection_image_count" >&2
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

for collection_title in 'Cars, trucks, aircraft & spacecraft.' 'Cars & trucks.' 'Aircraft & spacecraft.'; do
  if ! grep -q "$collection_title" "$site_dir/collection/index.html"; then
    echo "Collection filter title is missing: $collection_title" >&2
    exit 1
  fi
done

if ! grep -q '44 cataloged models.' "$site_dir/collection/index.html"; then
  echo "Collection footer count is missing" >&2
  exit 1
fi

if grep -qE 'footer-mark|Matchbox, Daron, and Skymarks|Product photography is stored locally' "$site_dir/collection/index.html"; then
  echo "Retired collection footer branding or copy is still present" >&2
  exit 1
fi

if ! grep -q '@media(max-width:500px){.collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))' "$site_dir/collection/index.html"; then
  echo "Collection mobile grid is not two columns" >&2
  exit 1
fi

echo "Verified $html_count HTML pages with one shared Plausible head each."
