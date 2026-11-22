# AI Output Review and Corrections

## 1. Initial AI output problems

The first AI-generated draft was useful as a starting point, but it was not submission-ready. During review and real execution, several issues were identified:

- direct locators were placed in spec files;
- hard-coded `fixed sleep calls` calls were used for synchronisation;
- registration initially used reusable/static data;
- login logic relied on brittle network-response assumptions during debugging;
- the purchase test completed checkout but did not prove that the cart contained the correct product and quantity;
- the product comparison test manipulated locators directly in the spec;
- the reset-password test covered only the known-email path;
- the Playwright config forced `workers: 1` and disabled full parallel execution;
- there was no submission README describing installation and design decisions.

## 2. Corrections made

### Correction 1 — Removed hard-coded waits

All `fixed sleep calls` calls were removed. Synchronisation now relies on Playwright auto-waiting and web-first assertions such as `toBeVisible`, `toBeEnabled`, `toHaveText`, and `toHaveValue`.

**Why:** a fixed sleep guesses how long the application needs and creates unnecessary flakiness. Web-first assertions wait for the actual state required by the test.

### Correction 2 — Moved all UI locators out of spec files

Direct `page.getByTestId(...)` and `page.locator(...)` usage was removed from every spec. Locators now live in Page Objects:

- `LoginPage`
- `RegisterPage`
- `ProductPage`
- `CheckoutPage`
- `ForgotPasswordPage`

**Why:** the assignment requires Page Objects and explicitly forbids locators in spec files. Specs now describe intent rather than DOM details.

### Correction 3 — Used stable test IDs and semantic roles

The Page Objects use the application's `data-test` attributes via `getByTestId()` and semantic roles via `getByRole()` where appropriate. There are no CSS-class locators or positional XPath expressions.

**Why:** the assignment identifies `data-test` as the intended test contract. This is more stable than styling classes or layout-dependent XPath.

### Correction 4 — Strengthened registration independence

The registration factory now uses `crypto.randomUUID()` to generate both a unique email component and a high-entropy password.

**Why:** registration must be repeatable and must not fail because an account already exists. A high-entropy password also avoids rejection caused by commonly breached passwords.

### Correction 5 — Strengthened login assertions

The valid-login test waits for the account menu and verifies the `/account` URL. The invalid-login test verifies the error, verifies that the account menu is not shown, and verifies that the browser remains on `/auth/login`.

**Why:** checking both positive and negative observable states makes the test prove authentication behaviour instead of only proving that a button was clicked.

### Correction 6 — Made the purchase test prove the cart contents

`ProductPage.openAvailableProduct()` now returns the selected product's name and price. After adding it to the cart, the test asserts that:

- the cart product title equals the selected product name;
- the cart quantity equals `1`;
- checkout ends with the payment success message.

**Why:** the rubric specifically requires “Add to cart → cart shows the right item and quantity → checkout completes”. The earlier version only proved the final checkout state.

### Correction 7 — Refactored the comparison test

Product navigation and extraction are now performed through `ProductPage.getProductDetailsByIndex()`. The spec compares plain returned values and asserts:

- the two names are different;
- both prices are positive;
- the prices are different.

**Why:** this keeps locators out of the spec while still making the stated comparison explicit and falsifiable.

### Correction 8 — Completed both reset-password paths

A dedicated `ForgotPasswordPage` was added. The reset-password test now submits:

1. the email of a fresh, API-registered test account and verifies a confirmation state;
2. a unique unknown email and verifies a different non-empty error state.

**Why:** the assignment requires both the known-email confirmation and invalid/unknown-email error behaviour.

### Correction 9 — Enabled independent parallel execution

The config now uses `fullyParallel: true` and does not force a single worker. GitHub Actions runs four shard jobs, with two Playwright workers configured inside each CI job.

**Why:** the assignment requires tests to pass in any order and in parallel. A forced single worker would hide shared-state problems instead of satisfying the requirement.

### Correction 10 — Added clean-clone documentation and scripts

A `README.md` was added with setup commands, test coverage, structure, design decisions, and AI disclosure. Useful npm scripts were also added to `package.json`.

**Why:** the grader must be able to clone the repository, install dependencies, and run the suite without machine-specific knowledge.

## 3. Final review checklist

The final source was statically checked for the rubric constraints:

