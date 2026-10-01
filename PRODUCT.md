# Product

## Platform

web + PDF

## Stack

HTML y CSS estáticos, sin framework y sin JS en la página. `build.mjs` (Node 24,
sin dependencias) convierte `data/cv.json` en `docs/` (público, GitHub Pages en
`valentinogambino.github.io/resume/`) y `local/` (privado). Los PDF los imprime Edge
headless en A4 y en Carta; la prueba ATS usa `pdftotext`.

## Users

- Reclutadores y RR. HH. de empresas industriales y de tecnología en Argentina
  (ej. Techint): abren un link o bajan el PDF y buscan en menos de un minuto
  carrera, avance, materias, herramientas e idiomas.
- Sistemas ATS que leen el PDF.
- Más adelante, lectores académicos (ayudantías, becas, intercambio, posgrado),
  con el CV.
- El dueño, que actualiza todo cada seis meses.

## Product Purpose

Documentos de carrera según las guías de MIT CAPD (`GUIA.md`): un resume de una
página, orientado por tipo de puesto (Ingeniería y Desarrollo), y un CV
académico maestro, en español e inglés, desde un solo archivo de datos.

Éxito:
- el lector ve enseguida qué estudia, cuánto avanzó y qué herramientas usa;
- el PDF pasa la prueba ATS;
- actualizar es editar un JSON y correr un comando.

## Positioning

Técnico mecánico que estudia en paralelo Ingeniería Industrial y la Tecnicatura
en Programación: fabricación (CAD/CAM, CNC, mecanizado) y software real. La
versión Ingeniería y la de Desarrollo cambian qué materias y habilidades
aparecen primero.

## Evidence on Hand

Todo el contenido de `data/cv.json` sale de `fuentes/` (gitignored): analítico
del IPS, plan de la UCA con equivalencias, estado académico de la TUP,
preanalítico de UTN Ingeniería Mecánica, Statement of Results del FCE y la
captura del perfil de Techint. No hay experiencia laboral, proyectos
documentados, premios ni otras certificaciones: no se inventan.

## Product Principles

1. Las reglas de MIT antes que el gusto propio; cuando MIT se contradice,
   decide `GUIA.md` §0.
2. Verdad antes que pulido: cada dato sale de un documento o de una
   confirmación del dueño.
3. Lo que lee el ATS es lo que ve la persona, y una prueba lo verifica en cada
   build.
4. Público por diseño, privado por defecto: solo nombre, email, ciudad,
   LinkedIn, estudios, habilidades e idiomas.

## Accessibility & Inclusion

HTML semántico con jerarquía de títulos correcta, contraste alto, legible en
celulares (402px sin scroll horizontal) e imprimible.
