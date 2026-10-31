/**
 * Usuarios de demostración que Sauce Demo publica en su propia página de inicio de sesión.
 * No son credenciales privadas: el sitio existe para practicar automatización de pruebas.
 */
export const PASSWORD = 'secret_sauce';

export const users = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;
