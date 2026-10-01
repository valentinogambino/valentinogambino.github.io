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

- `data/cv.json` es la única fuente de contenido. Los textos traducibles son
  `{es, en}`. Cada variante define `headline`, `summary`, `sections` (orden),
  `educationOrder` y `skillOrder`. El contenido es el mismo en las dos
  variantes; solo cambian perfil y orden. Las secciones vacías (`experience`)
  y el LinkedIn vacío no se renderizan.
- `build.mjs` rellena `src/template.html` (marcadores `{{...}}`, todo
  escapado salvo `body`). El número de revisión (`Rev. AAAA-S`, S=1 ene–jun,
  S=2 jul–dic) y la fecha "Actualizado" salen de la fecha del build. Después de
  imprimir, pisa `/Creator` y `/Producer` del PDF con texto del mismo largo,
  para no exponer el user-agent sin romper los offsets del xref.
- `src/styles.css`: hoja de plano técnico (rótulo tipo ISO 7200, Barlow /
  Barlow Semi Condensed, acento teal). Incluye el `@media print` A4, que tiene
  que seguir entrando en 1 página. Sin JS en la página. Debe funcionar a 402px
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
  - `resumen.png`: captura del perfil de Techint Careers, de 2630×16384 px.
    Para leerla, recortarla por zonas con PowerShell `System.Drawing` en el
    scratchpad (no hay PIL).
- `G:\My Drive\ACADEMICO` (UCA, TUP, IPS): solo lectura.
- Ignorar por completo el CV de la clase de Inglés I
  (`TUP\2022 - 2024\C1\Ingles I\`): el puesto que figura ahí es inventado.
- Decisiones que no se re-preguntan:
  - TUP: va desde 2024 (plan 2024).
  - Avance UCA: el número cargado en Techint.
  - No se incluye la Ingeniería Mecánica previa.
  - No se incluyen las prácticas profesionalizantes del IPS.
  - Sin promedios.
  - Sin sección de proyectos.

## Actualización semestral (15/03 y 15/09; recordatorio en Google Calendar)

1. Bajar el estado académico nuevo de la TUP y de la UCA a `fuentes/` y
   actualizar el perfil de Techint.
2. Editar `data/cv.json`: materias aprobadas, skills nuevas, experiencia.
3. `node build.mjs`.
4. Revisar las 4 páginas a 402px y los 4 PDF (1 página cada uno).
5. Commit, `git tag AAAA-S` y `git push --follow-tags`.

## Pendientes

- Pasar la URL de LinkedIn y cargarla en `contact.linkedin`.
- Cargar la experiencia laboral cuando exista.
