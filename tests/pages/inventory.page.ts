import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
  }
}
