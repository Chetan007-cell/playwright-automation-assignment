import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Shopping Cart Flows', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    page.on('dialog', async dialog => {
      const msg = dialog.message();
      await dialog.dismiss();
      throw new Error(`Unexpected browser alert/error dialog detected: "${msg}"`);
    });

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.title).toBeVisible();
  });

  test('Logged-in standard user adds two products and verifies cart badge is 2', async () => {
    await productsPage.addFirstNProductsToCart(2);

    await expect(productsPage.cartBadge).toBeVisible();
    await expect(productsPage.cartBadge).toHaveText('2');

    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);
  });
});
