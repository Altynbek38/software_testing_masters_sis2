import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    async open(): Promise<void> {
        await this.page.goto('/');
        await this.page.getByTestId('nav-sign-in').click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.page.getByTestId('email').fill(email);
        await this.page.getByTestId('password').fill(password);
        await this.page.getByTestId('login-submit').click();
    }

    get loginForm() {
        return this.page.getByTestId('login-form');
    }

    get accountMenu() {
        return this.page.getByTestId('nav-menu');
    }

    get errorMessage() {
        return this.page.getByTestId('login-error');
    }

    async goToForgotPassword(): Promise<void> {
        await this.page.getByTestId('forgot-password-link').click();
    }
}
