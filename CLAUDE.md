# CLAUDE.md

Documentos de carrera de Valentino Gambino, hechos según las guías de MIT CAPD.
Las reglas están en `GUIA.md` (importada abajo) y se siguen siempre. Ante una
duda de formato o redacción se relee la página de MIT que cita la guía; no se
resuelve de memoria.

@GUIA.md

## Documentos

| Documento | Para qué | Dónde | PDF |
|---|---|---|---|
| Resume Ingeniería (principal) | industria | `/cv/` · `/cv/en/` | `cv-valentino-gambino-{a4,letter}.pdf` · `resume-valentino-gambino-{a4,letter}.pdf` |
| Resume Desarrollo | software; se comparte por link, `noindex` | `/cv/dev/` · `/cv/dev/en/` | ídem con `-dev` |
| CV académico (maestro) | ayudantía, beca, intercambio, posgrado | solo local: `local/academico/` | `cv-academico-…`, `cv-…-academic-…` |

- GitHub Pages: `valentinogambino.github.io/cv`, repo `valentinogambino/cv`,
  servido desde `main` + `/docs`.
- El CV no se publica hasta que el usuario lo revise y lo decida. Si se
  publica: por link, sin enlazarlo y con `noindex` (`publish: true` en
  `data/cv.json`).

## Comandos

- `node build.mjs`: regenera `docs/` y `local/` (6 HTML, 12 PDF con Edge
  headless), corre la guardia de datos sensibles y la prueba ATS. `--no-pdf`
  saltea los PDF y la prueba.
- `node scripts/check-sensible.mjs`: guardia sola sobre `docs/`, `local/` y
  `data/`. `--staged` revisa el índice de git (lo usa el hook).
- Hook pre-commit: `.githooks/pre-commit`; se activa una vez por clon con
  `git config core.hooksPath .githooks`.
- Vista local: `python -m http.server 8765 --directory docs` (o `local`).

Sin `npm install`: Node 24 con módulos nativos. La prueba ATS usa `pdftotext`
(Git para Windows o MiKTeX).

## Arquitectura

- `data/cv.json` es la única fuente de contenido; los textos traducibles son
  `{es, en}`. `documents` define cada documento: tipo (`resume`/`cv`),
  secciones, orden de formación y habilidades, qué `coursework` muestra, si
  muestra el avance (`progress`) y si se publica. `educationMerge` funde una
  entrada en otra (su `mergedNote` va dentro de la de destino), y un ítem de
  habilidad con `only` sale solo en esos documentos. Las secciones vacías
  (`experience`, `projects`) y `linkedin` vacío no se renderizan.
- `build.mjs` rellena `src/template.html`. Imprime cada página en A4 y en
  Carta con una copia temporal que fija `@page size`. Después pisa `/Creator`
  y `/Producer` del PDF con texto del mismo largo.
- `scripts/check-ats.mjs`: extrae el texto de cada PDF (`pdftotext -layout`)
  y falla si falta algo de la página, si en el resume algo sale fuera de orden
  o si se pasa de hojas (resume 1, CV 4). Si falla por una línea larga cortada
  junto a una fecha a la derecha, se acorta el contenido, no se afloja la
  prueba.
- `src/styles.css`: Calibri 11pt (Carlito en la web). Resume con títulos a
  todo el ancho; CV con etiquetas a la izquierda y número de página. Debe
  funcionar a 402px sin scroll horizontal.
- `DESIGN.md` documenta el sistema visual; `PRODUCT.md`, el propósito y los
  lectores.

## Datos sensibles

- `fuentes/` (en `.gitignore`) guarda los documentos originales, con DNI,
  domicilio, teléfono y fecha de nacimiento. Nunca se suben ni se copian a
  `data/`, `docs/` o `local/`. Público: nombre, email, ciudad, LinkedIn,
  estudios, habilidades e idiomas. Por eso el contacto no lleva teléfono,
  aunque el Checklist de MIT lo pida.
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
  - `FCE/`: Statement of Results del Cambridge First Certificate;
  - `resumen.png`: captura del perfil de Techint Careers, de 2630×16384 px.
    Para leerla, recortarla por zonas con PowerShell `System.Drawing` en el
    scratchpad (no hay PIL).
