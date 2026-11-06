import { CATALOG_SIZE } from '../data/products.js';
import { expect, test } from '../fixtures/index.js';

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
});
