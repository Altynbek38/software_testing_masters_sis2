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

1. a known seeded email and verifies a confirmation state;
2. a unique unknown email and verifies a different non-empty error state.

**Why:** the assignment requires both the known-email confirmation and invalid/unknown-email error behaviour.

### Correction 9 — Enabled independent parallel execution

The config now uses `fullyParallel: true` and no longer sets `workers: 1`.

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
