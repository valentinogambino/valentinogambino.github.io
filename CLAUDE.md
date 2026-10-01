# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Propósito

CV personal de Valentino Gambino, publicado en GitHub Pages
(`valentinogambino.github.io/cv`, repo `valentinogambino/cv`, servido desde
`main` + `/docs`). Se actualiza cada seis meses. Dos variantes por dos idiomas:

| URL | Variante | PDF |
|---|---|---|
| `/cv/` · `/cv/en/` | Ingeniería (principal) | `cv-valentino-gambino-{es,en}.pdf` |
| `/cv/dev/` · `/cv/dev/en/` | Desarrollo (se comparte por link, no se enlaza) | `cv-valentino-gambino-dev-{es,en}.pdf` |

## Comandos

- `node build.mjs`: regenera `docs/` completo (4 HTML + 4 PDF con Edge
  headless) y corre la guardia de datos sensibles. `--no-pdf` saltea los PDF.
- `node scripts/check-sensible.mjs`: guardia sola sobre `docs/` y `data/`.
  `--staged` revisa el índice de git (lo usa el hook).
- Hook pre-commit: `.githooks/pre-commit`; se activa una vez por clon con
  `git config core.hooksPath .githooks`.
- Vista local: `python -m http.server 8765 --directory docs`.

Sin `npm install`: Node 24 con módulos nativos solamente.

## Arquitectura

- **Formato:** el de MIT CAPD (*Career Advising & Professional Development*)
  y sus CV de ejemplo. Ante cualquier duda de formato, se consulta la guía
  oficial (`capd.mit.edu/resources/resumes/`), no la memoria. `DESIGN.md`
  documenta cómo se aplicó.
- **`data/cv.json`** es la única fuente de contenido; los textos traducibles
  son `{es, en}`.
  - Cada variante define `sections`, `educationOrder` y `skillOrder`.
  - Cada carrera tiene `coursework.{ing,dev}.{es,en}`: la línea "Materias
    relevantes" que destaca cada variante. Las variantes solo difieren en eso
    y en el orden de las habilidades (criterio *targeted* de MIT).
  - `gpa: null` y las secciones vacías (`experience`, LinkedIn) no se
    renderizan.
- **`build.mjs`** rellena `src/template.html` (marcadores `{{...}}`, todo
  escapado salvo `body`).
  - Habilidades: una línea por categoría, con los niveles de
    `labels.*.levels` ("manejo intermedio de…" / "proficient in…").
  - "Actualizado" sale de la fecha del build.
  - Después de imprimir, pisa `/Creator` y `/Producer` del PDF con texto del
    mismo largo, para no exponer el user-agent sin romper los offsets del xref.
- **`src/styles.css`:** Tinos (equivalente a Times), negro sobre blanco y
  etiquetas de sección a la izquierda (arriba en móvil). El `@media print`
  es A4 a 11pt con márgenes de 19mm y tiene que seguir entrando en 1 página
  (MIT: nunca menos de 10pt). Sin JS en la página. Debe funcionar a 402px
  sin scroll horizontal.
- `PRODUCT.md` y `.impeccable/` son el contexto de diseño de la skill
  `impeccable`; `DESIGN.md` documenta el sistema visual.

## Datos sensibles

- `fuentes/` (en `.gitignore`) guarda los documentos originales, con DNI,
  domicilio, teléfono y fecha de nacimiento. Nunca se suben ni se copian a
  `data/` o `docs/`. Público: nombre, email, ciudad, LinkedIn, estudios, skills,
  idiomas e intereses.
- La guardia busca patrones genéricos. Nunca escribas un valor sensible
  literal en ningún archivo del repo, ni siquiera para chequearlo.
- Los commits de este repo firman con el email noreply de GitHub (config
  local).

## Fuentes de contenido

- `fuentes/`:
  - analítico del IPS (Técnico Mecánico, 2015–2021);
  - `Plan de estudios II 2018 - GAMBINO.xlsx`: plan de Ingeniería Industrial
    de la UCA, con las equivalencias de la carrera anterior;
  - estado académico de la TUP;
  - `PREANALITICO UTN/`: preanalítico de Ingeniería Mecánica en UTN FRRo,
    54 páginas (folio 4: materias rendidas y promedio);
  - `FCE/`: Statement of Results del Cambridge First Certificate (B2, dic. 2024);
  - `resumen.png`: captura del perfil de Techint Careers, de 2630×16384 px.
    Para leerla, recortarla por zonas con PowerShell `System.Drawing` en el
    scratchpad (no hay PIL).
- `G:\My Drive\ACADEMICO` (UCA, TUP, IPS): solo lectura.
- Ignorar por completo el CV de la clase de Inglés I
  (`TUP\2022 - 2024\C1\Ingles I\`): el puesto que figura ahí es inventado.
- Decisiones que no se re-preguntan:
  - UCA: desde 2026. El avance es el documentado (equivalencias + materias
    aprobadas), no el de Techint.
  - TUP: desde 2024 (plan 2024).
  - Ingeniería Mecánica UTN (2024–2025): va como "estudios previos".
  - Promedios: se muestran donde existen (TUP, UTN Mecánica, IPS).
  - Inglés: B2 según el FCE. Italiano y portugués: básico. Español: nativo.
  - Sin perfil, sin subtítulo y sin sección de proyectos.
  - No se incluyen las prácticas profesionalizantes del IPS.

## Actualización semestral (15/03 y 15/09; recordatorio en Google Calendar)

1. Bajar el estado académico nuevo de la TUP y de la UCA a `fuentes/` y
   actualizar el perfil de Techint.
2. Editar `data/cv.json`: materias aprobadas, promedios, materias relevantes,
   skills nuevas, experiencia.
3. `node build.mjs`.
4. Revisar las 4 páginas a 402px y los 4 PDF (1 página cada uno).
5. Commit, `git tag AAAA-S` y `git push --follow-tags`.

## Pendientes

- Pasar la URL de LinkedIn y cargarla en `contact.linkedin`.
- El usuario tiene que corregir Techint para que coincida con el CV:
  - UCA: desde 2026, 10 de 63 materias.
  - TUP: desde 2024, 8 de 18 materias.
  - Sumar Ingeniería Mecánica UTN.
  - Sumar el FCE B2.
- Cargar la experiencia laboral cuando exista.
