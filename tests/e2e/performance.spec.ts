import { expect, test } from '@playwright/test';
import { CATALOG_SIZE } from '../data/products.js';
import { PASSWORD, users } from '../data/users.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { LoginPage } from '../pages/login.page.js';

/** Límite de PERF-01: el sitio demora a propósito ≈ 5 s a este usuario (design.md). */
const LOGIN_BUDGET_MS = 10_000;

test('PERF-01 · performance_glitch_user entra al catálogo en menos de 10 s', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.username.fill(users.performanceGlitch);
  await login.password.fill(PASSWORD);

  const start = performance.now();
  await login.submit.click();
  await expect(new InventoryPage(page).items).toHaveCount(CATALOG_SIZE, {
    timeout: LOGIN_BUDGET_MS,
  });
  const elapsed = Math.round(performance.now() - start);

  test.info().annotations.push({ type: 'duración del login', description: `${elapsed} ms` });
  expect(elapsed).toBeLessThan(LOGIN_BUDGET_MS);
});
