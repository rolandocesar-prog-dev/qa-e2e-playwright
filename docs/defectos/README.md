# Defectos encontrados

Cada defecto se documenta con la [plantilla](./PLANTILLA.md) en un archivo `DEF-XXX.md` y se
enlaza aquí. Mientras siga abierto, su prueba automatizada está marcada con `test.fail()`: pasa
porque el defecto existe y avisa (falla) el día que el sitio lo corrija.

| ID                      | Título                                                               | Usuario        | Severidad | Prioridad | Estado  |
| ----------------------- | -------------------------------------------------------------------- | -------------- | --------- | --------- | ------- |
| [DEF-001](./DEF-001.md) | Todos los productos del catálogo muestran la misma imagen            | `problem_user` | Media     | Media     | Abierto |
| [DEF-002](./DEF-002.md) | Ordenar el catálogo no cambia el orden                               | `problem_user` | Media     | Baja      | Abierto |
| [DEF-003](./DEF-003.md) | Tres productos no se pueden agregar al carrito                       | `problem_user` | Alta      | Alta      | Abierto |
| [DEF-004](./DEF-004.md) | Quitar un producto desde el catálogo no lo quita                     | `problem_user` | Alta      | Media     | Abierto |
| [DEF-005](./DEF-005.md) | El detalle muestra un producto distinto del elegido                  | `problem_user` | Alta      | Alta      | Abierto |
| [DEF-006](./DEF-006.md) | Lo que se escribe en «Last Name» va al campo «First Name»            | `problem_user` | Crítica   | Alta      | Abierto |
| [DEF-007](./DEF-007.md) | Ordenar el catálogo muestra «Sorting is broken!» y no ordena         | `error_user`   | Media     | Baja      | Abierto |
| [DEF-008](./DEF-008.md) | Tres productos no se pueden agregar al carrito (error de JavaScript) | `error_user`   | Alta      | Alta      | Abierto |
| [DEF-009](./DEF-009.md) | Quitar un producto desde el catálogo falla (error de JavaScript)     | `error_user`   | Alta      | Media     | Abierto |
| [DEF-010](./DEF-010.md) | El detalle de producto no muestra la descripción                     | `error_user`   | Media     | Baja      | Abierto |
| [DEF-011](./DEF-011.md) | El campo «Last Name» no acepta texto                                 | `error_user`   | Alta      | Media     | Abierto |
| [DEF-012](./DEF-012.md) | Se puede continuar el checkout sin el apellido obligatorio           | `error_user`   | Alta      | Alta      | Abierto |
| [DEF-013](./DEF-013.md) | «Finish» no completa la compra                                       | `error_user`   | Crítica   | Alta      | Abierto |
