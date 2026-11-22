import { test, expect } from '../fixtures/pages.fixture';

test('Buy a product and complete checkout', async ({
    loginPage, productPage, checkoutPage, registeredCustomer
}) => {
    await loginPage.open();
    await loginPage.login(registeredCustomer.email, registeredCustomer.password);
    await loginPage.waitForAccountPage();
    expect(loginPage.currentUrl()).toMatch(/\/account(?:$|[?#])/);

    const selectedProduct = await productPage.openAvailableProduct();
    await productPage.addToCart();
    await checkoutPage.openCart();

    const itemName = await checkoutPage.getCartItemName(selectedProduct.name);
    const quantity = await checkoutPage.getCartItemQuantity(selectedProduct.name);
    expect(itemName).toContain(selectedProduct.name);
    expect(quantity).toBe('1');

    await checkoutPage.proceedToCheckout();
    await checkoutPage.confirmOrder();
    const successMessage = await checkoutPage.getSuccessMessageText();
    expect(successMessage.length).toBeGreaterThan(0);
});
