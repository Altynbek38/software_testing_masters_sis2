export const VALID_CUSTOMER = {
    email: 'customer3@practicesoftwaretesting.com',
    password: 'pass123'
} as const;

export const INVALID_CUSTOMER = {
    email: 'wrong@email.com',
    password: 'badpassword'
} as const;

export const PASSWORD_RESET_CUSTOMER = {
    email: 'customer@practicesoftwaretesting.com'
} as const;
