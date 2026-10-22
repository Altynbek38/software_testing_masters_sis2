import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
    async openCart(): Promise<void> {
        await this.page.getByTestId('nav-cart').click();
    }

    async getCartItemName(expectedName: string): Promise<string> {
        const row = this.page
            .getByRole('row')
            .filter({ hasText: expectedName });

        await expect(row).toBeVisible();

        return (await row.textContent()) ?? '';
    }

    async getCartItemQuantity(expectedName: string): Promise<string> {
        const row = this.page
            .getByRole('row')
            .filter({ hasText: expectedName });

        const quantity = row.getByTestId('product-quantity');

        await expect(quantity).toBeVisible();

        return await quantity.inputValue();
    }
    get cartProductQuantity() {
        return this.page.getByTestId('product-quantity');
    }

    async proceedToCheckout(): Promise<void> {
        await this.page.getByTestId('proceed-1').click();
        await this.page.getByTestId('proceed-2').click();

        await this.page.getByTestId('postal_code').fill('12345');
        await this.page.getByTestId('house_number').fill('10');
        await this.page.getByTestId('state').fill('Vienna');

        await this.page.getByTestId('proceed-3').click();

        await expect(
            this.page.getByRole('heading', { name: 'Payment' })
        ).toBeVisible();
    }

    async confirmOrder(): Promise<void> {
        const paymentMethod = this.page.getByTestId('payment-method');
        await expect(paymentMethod).toBeVisible();
        await paymentMethod.selectOption('cash-on-delivery');

        const checkPaymentButton = this.page.getByTestId('finish');
        await expect(checkPaymentButton).toBeEnabled();
        await checkPaymentButton.click();
    }

    get successMessage() {
        return this.page.getByTestId('payment-success-message');
    }
}
