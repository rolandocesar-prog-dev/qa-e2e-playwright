// Junta los reportes JSON de varias ejecuciones y calcula la tasa de pruebas inestables.
// Uso: node scripts/flaky-report.mjs <carpeta con los results.json>  (escribe Markdown)
// Sale con código 1 si la tasa llega al límite o si alguna prueba falla en todas las ejecuciones.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FLAKY_LIMIT = 0.01; // requirements.md §5: menos del 1 %

function reportFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return reportFiles(path);
    return name.endsWith('.json') ? [path] : [];
  });
}

function collect(suite, titles, outcomes) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      if (test.status === 'skipped') continue;
      const key = `${test.projectName} › ${[...titles, spec.title].join(' › ')}`;
      // Sin reintentos: «expected» incluye las fallas esperadas (test.fail) que fallaron.
      const passed = test.status === 'expected';
      outcomes.set(key, [...(outcomes.get(key) ?? []), passed]);
    }
  }
  for (const child of suite.suites ?? []) {
    collect(child, child.title ? [...titles, child.title] : titles, outcomes);
  }
}

const files = reportFiles(process.argv[2] ?? 'results');
const outcomes = new Map();
for (const file of files) {
  const report = JSON.parse(readFileSync(file, 'utf8'));
  for (const suite of report.suites) collect(suite, [suite.title], outcomes);
}

const executions = [...outcomes.values()].flat();
const failedExecutions = executions.filter((passed) => !passed).length;
const flaky = [...outcomes].filter(([, runs]) => runs.some(Boolean) && runs.some((p) => !p));
const broken = [...outcomes].filter(([, runs]) => !runs.some(Boolean));
const rate = outcomes.size ? flaky.length / outcomes.size : 0;
const percent = (value) => `${(value * 100).toFixed(2).replace('.', ',')} %`;

const lines = [
  '## Estabilidad de la suite',
  '',
  '| Métrica | Valor |',
  '| --- | --- |',
  `| Ejecuciones de la suite | ${files.length} |`,
  `| Pruebas distintas (caso × navegador) | ${outcomes.size} |`,
  `| Ejecuciones de pruebas | ${executions.length} |`,
  `| Ejecuciones fallidas | ${failedExecutions} |`,
  `| Pruebas inestables | ${flaky.length} (${percent(rate)}; límite ${percent(FLAKY_LIMIT)}) |`,
  `| Pruebas que fallan siempre | ${broken.length} |`,
];
for (const [label, list] of [
  ['Inestables', flaky],
  ['Fallan siempre', broken],
]) {
  if (list.length) {
    lines.push('', `### ${label}`, '');
    for (const [key, runs] of list) {
      lines.push(`- ${key}: falló ${runs.filter((p) => !p).length} de ${runs.length}`);
    }
  }
}
console.log(lines.join('\n'));

if (files.length === 0 || rate >= FLAKY_LIMIT || broken.length > 0) process.exit(1);
