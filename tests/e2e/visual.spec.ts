import { CATALOG_SIZE } from '../data/products.js';
import { expect, test } from '../fixtures/index.js';

/** Proyectos con referencia visual: un diseño de escritorio y uno móvil (design.md, VIS-01). */
const VISUAL_PROJECTS = ['chromium', 'mobile-chrome'];

test('VIS-01 · el catálogo se ve igual que la referencia', async ({
  loggedInPage: inventory,
}, testInfo) => {
  test.skip(
    !VISUAL_PROJECTS.includes(testInfo.project.name),
    'La referencia visual se guarda solo para escritorio (Chromium) y móvil.',
  );
  test.skip(
    process.platform !== 'linux',
    'Las referencias son del contenedor de Playwright (Linux): usa npm run test:docker.',
  );
  await expect(inventory.items).toHaveCount(CATALOG_SIZE);
  // Las imágenes deben estar cargadas para que la captura sea estable.
  await expect
    .poll(() =>
      inventory.items
        .getByRole('img')
        .evaluateAll((images: HTMLImageElement[]) => images.every((image) => image.complete)),
    )
    .toBe(true);

  await expect(inventory.page).toHaveScreenshot('catalogo.png', {
    fullPage: true,
    // El año del pie cambia cada enero; no es una regresión del catálogo.
    mask: [inventory.page.getByTestId('footer-copy')],
  });
});
