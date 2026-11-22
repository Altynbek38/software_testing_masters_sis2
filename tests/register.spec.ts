import { test, expect } from '../fixtures/pages.fixture';
import { generateUser } from '../data/user.factory';

test('Register a unique new customer and reach the login page', async ({ registerPage }) => {
    const newUser = generateUser();
    await registerPage.open();
    await registerPage.fillRegistrationForm(newUser);

    const result = await registerPage.submit();

    // An HTTP 201 proves a new account was created; the URL proves the final state.
    expect(result.status).toBe(201);
    expect(result.finalUrl).toMatch(/\/auth\/login(?:$|[?#])/);
});
