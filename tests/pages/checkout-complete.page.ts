import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from './header.component.js';

/** Confirmación de la compra. */
export class CheckoutCompletePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly confirmation: Locator;
  readonly backHomeButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
    this.confirmation = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }
}
