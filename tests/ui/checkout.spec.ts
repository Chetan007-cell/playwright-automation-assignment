import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout Flows', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    checkoutPage = new CheckoutPage(page);

    page.on('dialog', async dialog => {
      const msg = dialog.message();
      await dialog.dismiss();
      throw new Error(`Unexpected browser alert/error dialog detected: "${msg}"`);
    });

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.title).toBeVisible();
  });

  test('Logged-in standard user completes checkout process successfully', async ({ page }) => {
    // Add two products
    await productsPage.addFirstNProductsToCart(2);
    await expect(productsPage.cartBadge).toHaveText('2');

    // Go to cart
    await productsPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(checkoutPage.cartItems).toHaveCount(2);

    // Proceed to checkout information
    await checkoutPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Fill customer info
    await checkoutPage.fillCustomerInformation('Jane', 'Doe', '90210');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    // Finish checkout
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);

    // Verify confirmation message
    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(checkoutPage.completeHeader).toContainText('Thank you for your order');
  });
});
