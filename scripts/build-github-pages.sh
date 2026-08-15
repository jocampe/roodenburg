#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "${script_dir}/.." && pwd)"

export GITHUB_PAGES=true
export GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-jocampe/roodenburg}"

cd "${project_root}"
rm -rf out
./node_modules/.bin/next build
node scripts/finalize-github-pages.mjs out
node scripts/validate-github-pages.mjs out
