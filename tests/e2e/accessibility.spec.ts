import { CATALOG_SIZE } from '../data/products.js';
import { expect, test } from '../fixtures/index.js';
import { LoginPage } from '../pages/login.page.js';
import { blockingA11yViolations } from '../steps/accessibility.steps.js';

test.describe('A11Y-01 · accesibilidad (WCAG 2.1 A/AA con axe)', () => {
  test.describe('sin sesión', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('A11Y-01 · el inicio de sesión no tiene violaciones críticas ni graves', async ({
      page,
    }, testInfo) => {
      const login = new LoginPage(page);
      await login.goto();
      await expect(login.submit).toBeVisible();

      expect(await blockingA11yViolations(page, testInfo, 'login')).toEqual([]);
    });
  });

  test('A11Y-01 · el catálogo no tiene violaciones críticas ni graves', async ({
    loggedInPage: inventory,
  }, testInfo) => {
    await expect(inventory.items).toHaveCount(CATALOG_SIZE);

    expect(await blockingA11yViolations(inventory.page, testInfo, 'catalogo')).toEqual([]);
  });
});
