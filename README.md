# sample-webapp
Sample web application for Playwright testing

Authentication tokens are kept in memory (not persisted in browser storage) to reduce exposure to XSS token exfiltration, so users must sign in again after a page refresh or tab close.

## Seeding GitHub Copilot memory with PRs

GitHub Copilot Memory cannot be written to directly. The supported path is to give Copilot durable repository facts through normal GitHub activity, then let Copilot cloud agent and Copilot review capture those facts from the resulting issue and pull request history.

This repository now includes a lightweight flow built around `github/copilot-cloud-agent` and `gh` (requires configuring the `GH_AW_AGENT_TOKEN` repository secret for the workflow):

1. Create an issue from the included template.
2. The `Copilot memory agent` workflow assigns that issue to Copilot cloud agent when the title starts with `[copilot-memory]`.
3. Copilot opens a focused PR that codifies or documents the fact.
4. Request `github-copilot[bot]` review on that PR with the helper script below.

### 1. Open a memory-seeding issue

```bash
gh issue create --template copilot-memory-fact.md
```

Use the issue body to state a durable fact, cite the files that prove it, and ask Copilot to make a small PR around that fact.

### 2. Ask Copilot to review the PR

```bash
./scripts/request-copilot-review.sh <pr-number> \
  "Please review this change and retain any durable repository facts it proves."
```

The script requests `github-copilot[bot]` as a reviewer and also leaves an `@copilot review` comment so the PR contains an explicit review prompt.

### 3. Merge only validated facts

Only merge PRs whose facts are still supported by the code, tests, or documentation they reference. Repository-level Copilot memories are validated against cited code before they are reused, so keeping the PR scoped and well-cited makes the memory more reliable.
