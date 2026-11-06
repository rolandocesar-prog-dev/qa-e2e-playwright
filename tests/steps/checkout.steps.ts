import { expect } from '@playwright/test';
import { type Buyer } from '../data/buyers.js';
import { type CheckoutInformationPage } from '../pages/checkout-information.page.js';

/**
 * Completa los datos del comprador y confirma que quedaron puestos. El formulario se vuelve a
 * dibujar justo después de aparecer y puede borrar lo escrito en ese instante (pasa bajo carga,
 * sobre todo en WebKit): se reintenta el llenado hasta que los tres campos tienen el valor
 * pedido, sin esperas fijas (design.md). Los campos que faltan en `data` quedan vacíos.
 */
export async function fillBuyer(
  information: CheckoutInformationPage,
  data: Partial<Buyer>,
): Promise<void> {
  await expect(async () => {
    await information.fill(data);
    await expect(information.firstName).toHaveValue(data.firstName ?? '', { timeout: 500 });
    await expect(information.lastName).toHaveValue(data.lastName ?? '', { timeout: 500 });
    await expect(information.postalCode).toHaveValue(data.postalCode ?? '', { timeout: 500 });
  }).toPass();
}

/** `fillBuyer` y continuar al paso 2. */
export async function submitBuyer(
  information: CheckoutInformationPage,
  data: Partial<Buyer>,
): Promise<void> {
  await fillBuyer(information, data);
  await information.continueButton.click();
}
