undefinedAutomatizado |undefinedAutomatizado |undefinedAutomatizado |undefinedAutomatizado |# Plan de pruebas — Sauce Demo

> Spec Driven Development aplicado a QA: este documento define **qué** se prueba y con qué
> criterios. El **cómo** está en [`design.md`](./design.md) y el plan en [`tasks.md`](./tasks.md).

## 1. Objetivo

Construir una suite automatizada, mantenible y confiable que verifique los flujos críticos de
compra de [Sauce Demo](https://www.saucedemo.com), un sitio público creado para practicar
automatización de pruebas.

## 2. Alcance

**Incluye:** inicio de sesión, catálogo, carrito, compra (_checkout_), cierre de sesión,
comportamiento con los usuarios especiales del sitio, accesibilidad básica y rendimiento
percibido.

**Fuera de alcance:** pruebas de carga, seguridad intrusiva y API (el sitio no expone una API
pública).

## 3. Entornos

- Navegadores: Chromium, Firefox, WebKit y Chrome móvil (emulado).
- Ejecución local y en GitHub Actions en cada push, en cada pull request y una vez al día.

## 4. Casos de prueba

Prioridad: **A** = bloqueante para la compra, **M** = importante, **B** = deseable.

### Inicio de sesión (LOGIN)

| ID       | Caso                                                     | Prioridad | Estado       |
| -------- | -------------------------------------------------------- | --------- | ------------ |
| LOGIN-01 | Usuario válido entra al catálogo                         | A         | Automatizado |
| LOGIN-02 | Usuario bloqueado ve un mensaje de error                 | A         | Automatizado |
| LOGIN-03 | Contraseña incorrecta no permite el acceso               | A         | Automatizado |
| LOGIN-04 | Campos vacíos indican que el usuario es obligatorio      | M         | Automatizado |
| LOGIN-05 | Acceder a `/inventory.html` sin sesión redirige al login | A         | Automatizado |

### Catálogo (INV)

| ID     | Caso                                                | Prioridad | Estado       |
| ------ | --------------------------------------------------- | --------- | ------------ |
| INV-01 | Se muestran 6 productos con nombre, precio e imagen | A         | Automatizado |
| INV-02 | Ordenar por precio ascendente y descendente         | M         | Automatizado |
| INV-03 | Ordenar por nombre A-Z y Z-A                        | M         | Automatizado |
| INV-04 | El detalle de un producto coincide con su tarjeta   | M         | Automatizado |

### Carrito (CART)

| ID      | Caso                                                    | Prioridad | Estado       |
| ------- | ------------------------------------------------------- | --------- | ------------ |
| CART-01 | Agregar un producto actualiza el contador del carrito   | A         | Automatizado |
| CART-02 | Quitar un producto desde el catálogo y desde el carrito | A         | Automatizado |
| CART-03 | El carrito se conserva al navegar entre páginas         | M         | Automatizado |

### Compra (CHK)

| ID     | Caso                                                                            | Prioridad | Estado       |
| ------ | ------------------------------------------------------------------------------- | --------- | ------------ |
| CHK-01 | Compra completa de punta a punta                                                | A         | Automatizado |
| CHK-02 | Datos obligatorios del comprador (nombre, apellido, código)                     | A         | Automatizado |
| CHK-03 | Subtotal, impuesto y total calculados correctamente                             | A         | Automatizado |
| CHK-04 | Cancelar la compra conserva los productos (paso 1 → carrito, paso 2 → catálogo) | M         | Automatizado |

### Usuarios especiales y calidad (SPEC, A11Y, PERF)

| ID      | Caso                                                                       | Prioridad | Estado       |
| ------- | -------------------------------------------------------------------------- | --------- | ------------ |
| SPEC-01 | `problem_user`: detectar y reportar los defectos visibles                  | M         | Automatizado |
| SPEC-02 | `error_user`: detectar fallos en la compra                                 | M         | Automatizado |
| PERF-01 | `performance_glitch_user`: el login termina en menos de 10 s               | B         | Pendiente    |
| A11Y-01 | Login y catálogo sin violaciones críticas ni graves de WCAG 2.1 A/AA (axe) | M         | Automatizado |
| VIS-01  | Regresión visual del catálogo                                              | B         | Pendiente    |

## 5. Criterios de calidad de la suite

- Cada prueba es **independiente** y puede ejecutarse sola o en paralelo.
- Sin esperas fijas (`waitForTimeout`): solo esperas automáticas y aserciones con reintento.
- Selectores estables (`data-test`), nunca rutas CSS frágiles ni textos que cambian.
- Tasa de pruebas inestables (_flaky_) menor al 1 % en 30 ejecuciones del CI.
- Cada fallo deja captura, video y _trace_ para diagnosticarlo.

## 6. Criterio de salida

- Todos los casos de prioridad A automatizados y en verde.
- Defectos encontrados documentados en `docs/defectos/` con la plantilla del proyecto.
- Reporte HTML publicado (GitHub Pages) y enlazado en el README.
