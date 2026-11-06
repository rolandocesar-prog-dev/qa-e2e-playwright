import { CATALOG_SIZE, products } from '../data/products.js';
import { expect, test } from '../fixtures/index.js';
import { ProductDetailPage } from '../pages/product-detail.page.js';
import { toCents } from '../support/money.js';

test.describe('Catálogo', () => {
  test('INV-01 · se muestran 6 productos con nombre, precio e imagen', async ({
    loggedInPage: inventory,
  }) => {
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.items).toHaveCount(CATALOG_SIZE);

    for (const item of await inventory.items.all()) {
      await expect(item.getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(item.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
      const image = item.getByRole('img');
      await expect(image).toBeVisible();
      // naturalWidth > 0: la imagen cargó de verdad (un enlace roto también es «visible»).
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test('INV-02 · ordenar por precio ascendente y descendente', async ({
    loggedInPage: inventory,
  }) => {
    await expect(inventory.items).toHaveCount(CATALOG_SIZE);
    const prices = await inventory.itemPrices.allInnerTexts();
    const ascending = [...prices].sort((a, b) => toCents(a) - toCents(b));

    await inventory.sortBy('lohi');
    await expect(inventory.activeSort).toHaveText('Price (low to high)');
    await expect(inventory.itemPrices).toHaveText(ascending);

    await inventory.sortBy('hilo');
    await expect(inventory.activeSort).toHaveText('Price (high to low)');
    await expect(inventory.itemPrices).toHaveText([...ascending].reverse());
  });

  test('INV-03 · ordenar por nombre A-Z y Z-A', async ({ loggedInPage: inventory }) => {
    await expect(inventory.items).toHaveCount(CATALOG_SIZE);
    const alphabetical = Object.values(products).toSorted((a, b) => a.localeCompare(b, 'en'));

    // A-Z es el orden inicial del catálogo.
    await expect(inventory.activeSort).toHaveText('Name (A to Z)');
    await expect(inventory.itemNames).toHaveText(alphabetical);

    await inventory.sortBy('za');
    await expect(inventory.activeSort).toHaveText('Name (Z to A)');
    await expect(inventory.itemNames).toHaveText([...alphabetical].reverse());

    await inventory.sortBy('az');
    await expect(inventory.itemNames).toHaveText(alphabetical);
  });

  test('INV-04 · el detalle de cada producto coincide con su tarjeta', async ({
    loggedInPage: inventory,
  }) => {
    const detail = new ProductDetailPage(inventory.page);

    for (const name of Object.values(products)) {
      await test.step(name, async () => {
        const card = inventory.item(name);
        const description = await card.getByTestId('inventory-item-desc').innerText();
        const price = await card.getByTestId('inventory-item-price').innerText();

        await inventory.openDetail(name);

        await expect(detail.page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
        // La URL cambia antes que el contenido (SPA): esperar algo que solo tiene el detalle.
        await expect(detail.backButton).toBeVisible();
        await expect(detail.name).toHaveText(name);
        await expect(detail.description).toHaveText(description);
        await expect(detail.price).toHaveText(price);
        await expect(detail.image).toBeVisible();

        await detail.back();
        await expect(inventory.items).toHaveCount(CATALOG_SIZE);
      });
    }
  });
});
