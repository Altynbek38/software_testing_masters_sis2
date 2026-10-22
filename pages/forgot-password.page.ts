import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ForgotPasswordPage extends BasePage {
    async requestReset(email: string): Promise<string> {
        await this.page.getByTestId('email').fill(email);
        await this.page.getByTestId('forgot-password-submit').click();

        await expect(this.alertMessage).toBeVisible();
        return (await this.alertMessage.innerText()).trim();
    }

    get alertMessage() {
        return this.page.getByRole('alert');
    }
}
