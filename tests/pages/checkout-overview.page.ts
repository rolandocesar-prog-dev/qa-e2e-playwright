import { type Locator, type Page } from '@playwright/test';
import { toCents } from '../support/money.js';

/** Paso 2 del checkout: resumen con productos y montos. */
export class CheckoutOverviewPage {
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  /** Montos del resumen en centavos. Llamar después de esperar a que la página esté dibujada. */
  async amounts(): Promise<{ prices: number[]; subtotal: number; tax: number; total: number }> {
    return {
      prices: (await this.itemPrices.allInnerTexts()).map(toCents),
      subtotal: toCents(await this.subtotal.innerText()),
      tax: toCents(await this.tax.innerText()),
      total: toCents(await this.total.innerText()),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