- no `fixed sleep calls` calls;
- no direct Playwright locators in spec files;
- no CSS-class or positional-XPath locators;
- custom fixture present;
- unique generated registration data;
- five required spec files present;
- meaningful assertions present in every executable test;
- parallel execution enabled;
- README and AI appendix present.

Playwright test discovery also succeeds and lists six executable tests across the five required spec files.

### Correction 11 — Replaced the invalid cart title selector found during parallel execution

A full `npx playwright test` run with six parallel workers exposed one remaining issue in the purchase flow: the draft waited for `data-test="product-title"`, which is not present on the current cart page. Five other tests passed in the same parallel run.

The cart page object was corrected to wait for the known cart-step control (`proceed-1`) and to verify the selected cart item semantically by its visible product name and the quantity input in that product row. The product page also waits for the cart badge to reflect the added item before navigation.

**Why:** this fixes the selector against the current sprint without adding a fixed delay, keeps all DOM knowledge inside Page Objects, and preserves the required assertion that the cart contains the correct item with quantity `1`.

### Correction 12 — Removed Locator objects from spec-level assertions

The final review interpreted “No locator anywhere in a spec file” strictly. Specs no longer receive Locator objects such as `loginPage.accountMenu` or `checkoutPage.successMessage`. Page Objects now expose business-level methods that return booleans, text, or structured values, and the specs assert those plain values.

**Why:** this makes the separation between test intent and UI implementation unambiguous and avoids even indirect Locator usage in spec files.

## CI round: corrections after the first GitHub Actions run (2026-11-22)

- The initial `ci-setup` workflow exercised only a single shard (`1/1`) despite the four-shard assignment requirement. The workflow matrix was updated to run four shards in parallel and merge their blob reports.
- CI's registration scenario reached `/auth/login` on a retry, but the test expected the nonexistent `data-test="login-form"` attribute. A page-object method now uses web-first URL and **real email/password field** assertions.
- Valid login and checkout both timed out on `data-test="nav-menu"`, so the presence of that UI element was not proof of why authentication failed. A `waitForAccountPage()` page-object method now checks the required `/account` URL and includes the application's login-error text in failures. This does not mask failed authentication.
- Shared seeded accounts can change state. The Toolshop OpenAPI explicitly describes its forgot-password operation as changing the selected user's password. The `registeredCustomer` fixture now uses a fresh API-created account for the valid login, checkout and positive password-reset cases. These tests remain independent and continue to exercise the UI for their core behaviours.
- `data-test` selectors remain inside page objects; test specifications assert plain returned values. No fixed sleeps were added.
- A static test discovery run found six test cases. A subsequent live push run of GitHub Actions (**#5**, commit `50382e4`) passed with all four shards and the merge job green. The merged JUnit and HTML reports confirm **6 tests, 0 failures**, as shown in the author-provided screenshots. A PR-triggered run and a successful single-shard timing baseline must still be recorded.

Sources consulted: official API schema at `https://api.practicesoftwaretesting.com/docs`, the existing `ci-setup` files, and the failing GitHub Actions console log. AI tool: OpenAI ChatGPT GPT-6. Reviewer must confirm the eventual GitHub run, screenshots/traces, and actual timing table values.

## Final CI results and evidence (2026-11-22)

- Earlier CI run: registration failed in a test that checked for a login-page `data-test="email"` locator after form submission. This check was not the strongest proof of successful registration and was inconsistent on the Linux runner.
- Correction: `RegisterPage.submit()` now captures the actual `POST /users/register` response, requires HTTP **201**, and verifies that the user reaches `/auth/login`. The test asserts the returned status and final URL.
- Four-shard workflow was enabled with `shardIndex: [1, 2, 3, 4]` and `shardTotal: [4]`, while the merge job combines blob reports into HTML and JUnit artifacts.
- Confirmed in the screenshot of green GitHub Actions push run **#5** (`ci-setup`, commit `50382e4`): four shard jobs and report merge completed successfully. Total workflow duration shown: **49 seconds**.
- Confirmed in downloaded reports: merged JUnit summary shows `tests="6"`, `failures="0"`, `skipped="0"`, `errors="0"`; HTML report lists all six tests as passed.

**Open evidence tasks:** Capture the direct run URL for this green push, obtain a successful `pull_request`-triggered run, measure a successful one-shard baseline with the same source, record actual run-step durations, and verify the workflow after merging into `main`. These must not be claimed as complete until confirmed.
