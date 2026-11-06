import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'test-results', 'playwright-report', 'blob-report'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      // expectSoon es expect con un tiempo de espera menor (tests/e2e/special-users.spec.ts).
      'playwright/expect-expect': ['warn', { assertFunctionNames: ['expectSoon'] }],
      // Permitido solo con condición y motivo (p. ej. VIS-01 fuera del contenedor de Playwright).
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
  },
  {
    files: ['eslint.config.mjs', 'scripts/**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly', URL: 'readonly' } },
  },
);
