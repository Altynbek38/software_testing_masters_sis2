import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';

type PageFixtures = {
    registerPage: RegisterPage;
    loginPage: LoginPage;
    productPage: ProductPage;
    checkoutPage: CheckoutPage;
    forgotPasswordPage: ForgotPasswordPage;
};

export const test = base.extend<PageFixtures>({
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    forgotPasswordPage: async ({ page }, use) => {
        await use(new ForgotPasswordPage(page));
    }
});

export { expect } from '@playwright/test';
