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
| Log in | `tests/login.spec.ts` | Valid credentials expose the account menu and reach `/account`; invalid credentials show an error and stay on the login page. |
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
├── Description.md
├── Prompt.md
├── Review.md
├── package.json
├── package-lock.json
└── playwright.config.ts
```

## Design decisions

### Page Object Model
All UI locators live in `pages/`. Spec files contain business-level actions and assertions only. There are no `page.getBy...`, `page.locator(...)`, CSS selectors, or XPath selectors in the spec files.

### Stable locators
The application exposes `data-test` attributes. `playwright.config.ts` maps Playwright's `getByTestId()` to `data-test` through:

```ts
testIdAttribute: 'data-test'
```

Where a semantic role is more appropriate, page objects use `getByRole()`.

### No hard-coded sleeps
The project contains no `fixed sleep calls`. Synchronisation uses Playwright auto-waiting and web-first assertions such as `toBeVisible`, `toBeEnabled`, `toHaveText`, and `toHaveValue`.

### Independent and parallel tests
`fullyParallel: true` is enabled and no fixed worker count is configured. Each Playwright test receives a fresh browser context. Registration generates unique data with `crypto.randomUUID()`, and the reset-password negative case generates a unique unknown email.

### Seeded account
The valid login and checkout flows use the Toolshop seeded account:

```text
customer3@practicesoftwaretesting.com / pass123
```

This account is part of the current Toolshop default dataset. The password-reset positive case uses the known seeded email `customer@practicesoftwaretesting.com`.

### Meaningful assertions
Every executable test contains assertions that can fail for the behaviour it is intended to prove. In particular, checkout does not only assert that payment completes: it first checks that the cart contains the product selected by the test and that its quantity is `1`.

## AI disclosure — Level 1

AI assistance was used and is disclosed as required by the assignment.

- `Prompt.md` records the prompts/tasks given to AI tools.
- `Review.md` documents problems found in AI-generated suggestions and the corrections made before submission.

The final suite was reviewed against the assignment rules rather than accepting generated code unchanged.

## Generated files

The following are intentionally excluded by `.gitignore` and should not be committed:

- `node_modules/`
- `test-results/`
- `playwright-report/`
- Playwright caches/auth state
