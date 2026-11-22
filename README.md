# SIS 2 — Playwright E2E Test Automation

End-to-end UI automation for the **Practice Software Testing Toolshop** application:
https://practicesoftwaretesting.com

The project is implemented with **Playwright + TypeScript** and follows the Page Object Model (POM) with custom fixtures.

## Requirements

- Node.js 20+
- npm
- Internet access to the hosted Toolshop application

## Clean-clone setup

```bash
npm install
npx playwright install chromium
npx playwright test
```

Optional commands:

```bash
npm test
npm run test:headed
npm run report
```

The normal grading command is:

```bash
npx playwright test
```

No local files, saved browser state, previous test output, or a specific execution order are required.

## Required test cases

The assignment defines five required test cases. The login case contains two independent executable scenarios, so Playwright reports **6 tests across 5 spec files**.

| Required case | Spec | What is asserted |
|---|---|---|
| Register a new customer | `tests/register.spec.ts` | A unique user is generated, registration completes, and the application reaches the login page. |
| Log in | `tests/login.spec.ts` | Newly registered valid credentials reach `/account`; invalid credentials show an error and stay on the login page. |
| Buy a product | `tests/buy-product.spec.ts` | An in-stock product is selected, the cart shows the same product with quantity `1`, and checkout finishes with a success message. |
| Compare two products | `tests/compare-products.spec.ts` | Two products are opened, their names and prices are captured, names differ, prices are positive, and the prices are different. |
| Reset a password | `tests/reset-password.spec.ts` | A known email receives the confirmation state; a unique unknown email receives a different non-empty error state. |

## Project structure

```text
SIS2/
├── data/
│   ├── test-users.ts
│   └── user.factory.ts
├── fixtures/
│   └── pages.fixture.ts
├── pages/
│   ├── base.page.ts
│   ├── checkout.page.ts
│   ├── forgot-password.page.ts
│   ├── login.page.ts
│   ├── product.page.ts
│   └── register.page.ts
├── tests/
│   ├── buy-product.spec.ts
│   ├── compare-products.spec.ts
│   ├── login.spec.ts
│   ├── register.spec.ts
│   └── reset-password.spec.ts
├── .github/workflows/playwright.yml
├── merge.config.ts
├── Description.md
├── Prompt.md
├── Review.md
├── package.json
├── package-lock.json
└── playwright.config.ts
```

## Design decisions

### Page Object Model
All UI locators live in `pages/`. Spec files contain business-level actions and assertions over plain booleans, strings, numbers, and returned data objects only. They do not construct or receive Playwright `Locator` objects. There are no `page.getBy...`, `page.locator(...)`, CSS selectors, or XPath selectors in the spec files.

### Stable locators
The application exposes `data-test` attributes. `playwright.config.ts` maps Playwright's `getByTestId()` to `data-test` through:

```ts
testIdAttribute: 'data-test'
```

Where a semantic role is more appropriate, page objects use `getByRole()`.

### No hard-coded sleeps
The project contains no `fixed sleep calls`. Synchronisation uses Playwright auto-waiting and web-first assertions such as `toBeVisible`, `toBeEnabled`, `toHaveText`, and `toHaveValue`.

### Independent and parallel tests
`fullyParallel: true` is enabled. Local runs use Playwright's default worker count; CI configures 2 workers inside each of four parallel shard jobs. Each Playwright test receives a fresh browser context. Registration generates unique data with `crypto.randomUUID()`, and the reset-password negative case generates a unique unknown email.

### Independent customers created via API

A function-scoped `registeredCustomer` fixture uses Playwright's `request` API to create a new account via the documented `POST /users/register` endpoint. This account is unique per test (created by `generateUser()`). Valid-login and checkout **still use the real browser UI** to authenticate with the new credentials. The positive forgot-password flow resets its *own fresh account*, not a shared seeded user. No shared login credential is needed for these tests.

API URL: `API_URL`, defaults to `https://api.practicesoftwaretesting.com`.
UI URL: `BASE_URL`, defaults to `https://practicesoftwaretesting.com`.

