import { expect, test as setup } from '@playwright/test';
import { PASSWORD, users } from '../data/users.js';
import { STANDARD_USER_STATE } from '../fixtures/index.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { LoginPage } from '../pages/login.page.js';

setup('iniciar sesión con standard_user y guardar el estado', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard, PASSWORD);

  // Guardar solo después de confirmar que la sesión es válida.
  await expect(new InventoryPage(page).title).toHaveText('Products');
  await page.context().storageState({ path: STANDARD_USER_STATE });
});
