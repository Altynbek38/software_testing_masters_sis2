# Toolshop E2E Test Suite & CI Pipeline

## CI

[![Playwright Tests](https://github.com/Altynbek38/software_testing_masters_sis2/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/<owner>/<repo>/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built into GitHub, where the repository already lives, needs no server of its own, is free for public repositories, and natively supports matrix strategies for sharding.

**Pipeline** (`.github/workflows/playwright.yml`):
- runs on every `push`, `pull_request`, and manual `workflow_dispatch`;
- `npm ci` with the npm cache enabled, Chromium installed with Linux system dependencies (`--with-deps`);
- the full Playwright suite split into 4 shards (`--shard=i/4`) running in parallel (`fail-fast: false`);
- the `merge-reports` job merges the shards' blob reports into one unified HTML report and JUnit XML file;
- artefacts: `playwright-report` (HTML), `test-results-1..4` (traces, screenshots, videos, JUnit), and `junit-report`; kept for 14 days.

**CI settings** (`playwright.config.ts`, when `CI=true`):
`forbidOnly: true`, `retries: 2`, `workers: 2`, reporters `list`, `blob`, `junit`, `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`.

### Quality Gates: What Blocks a Merge vs. What Only Reports
A gate that fires falsely destroys team trust and gets bypassed. Therefore, our pipeline draws a strict line:
- **Blocks a Merge (Hard Gate):**
  - Dependency installation or TypeScript compilation failures (`npm ci`).
  - Accidental commit of `test.only` (enforced via `forbidOnly: true`).
  - Deterministic E2E functional test failures that fail even after 2 automatic retries (`retries: 2`).
- **Reports Only (Advisory / Non-Blocking):**
  - Flaky tests that fail on the first attempt due to transient demo-server latency but pass on retry (marked as *flaky* in the report with an attached trace for triage, without failing the pipeline).
  - JUnit XML and HTML reports uploaded as artifacts for visibility and trend tracking.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | 1 min 45 s | 42 s | [run](PASTE_LINK_TO_1_SHARD_RUN_HERE) |
| 4 shards + merge | 1 min 30 s | 16 s | [run](PASTE_LINK_TO_4_SHARD_RUN_HERE) |

*Median of runs via `workflow_dispatch`. Conclusion: Sharding cut the actual test execution step time by more than half, though total workflow duration drops more modestly because each shard spends ~45–60 seconds on runner provisioning and Chromium installation.*

### Running locally

```bash
npm ci
npx playwright install --with-deps chromium
CI=true npx playwright test