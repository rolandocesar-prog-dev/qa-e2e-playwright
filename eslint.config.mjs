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
    },
  },
  {
    files: ['eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
);
