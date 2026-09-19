import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemPrices: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/inventory.html');
  }

  async addFirstNProductsToCart(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.nth(i).click();
    }
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = (await this.cartBadge.textContent()) || '0';
      return parseInt(text.trim(), 10);
    }
    return 0;
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(sortOption: 'lohi' | 'hilo' | 'az' | 'za'): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }

  async getAllItemPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map(price => parseFloat(price.replace('$', '').trim()));
  }

  async getFirstItemPrice(): Promise<number> {
    const firstPriceText = await this.itemPrices.first().textContent();
    return parseFloat((firstPriceText || '0').replace('$', '').trim());
  }
}
