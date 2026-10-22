# SIS 2: Test Automation with Playwright

## Project description

This project automates the five required end-to-end UI test cases for the Practice Software Testing Toolshop at `https://practicesoftwaretesting.com` using Playwright and TypeScript.

The suite follows the Page Object Model and custom fixture pattern. UI locators are defined only inside page objects, while spec files describe the test behaviour and assertions.

## Required test coverage

| # | Test case | Proof provided by the suite |
|---|---|---|
| 1 | Register a new customer | Generates unique registration data, submits the form, and verifies that the user reaches the login page. |
| 2 | Log in | Valid credentials reach the account area; invalid credentials show an error and do not authenticate the user. |
| 3 | Buy a product | Selects an in-stock product, adds it to the cart, verifies the same product and quantity `1`, and completes checkout successfully. |
| 4 | Compare two products | Opens two products, captures both names and prices, and asserts that the products and their prices differ while both prices are valid positive values. |
| 5 | Reset a password | Verifies the confirmation state for a known email and a different error state for a unique unknown email. |

## Structural requirements implemented

1. **Page Objects:** locators and UI interactions are kept in `pages/`.
2. **Fixture:** page objects are injected through `fixtures/pages.fixture.ts`.
3. **Stable locators:** page objects use `getByTestId`, `getByRole`, and other semantic Playwright locators; there are no CSS-class or positional-XPath locators.
4. **No hard-coded waits:** there is no `fixed sleep calls` in the project.
5. **Unique data:** registration and the negative reset-password flow create unique data per run.
6. **Independent execution:** tests do not depend on another test having run first.
7. **Parallel execution:** `fullyParallel: true` is enabled and the config does not force a single worker.
8. **Meaningful assertions:** every test asserts observable behaviour that can fail.

The five required cases are implemented in five spec files. The login case is split into valid and invalid Playwright tests, so the runner reports six executable tests in total.
