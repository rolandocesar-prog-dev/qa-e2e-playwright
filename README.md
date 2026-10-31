# QA E2E con Playwright — Sauce Demo

[![E2E](https://github.com/rolandocesar-prog-dev/qa-e2e-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/rolandocesar-prog-dev/qa-e2e-playwright/actions/workflows/ci.yml)

Suite de pruebas end-to-end sobre [Sauce Demo](https://www.saucedemo.com), un sitio público creado
para practicar automatización. Parte de un **plan de pruebas** con casos priorizados y trazables,
y se ejecuta en cuatro navegadores en cada cambio y una vez al día.

> 🚧 Proyecto en desarrollo. El avance está en [`specs/tasks.md`](./specs/tasks.md).

## Qué demuestra

- Plan de pruebas con casos priorizados e identificados (`LOGIN-01`, `CHK-03`…).
- Page Object Model, fixtures y selectores estables.
- Ejecución multinavegador (Chromium, Firefox, WebKit y móvil).
- Evidencias automáticas: captura, video y _trace_ de cada fallo.
- CI con reporte HTML y ejecución programada.
- Accesibilidad y regresión visual (hitos siguientes).

## Stack

Playwright · TypeScript · ESLint (eslint-plugin-playwright) · Prettier · GitHub Actions

## Cómo ejecutarlo

```bash
npm ci
npx playwright install
npm test            # todas las pruebas, en paralelo
npm run test:ui     # modo interactivo
npm run report      # abre el último reporte HTML
```

## Cómo se desarrolla

El proyecto sigue **Spec Driven Development** aplicado a QA:

- [`specs/requirements.md`](./specs/requirements.md): plan de pruebas y casos.
- [`specs/design.md`](./specs/design.md): estructura y patrones de la suite.
- [`specs/tasks.md`](./specs/tasks.md): plan por hitos.

## Licencia

[MIT](./LICENSE). Sauce Demo es propiedad de Sauce Labs; este proyecto solo lo usa como sitio de
práctica.
