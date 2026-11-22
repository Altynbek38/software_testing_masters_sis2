import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    async open(): Promise<void> {
        // Navigate within the Angular SPA rather than direct-loading /auth/login.
        await this.page.goto('/');
        await this.page.getByTestId('nav-sign-in').click();
        await this.waitForLoginPage();
    }

    async login(email: string, password: string): Promise<void> {
        await this.page.getByTestId('email').fill(email);
        await this.page.getByTestId('password').fill(password);
        await this.page.getByTestId('login-submit').click();
    }

    async waitForLoginPage(): Promise<void> {
        await expect(this.page).toHaveURL(/\/auth\/login(?:$|[?#])/, { timeout: 20000 });
        await expect(this.page.getByTestId('email')).toBeVisible();
        await expect(this.page.getByTestId('password')).toBeVisible();
    }

    async waitForAccountPage(): Promise<void> {
        try {
            await expect(this.page).toHaveURL(/\/account(?:$|[?#])/, { timeout: 20000 });
        } catch (originalError) {
            const errorText = await this.page.getByTestId('login-error')
                .textContent({ timeout: 1000 }).catch(() => null);
            throw new Error(
                `Sign-in did not reach /account. URL: ${this.page.url()}. ` +
                `Visible login error: ${errorText?.trim() || '(none)'}. ` +
                `Original error: ${String(originalError)}`
            );
        }
    }

    async getLoginErrorText(): Promise<string> {
        const error = this.page.getByTestId('login-error');
        await expect(error).toBeVisible();
        return (await error.innerText()).trim();
    }

    async goToForgotPassword(): Promise<void> {
        await this.page.getByTestId('forgot-password-link').click();
    }
}
