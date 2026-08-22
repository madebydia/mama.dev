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
  worksheets/index.html \
  worksheets/files/airplane-words-have-jobs.pdf \
  worksheets/previews/airplane-words-have-jobs.jpg \
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

echo "Verified $html_count HTML pages with one shared Plausible head each."
