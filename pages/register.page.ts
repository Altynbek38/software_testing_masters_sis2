import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export type RegistrationUser = {
    firstName: string;
    lastName: string;
    dob: string;
    country: string;
    postal_code: string;
    house_number: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    password: string;
};

export class RegisterPage extends BasePage {
    async open(): Promise<void> {
        await this.page.goto('/auth/register');
        await expect(
            this.page.getByRole('heading', { name: /customer registration/i })
        ).toBeVisible();
    }

    async fillRegistrationForm(user: RegistrationUser): Promise<void> {
        await this.page.getByTestId('first-name').fill(user.firstName);
        await this.page.getByTestId('last-name').fill(user.lastName);
        await this.page.getByTestId('dob').fill(user.dob);
        await this.page.getByTestId('country').selectOption(user.country);
        await this.page.getByTestId('postal_code').fill(user.postal_code);
        await this.page.getByTestId('house_number').fill(user.house_number);
        await this.page.getByTestId('street').fill(user.street);
        await this.page.getByTestId('city').fill(user.city);
        await this.page.getByTestId('state').fill(user.state);
        await this.page.getByTestId('phone').fill(user.phone);
        await this.page.getByTestId('email').fill(user.email);
        await this.page.getByTestId('password').fill(user.password);
    }

    async submit(): Promise<void> {
        await this.page.getByTestId('register-submit').click();
    }
}
