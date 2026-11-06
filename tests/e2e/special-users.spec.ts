import { expect, test } from '@playwright/test';
import { buyer } from '../data/buyers.js';
import { CATALOG_SIZE, products } from '../data/products.js';
import { PASSWORD, users } from '../data/users.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutCompletePage } from '../pages/checkout-complete.page.js';
import { CheckoutInformationPage } from '../pages/checkout-information.page.js';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { LoginPage } from '../pages/login.page.js';
import { ProductDetailPage } from '../pages/product-detail.page.js';
import { fillBuyer } from '../steps/checkout.steps.js';

/**
 * Usuarios especiales de Sauce Demo (SPEC-01 y SPEC-02). Cada prueba verifica el comportamiento
 * correcto de una función; los defectos conocidos se marcan con `knownDefect` **justo antes** de
 * la aserción que falla, así un fallo en los pasos previos sigue siendo un fallo real.
 * Reportes: docs/defectos/.
 */
function knownDefect(id: string): void {
  test.fail(true, `${id} · docs/defectos/${id}.md`);
}

// El defecto se nota enseguida: no hace falta esperar los 5 s por defecto.
const expectSoon = expect.configure({ timeout: 2_000 });

// Evidencia de cada defecto: una falla esperada cuenta como «pasó», así que la configuración
// general («solo si falla») no guardaría nada.
test.use({ screenshot: 'on', trace: 'on' });

const alphabetical = Object.values(products).toSorted((a, b) => a.localeCompare(b, 'en'));

async function loginAs(page: InventoryPage['page'], user: string): Promise<InventoryPage> {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user, PASSWORD);
  const inventory = new InventoryPage(page);
  await expect(inventory.items).toHaveCount(CATALOG_SIZE);
  return inventory;
}

async function reachCheckout(inventory: InventoryPage): Promise<CheckoutInformationPage> {
  await inventory.addToCart(products.backpack);
  await expect(inventory.header.cartBadge).toHaveText('1');
  await inventory.header.openCart();
  await new CartPage(inventory.page).checkout();
  const information = new CheckoutInformationPage(inventory.page);
  await expect(information.title).toHaveText('Checkout: Your Information');
  return information;
}

test.describe('SPEC-01 · problem_user', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventory = await loginAs(page, users.problem);
  });

  test('DEF-001 · cada producto muestra su propia imagen', async () => {
    const sources = await inventory.items
      .getByRole('img')
      .evaluateAll((images) => images.map((image) => image.getAttribute('src')));

    knownDefect('DEF-001');
    expect(new Set(sources).size).toBe(CATALOG_SIZE);
  });

  test('DEF-002 · ordenar el catálogo cambia el orden', async () => {
    await inventory.sortBy('za');

    knownDefect('DEF-002');
    await expectSoon(inventory.itemNames).toHaveText([...alphabetical].reverse());
  });

  test('DEF-003 · se puede agregar cualquier producto al carrito', async () => {
    await inventory.addToCart(products.boltTShirt);

    knownDefect('DEF-003');
    await expectSoon(inventory.header.cartBadge).toHaveText('1');
  });

  test('DEF-004 · quitar un producto desde el catálogo', async () => {
    await inventory.addToCart(products.backpack);
    await expect(inventory.header.cartBadge).toHaveText('1');

    await inventory.removeButton(products.backpack).click();

    knownDefect('DEF-004');
    await expectSoon(inventory.header.cartBadge).toBeHidden();
  });

  test('DEF-005 · el detalle muestra el producto elegido', async () => {
    await inventory.openDetail(products.backpack);
    const detail = new ProductDetailPage(inventory.page);
    await expect(detail.backButton).toBeVisible();

    knownDefect('DEF-005');
    await expectSoon(detail.name).toHaveText(products.backpack);
  });

  test('DEF-006 · el apellido del comprador se puede escribir', async () => {
    const information = await reachCheckout(inventory);

    await information.lastName.pressSequentially(buyer.lastName);

    knownDefect('DEF-006');
    await expectSoon(information.lastName).toHaveValue(buyer.lastName);
  });
});

test.describe('SPEC-02 · error_user', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventory = await loginAs(page, users.error);
  });

  test('DEF-007 · ordenar el catálogo cambia el orden', async () => {
    await inventory.sortBy('za');

    knownDefect('DEF-007');
    await expectSoon(inventory.itemNames).toHaveText([...alphabetical].reverse());
  });

  test('DEF-008 · se puede agregar cualquier producto al carrito', async () => {
    await inventory.addToCart(products.boltTShirt);

    knownDefect('DEF-008');
    await expectSoon(inventory.header.cartBadge).toHaveText('1');
  });

  test('DEF-009 · quitar un producto desde el catálogo', async () => {
    await inventory.addToCart(products.backpack);
    await expect(inventory.header.cartBadge).toHaveText('1');

    await inventory.removeButton(products.backpack).click();

    knownDefect('DEF-009');
    await expectSoon(inventory.header.cartBadge).toBeHidden();
  });

  test('DEF-010 · el detalle muestra la descripción del producto', async () => {
    const description = await inventory
      .item(products.backpack)
      .getByTestId('inventory-item-desc')
      .innerText();
    await inventory.openDetail(products.backpack);
    const detail = new ProductDetailPage(inventory.page);
    await expect(detail.backButton).toBeVisible();
    await expect(detail.name).toHaveText(products.backpack);

    knownDefect('DEF-010');
    await expectSoon(detail.description).toHaveText(description);
  });

  test('DEF-011 · el apellido del comprador se puede escribir', async () => {
    const information = await reachCheckout(inventory);

    await information.lastName.pressSequentially(buyer.lastName);

    knownDefect('DEF-011');
    await expectSoon(information.lastName).toHaveValue(buyer.lastName);
  });

  test('DEF-012 · sin apellido no se puede continuar', async () => {
    const information = await reachCheckout(inventory);
    // Nombre y código confirmados: si faltara otro dato, el error sería otro y el defecto no se
    // mediría.
    await fillBuyer(information, { ...buyer, lastName: '' });

    await information.continueButton.click();

    knownDefect('DEF-012');
    await expectSoon(information.error).toHaveText('Error: Last Name is required');
  });

  test('DEF-013 · «Finish» completa la compra', async () => {
    const information = await reachCheckout(inventory);
    // Con error_user el apellido no se puede escribir (DEF-011) y aun así deja continuar
    // (DEF-012): es la única forma de llegar al resumen.
    await fillBuyer(information, { ...buyer, lastName: '' });
    await information.continueButton.click();
    const overview = new CheckoutOverviewPage(inventory.page);
    await expect(overview.itemNames).toHaveText([products.backpack]);

    await overview.finish();

    knownDefect('DEF-013');
    await expectSoon(new CheckoutCompletePage(inventory.page).confirmation).toHaveText(
      'Thank you for your order!',
    );
  });
});
