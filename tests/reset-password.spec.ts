import { randomUUID } from 'node:crypto';
import { test, expect } from '../fixtures/pages.fixture';
import { PASSWORD_RESET_CUSTOMER } from '../data/test-users';

test('Reset password shows confirmation for known email and error for unknown email', async ({
    loginPage,
    forgotPasswordPage
}) => {
    await loginPage.open();
    await loginPage.goToForgotPassword();

    const confirmationMessage = await forgotPasswordPage.requestReset(
        PASSWORD_RESET_CUSTOMER.email
    );

    expect(confirmationMessage).toMatch(/forgot-password\.confirm|password|reset|email|sent/i);

    await loginPage.open();
    await loginPage.goToForgotPassword();

    const unknownEmail = `missing_${randomUUID().replace(/-/g, '')}@example.com`;
    const errorMessage = await forgotPasswordPage.requestReset(unknownEmail);

    expect(errorMessage.length).toBeGreaterThan(0);
    expect(errorMessage).toMatch(/invalid|not found|error|email|exist|registered|user/i);
    expect(errorMessage).not.toBe(confirmationMessage);
});
