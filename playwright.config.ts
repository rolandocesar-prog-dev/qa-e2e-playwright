import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    // Sauce Demo marca sus elementos con data-test: se usan como selectores estables.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Inicia sesión una vez por ejecución y guarda el estado (fixture loggedInPage, design.md).
    { name: 'setup', testDir: './tests/setup', testMatch: /.*\.setup\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
  ],
});
