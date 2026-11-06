import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from './header.component.js';

/** Detalle de un producto (`/inventory-item.html?id=…`). */
export class ProductDetailPage {
  readonly header: HeaderComponent;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly backButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
    this.image = page.getByTestId('inventory-container').getByRole('img');
    this.backButton = page.getByTestId('back-to-products');
  }

  async back(): Promise<void> {
    await this.backButton.click();
  }
}
