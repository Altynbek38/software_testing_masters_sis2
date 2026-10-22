import { randomUUID } from 'node:crypto';
import type { RegistrationUser } from '../pages/register.page';

export function generateUser(): RegistrationUser {
    const uniqueId = randomUUID().replace(/-/g, '');

    return {
        firstName: 'Test',
        lastName: 'User',
        dob: '1990-01-01',
        country: 'US',
        postal_code: '12345',
        house_number: '42',
        street: 'QA Test Street',
        city: 'New York',
        state: 'NY',
        phone: '2025550123',
        email: `tester_${uniqueId}@example.com`,
        password: `Qa!${uniqueId}Z9x`
    };
}
