import { test, expect } from '../fixtures/pages.fixture';
import { INVALID_CUSTOMER } from '../data/test-users';

test.describe('Login scenarios', () => {
    test('Valid credentials reach the account page', async ({ loginPage, registeredCustomer }) => {
        await loginPage.open();
        await loginPage.login(registeredCustomer.email, registeredCustomer.password);
        await loginPage.waitForAccountPage();
        expect(loginPage.currentUrl()).toMatch(/\/account(?:$|[?#])/);
    });

    test('Invalid credentials show an error and do not log the user in', async ({ loginPage }) => {
        await loginPage.open();
        await loginPage.login(INVALID_CUSTOMER.email, INVALID_CUSTOMER.password);
        const errorMessage = await loginPage.getLoginErrorText();
        expect(errorMessage.length).toBeGreaterThan(0);
        expect(loginPage.currentUrl()).toMatch(/\/auth\/login(?:$|[?#])/);
    });
});