### Meaningful assertions
Every executable test contains assertions that can fail for the behaviour it is intended to prove. In particular, checkout does not only assert that payment completes: it first checks that the cart contains the product selected by the test and that its quantity is `1`.

## AI disclosure — Level 1

AI assistance was used and is disclosed as required by the assignment.

- `Prompt.md` records the prompts/tasks given to AI tools.
- `Review.md` documents problems found in AI-generated suggestions and the corrections made before submission.
- `AI_CI_Appendix.md` records AI use specifically for the GitHub Actions pipeline.

The final suite was reviewed against the assignment rules rather than accepting generated code unchanged.

## Generated files

The following are intentionally excluded by `.gitignore` and should not be committed:

- `node_modules/`
- `test-results/`
- `playwright-report/`
- Playwright caches/auth state

## CI — GitHub Actions

[![Playwright Tests](https://github.com/Altynbek38/software_testing_masters_sis2/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/Altynbek38/software_testing_masters_sis2/actions/workflows/playwright.yml)

**CI system:** GitHub Actions, chosen because it is integrated with the hosted repository and supports matrix parallelism, npm caching, and report artefacts without self-hosted infrastructure.

Workflow (`.github/workflows/playwright.yml`) triggers on **every push**, **pull request**, and manual dispatch. It runs `npm ci` with npm caching, installs Chromium with system dependencies, then splits the **full suite** into four shards (`--shard=i/4`), with `fail-fast: false` so each shard reports its result. A separate `merge-reports` job combines Playwright blob reports into HTML and JUnit XML. Trace/video/screenshot artifacts and the combined report are retained for **14 days**.

In CI, `playwright.config.ts` enables `forbidOnly`, two retries, and the `list`, `blob`, and `junit` reporters. HTML and JUnit reports are uploaded even if some tests fail.

### Verified GitHub Actions result (2026-11-22)

The successful **push** run on `ci-setup` (workflow run **#5**, commit `50382e4`) completed in **49 seconds** according to the GitHub Actions run list. The screenshots of the merged Playwright HTML and JUnit artifacts show **6 passed, 0 failed**. All four test shards and the merge job were green in this push run.

The HTML report's **8.8-second** figure describes test results in the merged report; it is **not** the full GitHub Actions workflow duration (49 seconds).

**Direct run link to insert:** Open **Actions → Playwright Tests → fix: assert registration API success in CI**, copy the URL from the address bar, and replace the placeholder below.

### CI runtime comparison

For a fair baseline, run the same corrected code in a separate temporary branch named `ci-baseline`, changing only the shard matrix to `shardIndex: [1]` and `shardTotal: [1]`. Do not use an older failed one-shard run as a successful baseline.

| Configuration | Total workflow time | Slowest `Run Playwright tests` step | GitHub Actions run |
|---|---|---|---|
| 1 shard (successful baseline) | **61 s** | **47 s** | **https://github.com/Altynbek38/software_testing_masters_sis2/actions/runs/45026523009L** |
| 4 shards + merge (successful push, 2026-11-22) | **49 s** | **34 s** | **https://github.com/Altynbek38/software_testing_masters_sis2/actions/runs/45025619161** |

**Timing conclusion:** Fill in after the successful one-shard baseline is available. For this small six-test suite, setup and browser installation overhead can dominate the overall time; sharding does not guarantee a shorter total workflow.

**Pull Request evidence:** After opening a PR from `ci-setup` into `main`, record the direct link to the successful **pull_request** workflow run here: **PASTE_PR_RUN_URL**. A push run alone is not evidence of the PR trigger.

### Local CI-mode check

```bash
npm ci
npx playwright install chromium
# Windows CMD:
set CI=true
npx playwright test
set CI=
```

> The badge refers to `main`; it will reflect the new workflow only after the PR is merged and `main` has run. Before submission, replace the run-link placeholders above, complete the one-shard timing baseline and verify a successful PR-triggered run.
