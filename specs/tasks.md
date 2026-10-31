# Tareas — Suite E2E de Sauce Demo

Marca `[x]` al terminar y haz un commit por tarea. Actualiza el estado del caso en
`requirements.md` cuando quede automatizado.

## M0 · Base

- [x] Playwright + TypeScript estricto, ESLint con reglas de Playwright y Prettier.
- [x] Configuración multinavegador, evidencias y reporte HTML.
- [x] Page Objects de login y catálogo; casos LOGIN-01 a LOGIN-04.
- [x] CI con ejecución diaria y reporte como artefacto.
- [x] Plan de pruebas (SDD).
- [ ] Ejecutar `npx playwright install` y `npm test` en local; confirmar todo en verde.

## M1 · Flujos críticos (prioridad A)

- [ ] Fixture `loggedInPage` con `storageState`.
- [ ] LOGIN-05, INV-01, CART-01, CART-02.
- [ ] Page Objects de carrito y compra; CHK-01 a CHK-03.

## M2 · Cobertura funcional (prioridad M)

- [ ] INV-02 a INV-04, CART-03, CHK-04.
- [ ] SPEC-01 y SPEC-02, con sus defectos documentados en `docs/defectos/`.
- [ ] Plantilla de reporte de defectos.

## M3 · Calidad no funcional

- [ ] A11Y-01 con `@axe-core/playwright`.
- [ ] PERF-01 y VIS-01.
- [ ] Medir la tasa de pruebas inestables en 30 ejecuciones.

## M4 · Entrega

- [ ] Publicar el reporte HTML en GitHub Pages desde el CI.
- [ ] README final con capturas del reporte y métricas de la suite.
- [ ] Agregar el proyecto, con enlaces, a la sección Proyectos del CV.
