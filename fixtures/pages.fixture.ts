import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { generateUser } from '../data/user.factory';

type Credentials = { email: string; password: string };

type PageFixtures = {
    registerPage: RegisterPage;
    loginPage: LoginPage;
    productPage: ProductPage;
    checkoutPage: CheckoutPage;
    forgotPasswordPage: ForgotPasswordPage;
    registeredCustomer: Credentials;
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
    },
    registeredCustomer: async ({ request }, use) => {
        // A unique API-created user for each test; no shared, resettable demo account.
        const user = generateUser();
        const response = await request.post(
            `${process.env.API_URL || 'https://api.practicesoftwaretesting.com'}/users/register`,
            {
                data: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    dob: user.dob,
                    email: user.email,
                    password: user.password,
                    phone: user.phone,
                    address: {
                        street: user.street,
                        house_number: user.house_number,
                        city: user.city,
                        state: user.state,
                        country: user.country,
                        postal_code: user.postal_code
                    }
                }
            }
        );
        if (response.status() !== 201) {
            const detail = (await response.text()).slice(0, 1200);
            throw new Error(`Could not register independent test user: HTTP ${response.status()} — ${detail}`);
        }
        await use({ email: user.email, password: user.password });
    }
});

export { expect } from '@playwright/test';
