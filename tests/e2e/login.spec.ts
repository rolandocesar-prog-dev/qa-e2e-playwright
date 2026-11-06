import { expect, test } from '@playwright/test';
import { PASSWORD, users } from '../data/users.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { LoginPage } from '../pages/login.page.js';

test.describe('Inicio de sesión', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('LOGIN-01 · un usuario válido entra al catálogo de productos', async ({ page }) => {
    await loginPage.login(users.standard, PASSWORD);

    const inventory = new InventoryPage(page);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.items).not.toHaveCount(0);
  });

  test('LOGIN-02 · un usuario bloqueado ve un mensaje de error', async ({ page }) => {
    await loginPage.login(users.lockedOut, PASSWORD);

    await expect(loginPage.error).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('LOGIN-03 · una contraseña incorrecta no permite el acceso', async () => {
    await loginPage.login(users.standard, 'contraseña-incorrecta');

    await expect(loginPage.error).toContainText('do not match');
  });

  test('LOGIN-04 · los campos vacíos muestran que el usuario es obligatorio', async () => {
    await loginPage.submit.click();

    await expect(loginPage.error).toContainText('Username is required');
  });

  test('LOGIN-05 · entrar al catálogo sin sesión redirige al inicio de sesión', async ({
    page,
  }) => {
    await new InventoryPage(page).goto();

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.error).toContainText(
      "You can only access '/inventory.html' when you are logged in",
    );
  });
});
