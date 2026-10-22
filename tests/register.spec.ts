import { test, expect } from '../fixtures/pages.fixture';
import { generateUser } from '../data/user.factory';

test('Register a unique new customer and reach the login page', async ({
    registerPage,
    loginPage
}) => {
    const newUser = generateUser();

    await registerPage.open();
    await registerPage.fillRegistrationForm(newUser);
    await registerPage.submit();

    await expect(loginPage.loginForm).toBeVisible();
    expect(loginPage.currentUrl()).toMatch(/\/auth\/login(?:$|[?#])/);
});
