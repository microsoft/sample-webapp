#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "Usage: $0 <pr-number> [review-prompt]" >&2
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required." >&2
  exit 1
fi

pr_number="$1"
review_prompt="${2:-Please review this PR and capture any durable repository facts it proves.}"
repo="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"

request_output="$(mktemp)"
if ! gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  "repos/${repo}/pulls/${pr_number}/requested_reviewers" \
  -f "reviewers[]=github-copilot[bot]" >"$request_output" 2>&1; then
  if ! grep -qiE 'already exists|review.*requested|unprocessable' "$request_output"; then
    cat "$request_output" >&2
    rm -f "$request_output"
    exit 1
  fi
fi
rm -f "$request_output"

gh pr comment "$pr_number" --body "$(cat <<EOF
@copilot review

${review_prompt}
EOF
)"

echo "Requested GitHub Copilot review for PR #${pr_number}."
