# Tareas — Suite E2E de Sauce Demo

Marca `[x]` al terminar y haz un commit por tarea. Actualiza el estado del caso en
`requirements.md` cuando quede automatizado.

## M0 · Base

- [x] Playwright + TypeScript estricto, ESLint con reglas de Playwright y Prettier.
- [x] Configuración multinavegador, evidencias y reporte HTML.
- [x] Page Objects de login y catálogo; casos LOGIN-01 a LOGIN-04.
- [x] CI con ejecución diaria y reporte como artefacto.
- [x] Plan de pruebas (SDD).
- [x] Ejecutar `npx playwright install` y `npm test` en local; confirmar todo en verde (con `npm run test:docker`: Firefox no arranca en el Windows de desarrollo, design.md §10).

## M1 · Flujos críticos (prioridad A)

- [x] Fixture `loggedInPage` con `storageState`.
- [x] LOGIN-05, INV-01, CART-01, CART-02.
- [x] Page Objects de carrito y compra; CHK-01 a CHK-03.

## M2 · Cobertura funcional (prioridad M)

- [x] INV-02 a INV-04, CART-03, CHK-04.
- [x] SPEC-01 y SPEC-02, con sus defectos documentados en `docs/defectos/` (13).
- [x] Plantilla de reporte de defectos.

## M3 · Calidad no funcional

- [x] A11Y-01 con `@axe-core/playwright`.
- [x] PERF-01 y VIS-01 (CI en el contenedor oficial de Playwright; en local, `npm run test:docker`).
- [x] Medir la tasa de pruebas inestables en 30 ejecuciones (0,72 %: VIS-01 por 1 píxel; con tolerancia, 0,00 %).

## M4 · Entrega

- [x] Publicar el reporte HTML en GitHub Pages desde el CI (https://rolandocesar-prog-dev.github.io/qa-e2e-playwright/).
- [ ] README final con capturas del reporte y métricas de la suite.
- [ ] Agregar el proyecto, con enlaces, a la sección Proyectos del CV.
