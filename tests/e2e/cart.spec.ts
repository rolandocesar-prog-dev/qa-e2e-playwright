import { products } from '../data/products.js';
import { expect, test } from '../fixtures/index.js';
import { CartPage } from '../pages/cart.page.js';
import { ProductDetailPage } from '../pages/product-detail.page.js';

test.describe('Carrito', () => {
  test('CART-01 · agregar productos actualiza el contador del carrito', async ({
    loggedInPage: inventory,
  }) => {
    await expect(inventory.header.cartBadge).toBeHidden();

    await inventory.addToCart(products.backpack);
    await expect(inventory.header.cartBadge).toHaveText('1');
    await expect(inventory.removeButton(products.backpack)).toBeVisible();

    await inventory.addToCart(products.bikeLight);
    await expect(inventory.header.cartBadge).toHaveText('2');
  });

  test('CART-02 · quitar productos desde el catálogo y desde el carrito', async ({
    loggedInPage: inventory,
  }) => {
    await inventory.addToCart(products.backpack, products.bikeLight);
    await expect(inventory.header.cartBadge).toHaveText('2');

    await test.step('desde el catálogo', async () => {
      await inventory.removeButton(products.backpack).click();

      await expect(inventory.header.cartBadge).toHaveText('1');
      await expect(inventory.addButton(products.backpack)).toBeVisible();
    });

    await test.step('desde el carrito', async () => {
      await inventory.header.openCart();
      const cart = new CartPage(inventory.page);
      await expect(cart.itemNames).toHaveText([products.bikeLight]);

      await cart.remove(products.bikeLight);

      await expect(cart.items).toHaveCount(0);
      await expect(cart.header.cartBadge).toBeHidden();
    });
  });

  test('CART-03 · el carrito se conserva al navegar entre páginas', async ({
    loggedInPage: inventory,
  }) => {
    const chosen = [products.backpack, products.onesie];
    await inventory.addToCart(...chosen);
    await expect(inventory.header.cartBadge).toHaveText('2');

    await test.step('al ver el detalle de otro producto y volver', async () => {
      await inventory.openDetail(products.bikeLight);
      const detail = new ProductDetailPage(inventory.page);
      // La URL cambia antes que el contenido (SPA): esperar algo que solo tiene el detalle.
      await expect(detail.backButton).toBeVisible();
      await expect(detail.name).toHaveText(products.bikeLight);
      await expect(detail.header.cartBadge).toHaveText('2');
      await detail.back();
    });

    const cart = new CartPage(inventory.page);

    await test.step('al ir al carrito y seguir comprando', async () => {
      await inventory.header.openCart();
      await expect(cart.itemNames).toHaveText(chosen);
      await cart.continueShoppingButton.click();
      await expect(inventory.title).toHaveText('Products');
      await expect(inventory.header.cartBadge).toHaveText('2');
    });

    await test.step('al recargar la página', async () => {
      await inventory.page.reload();
      await expect(inventory.header.cartBadge).toHaveText('2');
      await inventory.header.openCart();
      await expect(cart.itemNames).toHaveText(chosen);
    });
  });
});
