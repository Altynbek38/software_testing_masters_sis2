# AI Usage Appendix (CI/CD Pipeline - SIS 3)

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