- `G:\My Drive\ACADEMICO` (UCA, TUP, IPS): solo lectura.
- Ignorar por completo el CV de la clase de Inglés I
  (`TUP\2022 - 2024\C1\Ingles I\`): el puesto que figura ahí es inventado.
- Hechos fijados (no se re-preguntan):
  - UCA: desde 2026. El avance es el documentado, no el de Techint: 9 de 62
    asignaturas (el plan suma además 6 requisitos curriculares, que no
    cuentan como materias; de ellos están aprobados Complementos de
    Matemática e Inglés I).
  - TUP: desde 2024 (plan 2024).
  - Ingeniería Mecánica UTN (2024–2025): estudios previos.
  - Promedios: donde existen (TUP, UTN Mecánica, IPS), con escala /10.
  - Nombre legal: Valentino Tomas Gambino, sin tilde, como en el
    preanalítico de la UTN y el FCE.
  - Inglés: B2 según el FCE (dic. 2024). Italiano y portugués: básico.
    Español: nativo.
- Ningún dato se inventa: todo sale de `fuentes/` o de una confirmación
  explícita del usuario.

## Actualización semestral (15/03 y 15/09; recordatorio en Google Calendar)

1. Bajar el estado académico nuevo de la TUP y de la UCA a `fuentes/` y
   actualizar el perfil de Techint.
2. Editar `data/cv.json`: materias aprobadas, promedios, materias relevantes,
   habilidades, experiencia, proyectos.
3. `node build.mjs` (tiene que terminar en `check-ats: ok`).
4. Revisar las páginas a 402px y los PDF.
5. Commit, `git tag AAAA-S` y `git push --follow-tags`.

## Pendientes

- Proyectos: el usuario tiene que contar qué proyectos reales tiene (TUP, IPS,
  personales) para la sección de proyectos, con verbos de acción y PAR.
  Hasta entonces el resume sale sin esa sección. Las prácticas
  profesionalizantes del IPS entran si fueron trabajo real: las fuentes solo
  dicen "acreditado, noviembre 2020" (falta lugar, duración y tareas).
- Habilidades: con los proyectos cargados, sacar de Programación lo que no
  respalde ningún proyecto ni se pueda defender en una entrevista técnica.
- URLs: decidir si se pasa a un sitio de usuario (`/resume/` para los
  resumes, `/cv/` para el académico, la raíz para el portfolio). Antes,
  confirmar si ya se compartió algún link a `/cv/`.
- Teléfono: decidir si se genera un PDF privado con teléfono, fuera de
  `docs/` y `local/` (implica cambiar la regla de datos sensibles y la
  guardia).
- Cover letter, portfolio y other career writing: fuera del proyecto por
  ahora (reglas resumidas en `GUIA.md` §7).
- CV académico: el usuario lo revisa en local y decide si se publica.
- Criterios a revisar: orden de desempate entre fuentes de MIT (`GUIA.md` §0),
  PDF en A4 y Carta, habilidades sin niveles.
- Reemplazar en `fuentes/` la planilla del plan de la UCA por la versión
  actualizada (la de `fuentes/` es de dic. 2025 y no marca las materias
  aprobadas en 2026).
- Fecha de egreso esperado de UCA y TUP (MIT pide mes y año): hoy va "año –
  actualidad".
- Pasar la URL de LinkedIn y cargarla en `contact.linkedin`.
- El usuario tiene que corregir Techint para que coincida con el CV:
  - UCA: desde 2026, 9 de 62 materias (Techint dice 10 de 63).
  - TUP: desde 2024 (Techint dice 2022), 8 de 18 materias.
  - Sumar Ingeniería Mecánica UTN.
  - Inglés: B2 con el FCE (Techint dice "Avanzado").
- Cargar la experiencia laboral cuando exista.
