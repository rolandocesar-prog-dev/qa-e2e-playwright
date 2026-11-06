/**
 * Montos en centavos enteros, para comparar sin errores de coma flotante (design.md, CHK-03).
 */

/** Tasa de impuesto que aplica Sauce Demo al subtotal. */
export const TAX_RATE = 0.08;

/** Extrae el monto de un texto como «$29.99» o «Item total: $39.98» y lo devuelve en centavos. */
export function toCents(text: string): number {
  const match = /\$(\d+)\.(\d{2})/.exec(text);
  if (!match?.[1] || !match[2]) {
    throw new Error(`No hay un monto en dólares en «${text}».`);
  }
  return Number(match[1]) * 100 + Number(match[2]);
}

export function sum(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

/** Impuesto sobre un subtotal en centavos, redondeado al centavo. */
export function taxOn(subtotalCents: number): number {
  return Math.round(subtotalCents * TAX_RATE);
}
