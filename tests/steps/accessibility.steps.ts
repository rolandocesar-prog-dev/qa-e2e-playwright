import { AxeBuilder } from '@axe-core/playwright';
import { type Page, type TestInfo } from '@playwright/test';

/** Reglas de WCAG 2.1 niveles A y AA (design.md, A11Y-01). */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const BLOCKING_IMPACTS = new Set(['critical', 'serious']);

export type A11yViolation = { id: string; impact: string; help: string; nodes: number };

/**
 * Analiza la página con axe, adjunta el resultado completo al reporte y devuelve las
 * violaciones críticas o graves (las que hacen fallar A11Y-01).
 */
export async function blockingA11yViolations(
  page: Page,
  testInfo: TestInfo,
  label: string,
): Promise<A11yViolation[]> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  await testInfo.attach(`axe-${label}.json`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });
  return results.violations
    .filter((violation) => BLOCKING_IMPACTS.has(violation.impact ?? ''))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact ?? '',
      help: violation.help,
      nodes: violation.nodes.length,
    }));
}
