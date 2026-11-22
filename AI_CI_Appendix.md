# AI Usage Appendix (SIS 2 CI/CD Pipeline)

## 1. Model Used
* **Model:** Google Gemini 4 Argon

## 2. Prompts Used
> **Prompt 1:**
> "Generate a GitHub Actions workflow `.github/workflows/playwright.yml` and update `playwright.config.ts` for my Playwright TypeScript repository. It must run on every push and PR, cache npm dependencies, run tests across 4 shards in parallel, merge blob reports into a single HTML and JUnit report in a separate job, and upload traces and reports with 14-day retention."

> **Prompt 2:**
> "Review how `process.env.BASE_URL` interacts with GitHub Actions `vars.BASE_URL` when the repository variable is unset, and ensure my custom `testIdAttribute: 'data-test'` from SIS 2 is preserved."

## 3. Review, Modifications, and Justifications

1. **Fixing the Empty `BASE_URL` Trap (`??` vs `||`):**
   * *Issue:* When `${{ vars.BASE_URL }}` is passed in GitHub Actions without a configured repository variable, GitHub sets `process.env.BASE_URL` to an empty string `""`. Using the nullish coalescing operator (`process.env.BASE_URL ?? 'https://...'`) fails because `""` is neither `null` nor `undefined`, resulting in Playwright trying to navigate to a relative URL without a host.
   * *Fix:* Changed `??` to logical OR `||` in both `playwright.config.ts` and `.github/workflows/playwright.yml` so an empty string safely falls back to `'https://practicesoftwaretesting.com'`.

2. **Preserving `testIdAttribute: 'data-test'`:**
   * *Issue:* Standard AI-generated CI configs overwrite the `use` block with default settings, breaking all `getByTestId()` locators written for the Toolshop app.
   * *Fix:* Explicitly kept `testIdAttribute: 'data-test'` inside the `use` configuration block.

3. **Artifact Upload Condition (`if: ${{ !cancelled() }}`):**
   * *Justification:* Ensured all artifact upload steps and the `merge-reports` job use `if: ${{ !cancelled() }}` instead of default `success()`, guaranteeing that HTML reports and failure traces are still published when a test fails.

## 4. Additional AI-assisted debugging (ChatGPT, GPT-6, 2026-11-22)

After the initial workflow was generated, the author shared GitHub Actions screenshots and failing logs with OpenAI ChatGPT (GPT-6) and asked for help fixing the failures. Main changes made and reviewed:

1. A fresh, independently registered user is used by UI login, checkout and positive reset-password tests rather than modifying shared seeded accounts.
2. A brittle registration assertion against login-form elements was replaced with proof of HTTP **201** from `POST /users/register` plus a redirect to `/auth/login`.
3. The workflow matrix was corrected from one shard to four shards, with a separate merged HTML + JUnit report job.
4. Assertion failures and network issues were investigated using GitHub Actions logs and Playwright reports instead of only increasing timeouts.

**Observed evidence:** GitHub Actions push run #5 (2026-11-22, `ci-setup`, commit `50382e4`) was green, and the merged JUnit report contained six tests with zero failures. The author's screenshots show the HTML report at 6 passed and the full workflow time at 49 seconds. A PR-triggered success and a one-shard success/timing comparison are separate tasks to verify before final submission.

**Model disclosure check:** The earlier Gemini model label is reproduced from the author's original appendix. Confirm its exact model name and the recorded prompt wording against the original Gemini chat before submission.
