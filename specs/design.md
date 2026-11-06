# Diseño de la suite — Sauce Demo

Responde al **cómo** de [`requirements.md`](./requirements.md).

## 1. Estructura

```
tests/
├── e2e/            # especificaciones de prueba, un archivo por área (login, inventory, cart…)
├── pages/          # Page Object Model: una clase por página, sin aserciones
├── fixtures/       # fixtures de Playwright (p. ej. sesión ya iniciada)
├── setup/          # proyecto «setup»: inicia sesión una vez y guarda el estado
├── support/        # utilidades sin Playwright (p. ej. montos en centavos)
└── data/           # datos de prueba (usuarios de demostración, productos, compradores)
```

## 2. Patrones

| Patrón            | Uso                                                                                |
| ----------------- | ---------------------------------------------------------------------------------- |
| Page Object Model | Las páginas exponen _locators_ y acciones; las aserciones viven en las pruebas.    |
| Fixtures          | `loggedInPage` inicia sesión una vez por prueba sin repetir pasos en cada archivo. |
| Estado de sesión  | `storageState` para saltar el login en las pruebas que no lo verifican.            |
| Selectores        | `getByTestId` con `testIdAttribute: 'data-test'`; `getByRole` cuando aplique.      |
| IDs de caso       | El título de cada prueba empieza con su ID (`LOGIN-01`) para trazarla al plan.     |

## 3. Sesión iniciada (`loggedInPage`)

- Un proyecto `setup` (`tests/setup/auth.setup.ts`) inicia sesión con `standard_user` **por la
  interfaz**, comprueba que llegó al catálogo y guarda el estado del navegador en
  `playwright/.auth/standard-user.json` (ignorado por git). Los proyectos de navegador dependen de
  él, así que corre una vez por ejecución.
- Sauce Demo guarda la sesión en la cookie `session-username` y el carrito en `localStorage`
  (`cart-contents`): `storageState` captura los dos. Como el estado se guarda con el carrito
  vacío y cada prueba abre un contexto nuevo, las pruebas siguen siendo independientes aunque
  agreguen productos.
- `tests/fixtures/index.ts` exporta un `test` que usa ese estado y la fixture `loggedInPage`:
  el catálogo ya abierto (`InventoryPage`). Las pruebas de inicio de sesión usan el `test` base,
  sin estado, porque verifican justamente el login.
- El sitio es una SPA: la URL cambia antes de que se dibuje la página nueva. Por eso las pruebas
  esperan con aserciones que reintentan (`toHaveText`, `toHaveURL`…), nunca con lecturas
  inmediatas. Al abrir el detalle de un producto se espera primero «Back to products», que solo
  existe ahí: si no, el nombre puede leerse todavía del catálogo (6 coincidencias).
- El formulario del comprador se vuelve a dibujar justo después de aparecer y puede borrar lo
  escrito en ese instante. Pasa bajo carga (se vio en WebKit, con 6 procesos en paralelo: «First
  Name» quedaba vacío). `submitBuyer` reintenta el llenado con `toPass` hasta que los tres campos
  tienen su valor (`toHaveValue`), sin esperas fijas. Con eso, CHK-01 a CHK-03 pasaron 75 de 75
  veces en WebKit.

## 4. Montos de la compra (CHK-03)

- Los precios se leen de la página y se convierten a **centavos enteros** (`tests/support/money.ts`)
  para comparar sin errores de coma flotante.
- Se verifica: subtotal = suma de los precios del resumen; impuesto = 8 % del subtotal redondeado
  al centavo (la tasa que aplica el sitio: $39,98 → $3,20); total = subtotal + impuesto. Si el
  sitio cambia la tasa, CHK-03 falla a propósito y la tasa se actualiza en un solo lugar.

## 5. Configuración

- `baseURL` configurable con la variable `BASE_URL`.
- En CI: 2 reintentos, `forbidOnly`, reporte `github` + HTML.
- Evidencias: _trace_ en el primer reintento, captura y video solo cuando falla.

## 6. Herramientas complementarias

| Necesidad        | Herramienta                      |
| ---------------- | -------------------------------- |
| Accesibilidad    | `@axe-core/playwright`           |
| Regresión visual | `toHaveScreenshot` de Playwright |
| Lint de pruebas  | `eslint-plugin-playwright`       |

## 7. Reporte de defectos

Cada defecto se documenta en `docs/defectos/DEF-XXX.md` con: título, entorno, pasos para
reproducirlo, resultado esperado, resultado obtenido, severidad, prioridad y evidencia (captura o
_trace_).

## 8. Limitación conocida del entorno local

En el equipo de desarrollo (Windows 11 Insider, compilación 26300), el Firefox de Playwright no
arranca: Windows no resuelve el ensamblado `mozglue` que declara su manifiesto (error
`spawn UNKNOWN`; el registro de eventos lo informa como error _SideBySide_), aunque
`mozglue.dll` está en la carpeta. No depende del proyecto. Firefox se prueba en el CI (Ubuntu),
donde la suite completa pasa en los cuatro navegadores.
