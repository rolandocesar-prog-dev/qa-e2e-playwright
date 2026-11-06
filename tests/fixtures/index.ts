import { test as base } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page.js';

/** Estado del navegador con `standard_user` ya autenticado; lo genera `tests/setup/auth.setup.ts`. */
export const STANDARD_USER_STATE = 'playwright/.auth/standard-user.json';

type Fixtures = {
  /** Catálogo abierto con la sesión de `standard_user`, sin repetir el login en cada prueba. */
  loggedInPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  storageState: STANDARD_USER_STATE,

  loggedInPage: async ({ page }, use) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();
    await use(inventory);
  },
});

export { expect } from '@playwright/test';
