// Ejecuta la suite dentro de la imagen oficial de Playwright, la misma del CI (design.md).
// Uso: npm run test:docker -- [opciones de playwright test], p. ej. -- --update-snapshots
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(
  readFileSync(new URL('../node_modules/@playwright/test/package.json', import.meta.url), 'utf8'),
);
const image = `mcr.microsoft.com/playwright:v${version}-noble`;

const result = spawnSync(
  'docker',
  [
    'run',
    '--rm',
    '--ipc=host',
    '--volume',
    `${process.cwd()}:/work`,
    '--workdir',
    '/work',
    '--env',
    'CI',
    image,
    'npx',
    'playwright',
    'test',
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit' },
);
process.exit(result.status ?? 1);
