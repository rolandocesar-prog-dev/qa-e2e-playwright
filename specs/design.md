# Diseño de la suite — Sauce Demo

Responde al **cómo** de [`requirements.md`](./requirements.md).

## 1. Estructura

```
tests/
├── e2e/            # especificaciones de prueba, un archivo por área (login, inventory, cart…)
├── pages/          # Page Object Model: una clase por página, sin aserciones
├── fixtures/       # fixtures de Playwright (p. ej. sesión ya iniciada)
└── data/           # datos de prueba (usuarios de demostración, compradores)
```

## 2. Patrones

| Patrón            | Uso                                                                                |
| ----------------- | ---------------------------------------------------------------------------------- |
| Page Object Model | Las páginas exponen _locators_ y acciones; las aserciones viven en las pruebas.    |
| Fixtures          | `loggedInPage` inicia sesión una vez por prueba sin repetir pasos en cada archivo. |
| Estado de sesión  | `storageState` para saltar el login en las pruebas que no lo verifican.            |
| Selectores        | `getByTestId` con `testIdAttribute: 'data-test'`; `getByRole` cuando aplique.      |
| IDs de caso       | El título de cada prueba empieza con su ID (`LOGIN-01`) para trazarla al plan.     |

## 3. Configuración

- `baseURL` configurable con la variable `BASE_URL`.
- En CI: 2 reintentos, `forbidOnly`, reporte `github` + HTML.
- Evidencias: _trace_ en el primer reintento, captura y video solo cuando falla.

## 4. Herramientas complementarias

| Necesidad        | Herramienta                      |
| ---------------- | -------------------------------- |
| Accesibilidad    | `@axe-core/playwright`           |
| Regresión visual | `toHaveScreenshot` de Playwright |
| Lint de pruebas  | `eslint-plugin-playwright`       |

## 5. Reporte de defectos

Cada defecto se documenta en `docs/defectos/DEF-XXX.md` con: título, entorno, pasos para
reproducirlo, resultado esperado, resultado obtenido, severidad, prioridad y evidencia (captura o
_trace_).
