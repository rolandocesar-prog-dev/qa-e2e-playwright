# Diseño de la suite — Sauce Demo

Responde al **cómo** de [`requirements.md`](./requirements.md).

## 1. Estructura

```
tests/
├── e2e/            # especificaciones de prueba, un archivo por área (login, inventory, cart…)
├── pages/          # Page Object Model: una clase por página, sin aserciones
├── fixtures/       # fixtures de Playwright (p. ej. sesión ya iniciada)
├── setup/          # proyecto «setup»: inicia sesión una vez y guarda el estado
├── steps/          # pasos reutilizables con aserciones (p. ej. llenar el checkout)
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
  Name» quedaba vacío). `fillBuyer` (`tests/steps/checkout.steps.ts`) reintenta el llenado con `toPass` hasta que los tres campos
  tienen su valor (`toHaveValue`), sin esperas fijas. Con eso, CHK-01 a CHK-03 pasaron 75 de 75
  veces en WebKit.

## 4. Montos de la compra (CHK-03)

- Los precios se leen de la página y se convierten a **centavos enteros** (`tests/support/money.ts`)
  para comparar sin errores de coma flotante.
- Se verifica: subtotal = suma de los precios del resumen; impuesto = 8 % del subtotal redondeado
  al centavo (la tasa que aplica el sitio: $39,98 → $3,20); total = subtotal + impuesto. Si el
  sitio cambia la tasa, CHK-03 falla a propósito y la tasa se actualiza en un solo lugar.

## 5. Accesibilidad (A11Y-01)

- `@axe-core/playwright` analiza el login y el catálogo con las reglas de WCAG 2.1 A y AA
  (`tests/steps/accessibility.steps.ts`). Fallan las violaciones **críticas o graves**; las
  moderadas y menores no, pero todas quedan adjuntas al reporte (`axe-*.json`).
- Medición inicial (2026-11-06): ninguna violación de A/AA en las dos páginas. Control: al
  inyectar una imagen sin `alt` y un campo sin etiqueta, axe marca las dos como críticas.

## 6. Rendimiento y regresión visual (PERF-01, VIS-01)

- **PERF-01**: mide desde el clic en «Login» hasta que el catálogo muestra sus 6 productos, con
  `performance.now()`, y lo deja como anotación en el reporte. El sitio demora a propósito a
  `performance_glitch_user` (medido: ≈ 5,1 s, frente a 80 ms de `standard_user`); el límite de
  10 s deja margen y detectaría una degradación.
- **VIS-01**: `toHaveScreenshot` del catálogo completo en escritorio (Chromium) y móvil; se tapa
  el pie con el año, que cambia cada enero. Tolerancia: hasta 100 píxeles distintos (ver
  «Estabilidad»). Las referencias viven en
  `tests/e2e/visual.spec.ts-snapshots/`.
- **Mismo entorno en local y en el CI**: las capturas dependen del sistema y de sus fuentes, así
  que el CI corre dentro de la imagen oficial `mcr.microsoft.com/playwright` (versión de
  `@playwright/test`) y en local se usa la misma con `npm run test:docker`
  (`scripts/docker-test.mjs` toma la versión instalada). Fuera de Linux, VIS-01 se omite con el
  motivo a la vista. Para actualizar una referencia: `npm run test:docker -- --update-snapshots
-g VIS-01`, revisar la imagen y hacer commit.
- Ventaja adicional: en el contenedor también corre Firefox, que no arranca en el Windows de
  desarrollo (§10).

## 7. Configuración

- `baseURL` configurable con la variable `BASE_URL`.
- En CI: 2 reintentos, `forbidOnly`, reporte `github` + HTML.
- Evidencias: _trace_ en el primer reintento, captura y video solo cuando falla.
- **Estabilidad** (workflow manual `Estabilidad`): ejecuta la suite completa N veces (30 por
  defecto) en paralelo, **sin reintentos** y en el mismo contenedor que el CI, y guarda un reporte
  JSON por ejecución. Un trabajo final (`scripts/flaky-report.mjs`) junta los resultados por
  prueba (caso × navegador): **inestable** es la que pasa en unas ejecuciones y falla en otras;
  aparte se cuentan las que fallan siempre. Falla si la tasa de inestables llega al 1 % o si hay
  alguna rota, y publica la tabla en el resumen de la ejecución. Las fallas esperadas
  (`test.fail()`) cuentan como resultado correcto.
- **Primera medición** (2026-11-07, 30 ejecuciones, 4 170 pruebas ejecutadas): 1 prueba
  inestable de 139 (0,72 %, dentro del límite): VIS-01 en Chromium falló 3 de 30 veces, siempre
  por **1 píxel** de ~1,4 millones (variación del suavizado de imágenes). Se agregó una tolerancia
  de 100 píxeles, que no oculta un cambio real del catálogo.
- **Segunda medición** (2026-11-07, con la tolerancia): 30 ejecuciones, 4 170 pruebas,
  **0 fallas** y 0 inestables (0,00 %).

## 8. Herramientas complementarias

| Necesidad        | Herramienta                      |
| ---------------- | -------------------------------- |
| Accesibilidad    | `@axe-core/playwright`           |
| Regresión visual | `toHaveScreenshot` de Playwright |
| Lint de pruebas  | `eslint-plugin-playwright`       |

## 9. Reporte de defectos

Cada defecto se documenta en `docs/defectos/DEF-XXX.md` con: título, entorno, pasos para
reproducirlo, resultado esperado, resultado obtenido, severidad, prioridad y evidencia (captura o
_trace_).

- Plantilla y escalas de severidad y prioridad: `docs/defectos/PLANTILLA.md`; índice:
  `docs/defectos/README.md`.
- **Defectos conocidos en la suite**: la prueba verifica el comportamiento **correcto** y llama a
  `knownDefect('DEF-XXX')` (`test.fail()`) **justo antes** de la aserción que falla. Así pasa
  mientras el defecto exista, avisa cuando se corrige («Expected to fail, but passed») y un fallo
  en los pasos previos (login, llegar al checkout) sigue siendo un fallo real, no un falso
  «esperado».
- **Control**: las mismas pruebas con `standard_user` dan «Expected to fail, but passed» en los
  13 casos; eso prueba que lo que falla es el sitio y no la prueba.
- Esas pruebas guardan captura y _trace_ siempre (`test.use`), porque una falla esperada cuenta
  como «pasó» y la configuración general («solo si falla») no guardaría evidencia.

## 10. Limitación conocida del entorno local

En el equipo de desarrollo (Windows 11 Insider, compilación 26300), el Firefox de Playwright no
arranca: Windows no resuelve el ensamblado `mozglue` que declara su manifiesto (error
`spawn UNKNOWN`; el registro de eventos lo informa como error _SideBySide_), aunque
`mozglue.dll` está en la carpeta. No depende del proyecto. Para tener los cuatro navegadores en
local se usa `npm run test:docker`, el mismo contenedor del CI.
