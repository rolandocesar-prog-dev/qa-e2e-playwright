import { type Buyer, buyer } from '../data/buyers.js';
import { products } from '../data/products.js';
import { expect, test } from '../fixtures/index.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutCompletePage } from '../pages/checkout-complete.page.js';
import { CheckoutInformationPage } from '../pages/checkout-information.page.js';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page.js';
import { type InventoryPage } from '../pages/inventory.page.js';
import { sum, taxOn, toCents } from '../support/money.js';

/** Agrega los productos y llega al paso 1 del checkout. */
async function startCheckout(
  inventory: InventoryPage,
  ...names: string[]
): Promise<CheckoutInformationPage> {
  await inventory.addToCart(...names);
  await inventory.header.openCart();
  const cart = new CartPage(inventory.page);
  await expect(cart.itemNames).toHaveText(names);
  await cart.checkout();
  const information = new CheckoutInformationPage(inventory.page);
  await expect(information.title).toHaveText('Checkout: Your Information');
  return information;
}

/**
 * Completa los datos y continúa. El formulario se vuelve a dibujar justo después de aparecer y
 * puede borrar lo escrito en ese instante (pasa bajo carga, sobre todo en WebKit): se reintenta
 * el llenado hasta que los valores quedan puestos, sin esperas fijas (design.md).
 */
async function submitBuyer(
  information: CheckoutInformationPage,
  data: Partial<Buyer>,
): Promise<void> {
  await expect(async () => {
    await information.fill(data);
    await expect(information.firstName).toHaveValue(data.firstName ?? '', { timeout: 500 });
    await expect(information.lastName).toHaveValue(data.lastName ?? '', { timeout: 500 });
    await expect(information.postalCode).toHaveValue(data.postalCode ?? '', { timeout: 500 });
  }).toPass();
  await information.continueButton.click();
}

test.describe('Compra', () => {
  test('CHK-01 · compra completa de punta a punta', async ({ loggedInPage: inventory }) => {
    const chosen = [products.backpack, products.bikeLight];
    const information = await startCheckout(inventory, ...chosen);

    await submitBuyer(information, buyer);

    const overview = new CheckoutOverviewPage(inventory.page);
    await expect(overview.title).toHaveText('Checkout: Overview');
    await expect(overview.itemNames).toHaveText(chosen);

    await overview.finish();

    const complete = new CheckoutCompletePage(inventory.page);
    await expect(complete.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(complete.confirmation).toHaveText('Thank you for your order!');
    await expect(complete.header.cartBadge).toBeHidden();
  });

  const missingFields: { field: keyof Buyer; message: string }[] = [
    { field: 'firstName', message: 'Error: First Name is required' },
    { field: 'lastName', message: 'Error: Last Name is required' },
    { field: 'postalCode', message: 'Error: Postal Code is required' },
  ];

  for (const { field, message } of missingFields) {
    test(`CHK-02 · sin ${field} no se puede continuar`, async ({ loggedInPage: inventory }) => {
      const information = await startCheckout(inventory, products.onesie);

      await submitBuyer(information, { ...buyer, [field]: '' });

      await expect(information.error).toHaveText(message);
      await expect(information.page).toHaveURL(/\/checkout-step-one\.html$/);
    });
  }

  test('CHK-03 · subtotal, impuesto y total calculados correctamente', async ({
    loggedInPage: inventory,
  }) => {
    const chosen = [products.backpack, products.boltTShirt, products.fleeceJacket];
    const catalogPrices: number[] = [];
    for (const name of chosen) {
      catalogPrices.push(toCents(await inventory.priceOf(name)));
    }
    const information = await startCheckout(inventory, ...chosen);
    await submitBuyer(information, buyer);

    const overview = new CheckoutOverviewPage(inventory.page);
    // Esperar a que el resumen esté dibujado antes de leer los montos (el sitio es una SPA).
    await expect(overview.itemNames).toHaveText(chosen);
    const { prices, subtotal, tax, total } = await overview.amounts();

    expect(prices).toEqual(catalogPrices);
    expect(subtotal).toBe(sum(prices));
    expect(tax).toBe(taxOn(subtotal));
    expect(total).toBe(subtotal + tax);
  });

  test('CHK-04 · cancelar la compra conserva los productos', async ({
    loggedInPage: inventory,
  }) => {
    const chosen = [products.backpack, products.bikeLight];
    const information = await startCheckout(inventory, ...chosen);
    const cart = new CartPage(inventory.page);

    await test.step('en el paso 1 vuelve al carrito', async () => {
      await information.cancelButton.click();

      await expect(cart.title).toHaveText('Your Cart');
      await expect(cart.itemNames).toHaveText(chosen);
    });

    await test.step('en el paso 2 vuelve al catálogo', async () => {
      await cart.checkout();
      await submitBuyer(information, buyer);
      const overview = new CheckoutOverviewPage(inventory.page);
      await expect(overview.itemNames).toHaveText(chosen);

      await overview.cancelButton.click();

      await expect(inventory.title).toHaveText('Products');
      await expect(inventory.header.cartBadge).toHaveText(String(chosen.length));
      await expect(inventory.removeButton(products.backpack)).toBeVisible();
    });
  });
});
