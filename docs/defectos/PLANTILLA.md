# DEF-XXX · Título breve: qué falla y dónde

<!-- Copia este archivo como DEF-XXX.md (número siguiente del índice) y agrégalo a README.md. -->

| Campo        | Valor                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| Estado       | Abierto · Reportado · Corregido · Descartado                           |
| Severidad    | Crítica · Alta · Media · Baja (ver escala abajo)                       |
| Prioridad    | Alta · Media · Baja (ver escala abajo)                                 |
| Caso de plan | ID del caso de `specs/requirements.md` que lo detecta (p. ej. SPEC-01) |
| Prueba       | Archivo y título de la prueba automatizada que lo reproduce            |
| Entorno      | URL, usuario y navegadores donde se reprodujo                          |
| Detectado    | AAAA-MM-DD                                                             |

## Pasos para reproducirlo

1. …
2. …

## Resultado esperado

Lo que debería pasar, según el comportamiento de referencia (`standard_user`) o el plan.

## Resultado obtenido

Lo que pasa en realidad, con los mensajes exactos (pantalla, consola o diálogo).

## Evidencia

- Prueba automatizada que falla mientras el defecto exista: su ejecución deja captura, video y
  _trace_ en el reporte HTML.
- Capturas o mensajes adicionales, si aportan.

## Notas

Impacto, alcance (qué otros productos o pasos afecta) y cualquier hipótesis sobre la causa.

---

### Escalas

**Severidad** (impacto en el usuario):

- **Crítica**: impide completar la compra o perder datos, sin alternativa.
- **Alta**: una función principal falla, aunque haya alternativa.
- **Media**: una función secundaria falla o la información mostrada es incorrecta.
- **Baja**: detalle visual o de texto que no impide usar el sitio.

**Prioridad** (urgencia de la corrección):

- **Alta**: corregir antes de la próxima entrega.
- **Media**: planificar en el ciclo siguiente.
- **Baja**: corregir cuando haya capacidad.
