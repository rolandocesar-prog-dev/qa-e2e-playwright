import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from './header.component.js';

/** Valores del selector de orden del catálogo. */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly activeSort: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.activeSort = page.getByTestId('active-option');
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  /** Abre el detalle de un producto haciendo clic en su nombre. */
  async openDetail(name: string): Promise<void> {
    await this.item(name).getByTestId('inventory-item-name').click();
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /** La tarjeta de un producto, por su nombre exacto. */
  item(name: string): Locator {
    return this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
  }

  addButton(name: string): Locator {
    return this.item(name).getByRole('button', { name: 'Add to cart' });
  }

  removeButton(name: string): Locator {
    return this.item(name).getByRole('button', { name: 'Remove' });
  }

  async addToCart(...names: string[]): Promise<void> {
    for (const name of names) {
      await this.addButton(name).click();
    }
  }

  async priceOf(name: string): Promise<string> {
    return this.item(name).getByTestId('inventory-item-price').innerText();
  }
}
