import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export type ProductDetails = {
    name: string;
    price: number;
};

export class ProductPage extends BasePage {
    async openHome(): Promise<void> {
        await this.page.goto('/');
        await expect(this.page.getByTestId('product-name').first()).toBeVisible();
    }

    async openAvailableProduct(): Promise<ProductDetails> {
        await this.openHome();

        const initialCount = await this.page.getByTestId('product-name').count();

        for (let index = 0; index < initialCount; index++) {
            if (index > 0) {
                await this.openHome();
            }

            const products = this.page.getByTestId('product-name');
            const currentCount = await products.count();

            if (index >= currentCount) {
                break;
            }

            await products.nth(index).click();

            const addToCart = this.page.getByTestId('add-to-cart');
            await expect(addToCart).toBeVisible();

            if (await addToCart.isEnabled()) {
                return this.readCurrentProduct();
            }
        }

        throw new Error('No in-stock product was found in the current catalogue.');
    }

    async getProductDetailsByIndex(index: number): Promise<ProductDetails> {
        await this.openHome();

        const products = this.page.getByTestId('product-name');
        const count = await products.count();

        if (index < 0 || index >= count) {
            throw new Error(`Product index ${index} is outside the catalogue range.`);
        }

        await products.nth(index).click();
        return this.readCurrentProduct();
    }

    async addToCart(): Promise<void> {
        const addToCart = this.page.getByTestId('add-to-cart');
        await expect(addToCart).toBeEnabled();
        await addToCart.click();
    }

    private async readCurrentProduct(): Promise<ProductDetails> {
        await expect(this.detailsName).toBeVisible();
        await expect(this.detailsPrice).toBeVisible();

        const name = (await this.detailsName.innerText()).trim();
        const priceText = (await this.detailsPrice.innerText()).trim();
        const price = Number(priceText.replace(/[^0-9.]/g, ''));

        if (!name) {
            throw new Error('The opened product has no name.');
        }

        if (!Number.isFinite(price) || price <= 0) {
            throw new Error(`The opened product has an invalid price: ${priceText}`);
        }

        return { name, price };
    }

    get detailsName() {
        return this.page.getByTestId('product-name');
    }

    get detailsPrice() {
        return this.page.getByTestId('unit-price');
    }
}
