import { test, expect } from '../fixtures/pages.fixture';
import { INVALID_CUSTOMER, VALID_CUSTOMER } from '../data/test-users';

test.describe('Login scenarios', () => {
    test('Valid credentials reach the account page', async ({ loginPage }) => {
        await loginPage.open();
        await loginPage.login(VALID_CUSTOMER.email, VALID_CUSTOMER.password);

        await expect(loginPage.accountMenu).toBeVisible();
        expect(loginPage.currentUrl()).toMatch(/\/account(?:$|[?#])/);
    });

    test('Invalid credentials show an error and do not log the user in', async ({
        loginPage
    }) => {
        await loginPage.open();
        await loginPage.login(INVALID_CUSTOMER.email, INVALID_CUSTOMER.password);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.accountMenu).toBeHidden();
        expect(loginPage.currentUrl()).toMatch(/\/auth\/login(?:$|[?#])/);
    });
});
