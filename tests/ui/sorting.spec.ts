import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Product Sorting Flows', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    page.on('dialog', async dialog => {
      const msg = dialog.message();
      await dialog.dismiss();
      throw new Error(`UI Error Alert appeared: "${msg}"`);
    });

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.title).toBeVisible();
  });

  test('Logged-in standard user sorts by "Price (low to high)" and verifies lowest price first', async () => {
    // Sort by Price (low to high)
    await productsPage.sortBy('lohi');

    // Retrieve all numeric prices
    const prices = await productsPage.getAllItemPrices();
    expect(prices.length).toBeGreaterThan(0);

    // Verify the first displayed product has the lowest numeric price
    const firstPrice = await productsPage.getFirstItemPrice();
    const minPrice = Math.min(...prices);
    expect(firstPrice).toBe(minPrice);

    // Verify the full array of prices is in ascending order
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });
});

