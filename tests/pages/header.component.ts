import { type Locator, type Page } from '@playwright/test';

/** Encabezado común a las páginas con sesión: acceso al carrito y su contador. */
export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
