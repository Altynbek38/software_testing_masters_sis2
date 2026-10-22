# AI Appendix — Prompt Record

## AI tools used

AI assistance was used at Level 1 and is disclosed here.

1. **Gemini** — used for the initial draft, as recorded in the original project files.
2. **OpenAI ChatGPT** — used during iterative debugging, refactoring, and final compliance review.

## Initial prompt used with Gemini

> Write Playwright tests in TypeScript for the practicesoftwaretesting.com website. I need 5 tests: 1) Register a new customer, 2) Log in, 3) Buy a product, 4) Compare two products, 5) Reset a password. Give me the complete code for these tests.

## Main tasks/prompts given to ChatGPT during debugging

The work was iterative and included failing Playwright output. The main requests were:

> Fix the failing registration, login, product purchase, comparison, and reset-password Playwright tests without breaking the tests that already pass.

> Give complete replacement code for the affected files rather than only small fragments.

> Review the finished project against the assignment requirements: Page Objects, fixture use, no locators in spec files, no `fixed sleep calls`, meaningful assertions, unique data where required, independence, parallel execution, README, and AI appendix.

> Fix everything required by the rubric and produce a ready-to-submit project archive.

## Assignment constraints supplied to the AI

The AI was explicitly told that the submission must:

- run from a clean clone with `npm install` and `npx playwright test`;
- use Page Objects and at least one fixture;
- contain no locator definitions in spec files;
- contain no CSS-class or positional-XPath locators;
- contain no `fixed sleep calls` anywhere;
- use unique generated data where required;
- contain meaningful assertions;
- pass in any order and in parallel;
- include a README plus AI prompts and a review/corrections appendix.

The final code was checked against these constraints rather than treating AI output as automatically correct.
