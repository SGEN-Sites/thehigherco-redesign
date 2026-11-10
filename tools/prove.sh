#!/usr/bin/env bash
# prove.sh — rebuild dist/ and re-run every site-reforge proof stage against it, in order, so no report can
# predate the build it describes. Usage: bash tools/prove.sh
set -uo pipefail
cd "$(dirname "$0")/.."
SR="$HOME/.claude/skills/site-reforge/scripts"
step() { printf '\n== %s\n' "$1"; }

step "build";                node src/build.mjs
step "seo (emit + repair)";  node "$SR/sr-seo.mjs" --project . --dir dist --site-url https://www.thehigherco420.com --apply | tail -4
step "seo post (sitemap)";   node tools/seo-post.mjs dist
step "responsive sweep";     rm -rf audit/sweeps-raw/rebuild audit/sweeps
                             node tools/sweep-rebuild.mjs | tail -1
                             for f in audit/sweeps-raw/baseline/*.json; do node "$SR/sr-sweep.mjs" --project . --merge "$f" --side baseline >/dev/null 2>&1; done
                             for f in audit/sweeps-raw/rebuild/*.json; do node "$SR/sr-sweep.mjs" --project . --merge "$f" >/dev/null 2>&1; done
                             node "$SR/sr-sweep.mjs" --project . --collect | tail -1
step "pixel diff";           rm -rf audit/screens/rebuild audit/screens/diff
                             node tools/shoot.mjs --dir dist --paths /,/about/,/shop/,/faqs/,/contact/,/connect/,/subscribe/ --widths 390,768,1024,1440 --pixeldiff | tail -1
                             node "$SR/sr-pixeldiff.mjs" --project . | tail -2
step "parity";               node "$SR/sr-parity.mjs" --project . | tail -6
step "fabrication";          node "$SR/sr-fabrication.mjs" --project . --strict | tail -3
step "decontaminate";        node "$SR/sr-decontaminate.mjs" --project . --strict | tail -4
step "images";               node "$SR/sr-images.mjs" --project . --dir dist | tail -4
step "rebase (check)";       node "$SR/sr-rebase.mjs" --project . --dir dist --check | tail -2
step "docs";                 node tools/docs-changelog.mjs
step "gate";                 node "$SR/sr-gate.mjs" --project . | tail -36
step "report";               node "$SR/sr-report.mjs" --project . | tail -3
