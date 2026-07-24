// Reference template — `playwright.testing-agent.config.ts`.
// This single template handles all combinations: local/cloud × with/without projects[].
//
// MODE (set via .testing-agent/config.json#browserMode)
// - Local mode (default): base import is `./playwright.config` (user's original code).
// - Cloud mode: change the base import below to `./playwright.service.config`.
//   That single import-line change is the only mode-specific edit to this file.
//
// PROJECTS[]
// - `baseConfig.projects?.map(...)` handles both cases automatically:
//   - If the base does not define `projects[]`, the expression evaluates to `undefined`,
//     so this file does not override projects and Playwright falls back to the base.
//   - If the base defines `projects[]`, the testing-agent overrides (video, viewport,
//     trace, slowMo, headed) AND `outputDir` are applied at BOTH the top level AND inside
//     each project.
// - Do not simplify the per-project propagation. Playwright's per-project `use` and
//   `outputDir` silently override the top-level ones. Without forcing them per-project, a
//   base config that sets per-project `use` turns recordings off, and one that sets a
//   per-project `outputDir` sends recordings to its own folder — where the CLI never looks,
//   so nothing gets uploaded and the dashboard shows no video. Forcing both per-project
//   keeps every artifact under the session dir.
//
// ENV VARS (set by the testing-agent CLI; safe defaults when run directly)
// - TESTING_AGENT_HEADED=1 → run headed (visible window). Defaults to headless.
// - TESTING_AGENT_SESSION_DIR=<path> → drives BOTH output locations so all artifacts
//   land in the agent's session dir:
//     · `outputDir` becomes `<path>/test-results/run/` (recordings, screenshots, traces)
//     · the JSON reporter's `outputFile` becomes `<path>/test-results.json`
//   When unset, both fall back to local defaults (`test-results/run/`, `test-results.json`).
//   To override the JSON path for a single run (e.g. heal's before/after passes),
//   set `PLAYWRIGHT_JSON_OUTPUT_FILE=<abs path>` inline on the npx command — that
//   env var wins over the `outputFile` set here per Playwright's resolution order.
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

const HEADED = process.env.TESTING_AGENT_HEADED === '1';
const SESSION_DIR = process.env.TESTING_AGENT_SESSION_DIR;
// Single source of truth for the run output dir, applied at the top level AND
// per-project so a base config's per-project `outputDir` can't redirect recordings
// out of the session dir (where the CLI looks to upload them).
const OUTPUT_DIR = SESSION_DIR ? `${SESSION_DIR}/test-results/run` : 'test-results/run';

const TESTING_AGENT_USE = {
  video: {
    mode: 'on',
    size: { width: 1280, height: 720 },
    show: {
      actions: { position: 'top-right', duration: 800, fontSize: 18 },
      test: { position: 'top-left', fontSize: 14 },
    },
  },
  viewport: { width: 1280, height: 720 },
  trace: 'retain-on-failure',
} as const;

const TESTING_AGENT_LAUNCH_EXTRAS = {
  slowMo: 250,
  ...(HEADED ? { headless: false } : {}),
};

export default defineConfig({
  ...baseConfig,
  use: {
    ...(baseConfig.use ?? {}),
    ...TESTING_AGENT_USE,
    launchOptions: { ...(baseConfig.use?.launchOptions ?? {}), ...TESTING_AGENT_LAUNCH_EXTRAS },
  },
  projects: baseConfig.projects?.map((p) => ({
    ...p,
    use: {
      ...(p.use ?? {}),
      ...TESTING_AGENT_USE,
      launchOptions: {
        ...((p.use as { launchOptions?: object })?.launchOptions ?? {}),
        ...TESTING_AGENT_LAUNCH_EXTRAS,
      },
    },
    outputDir: OUTPUT_DIR,
  })),
  // Force full parallelism on ATA's runs (overrides the base config): tests within a
  // file run concurrently too, not just across files — so the before pass surfaces
  // within-file isolation/ordering defects instead of hiding them behind serial
  // execution. Explicit `test.describe.serial()` / `test.describe.configure({ mode: 'serial' })`
  // still take precedence for a suite that genuinely must run in order.
  fullyParallel: true,
  // Default runs (scout, run, heal verify) land in the `run/` subdir so they sit
  // as a SIBLING of heal's `before/` and `after/` dirs. Playwright cleans `outputDir`
  // at the start of every run; keeping each run under its own subdir means a bare
  // (no `--output`) run can never wipe heal's `before/`/`after/` recordings.
  outputDir: OUTPUT_DIR,
  // Per-test timeout. We raise the floor (slowMo + cloud-mode latency push real
  // E2E flows well past Playwright's 30s default), but never reduce the user's
  // own setting — long-running tests (file uploads, multi-step flows) keep theirs.
  timeout: Math.max(baseConfig.timeout ?? 0, 180_000),
  reporter: [
    ['list'],
    ['json', { outputFile: SESSION_DIR ? `${SESSION_DIR}/test-results.json` : 'test-results.json' }],
  ],
});
