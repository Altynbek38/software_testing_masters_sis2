import { test, expect } from '../fixtures/pages.fixture';
import { VALID_CUSTOMER } from '../data/test-users';

test('Buy a product and complete checkout', async ({
    loginPage,
    productPage,
    checkoutPage
}) => {
    await loginPage.open();
    await loginPage.login(
        VALID_CUSTOMER.email,
        VALID_CUSTOMER.password
    );

    await expect(loginPage.accountMenu).toBeVisible();

    const selectedProduct =
        await productPage.openAvailableProduct();

    const productName = selectedProduct.name;

    await productPage.addToCart();
    await checkoutPage.openCart();

    const cartItemName =
        await checkoutPage.getCartItemName(productName);

    const quantity =
        await checkoutPage.getCartItemQuantity(productName);

    expect(cartItemName).toContain(productName);
    expect(quantity).toBe('1');

    await checkoutPage.proceedToCheckout();
    await checkoutPage.confirmOrder();

    await expect(checkoutPage.successMessage).toBeVisible();
});