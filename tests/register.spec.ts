import { test, expect } from '../fixtures/pages.fixture';
import { generateUser } from '../data/user.factory';

test('Register a unique new customer and reach the login page', async ({ registerPage, loginPage }) => {
    const newUser = generateUser();
    await registerPage.open();
    await registerPage.fillRegistrationForm(newUser);
    await registerPage.submit();

    // The site exposes email/password fields, NOT data-test="login-form".
    await loginPage.waitForLoginPage();
    expect(loginPage.currentUrl()).toMatch(/\/auth\/login(?:$|[?#])/);
});
