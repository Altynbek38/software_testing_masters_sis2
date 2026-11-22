import { randomUUID } from 'node:crypto';
import { test, expect } from '../fixtures/pages.fixture';

test('Reset password shows confirmation for known email and error for unknown email', async ({
    loginPage, forgotPasswordPage, registeredCustomer
}) => {
    await loginPage.open();
    await loginPage.goToForgotPassword();

    // The API changes the password on reset, so NEVER reset a shared seeded account.
    const confirmationMessage = await forgotPasswordPage.requestReset(registeredCustomer.email);
    expect(confirmationMessage).toMatch(/forgot-password\.confirm|password|reset|email|sent/i);

    await loginPage.open();
    await loginPage.goToForgotPassword();
    const unknownEmail = `missing_${randomUUID().replace(/-/g, '')}@example.com`;
    const errorMessage = await forgotPasswordPage.requestReset(unknownEmail);
    expect(errorMessage.length).toBeGreaterThan(0);
    expect(errorMessage).toMatch(/invalid|not found|error|email|exist|registered|user/i);
    expect(errorMessage).not.toBe(confirmationMessage);
});
