import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Authentication Flows', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    page.on('dialog', async dialog => {
      const msg = dialog.message();
      await dialog.dismiss();
      throw new Error(`Unexpected browser alert/error dialog detected: "${msg}"`);
    });

    await loginPage.goto();
  });

  test('Standard user logs in successfully and lands on products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('Locked-out user sees error message and remains on login page', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(page).toHaveURL(/\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
