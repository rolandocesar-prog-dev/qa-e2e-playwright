import { type Locator, type Page } from '@playwright/test';
import { type Buyer } from '../data/buyers.js';

/** Paso 1 del checkout: datos del comprador. */
export class CheckoutInformationPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.error = page.getByTestId('error');
  }

  /** Completa los campos indicados; los que faltan quedan vacíos. */
  async fill(data: Partial<Buyer>): Promise<void> {
    await this.firstName.fill(data.firstName ?? '');
    await this.lastName.fill(data.lastName ?? '');
    await this.postalCode.fill(data.postalCode ?? '');
  }
}
