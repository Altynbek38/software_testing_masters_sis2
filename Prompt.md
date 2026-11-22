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

## CI debugging request, November 22, 2026

**Tool and model:** OpenAI ChatGPT, GPT-6.

**User's actual request:** "Делал через другую ИИшку, проверь гит хаб — там ошибку дает. Помоги решить проблему" (I used another AI tool; check my GitHub repository, it shows an error, help me fix it). The user supplied a repository URL, screenshots of GitHub Actions, and the full failed Playwright run log.

**Actions:** reviewed the public `ci-setup` source on GitHub, interpreted CI failures, verified the Toolshop API request/response schema, replaced brittle page-object assertions, isolated customer accounts with a fixture, and corrected the workflow matrix to four shards. No live GitHub run was claimed, and any new failing output must be reviewed instead of accepting this suggestion without verification.

## Additional ChatGPT requests during CI finishing (2026-11-22)

The following requests are recorded verbatim from the working conversation (spelling preserved):

> Делал через другую ИИшку, проверь гит хаб

> там ршибку дает. Помоги решить проблему

> Что я сделал не правильно?

> что дальше делаем

> Получен зелёный запуск при создании Pull Request
> [ ] README содержит бейдж main и таблицу 1 shard vs 4 shards
> [ ] Prompt.md и Review.md отражают использование ИИ и исправления
> [ ] Ветка main содержит окончательную версию проекта
> как сделать жти помоги

AI was used to interpret failure logs and results, improve independent-user setup and registration verification, correct the four-shard workflow, and prepare documentation. Actual passing tests and GitHub Actions artifacts were verified separately by the author.

**Submission note:** The initial Gemini prompt above is preserved as recorded in the project. If your instructor requires the *exact original prompt*, compare it with the Gemini conversation and correct any differences before submitting. Do not represent paraphrases as verbatim prompts.
