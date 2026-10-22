import { test, expect } from '../fixtures/pages.fixture';

test('Compare two products by name and price', async ({ productPage }) => {
    const firstProduct = await productPage.getProductDetailsByIndex(0);
    const secondProduct = await productPage.getProductDetailsByIndex(1);

    expect(firstProduct.name).not.toBe(secondProduct.name);
    expect(firstProduct.price).toBeGreaterThan(0);
    expect(secondProduct.price).toBeGreaterThan(0);
    expect(firstProduct.price).not.toBe(secondProduct.price);
});
