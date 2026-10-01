# Guía MIT CAPD

Reglas que siguen todos los documentos de este proyecto. Fuente: la sección
"Resumes, cover letters, portfolios, and CVs" de MIT Career Advising &
Professional Development, leída en la fuente el 2026-10-01:
<https://capd.mit.edu/channels/resumes/> y sus cinco pestañas (Resumes, CVs,
Cover letters, Portfolios, Other career writing).

Ante cualquier duda, se relee la página citada; no se resuelve de memoria.
Marcas: **[R]** regla explícita de MIT, **[S]** sugerencia, **[E]** sale de un
sample oficial, **[P]** decisión de este proyecto que se aparta de MIT o
completa un vacío.

## 0. Cómo se desempata

Cuando las fuentes de MIT se contradicen gana, en este orden:

1. la regla explícita vigente en la web de CAPD;
2. el sample oficial más reciente del mismo tipo de documento (resume: los de
   2025; CV: Sample CVs del Career Handbook);
3. el material viejo (Career Handbook 2019, samples de 2021).

Cada contradicción resuelta se anota en la sección 9. *(Criterio a revisar:
ver Pendientes en `CLAUDE.md`.)*

## 1. Resume vs CV

Fuente: <https://capd.mit.edu/resources/cvs/>.

- **[R]** CV: puestos académicos y de investigación (docencia, becas,
  fellowships, grants). Resume: industria y todo rol no académico.
- **[R]** Contexto internacional: "In some international settings, the term
  'CV' is used for all opportunities – however, you should tailor your
  document based on position type." El nombre cambia por país; el formato lo
  decide el tipo de puesto.
- Largo: resume 1 página; CV 2–4 páginas al inicio de la carrera ("length is
  not important", Handbook).
- **[S]** Tener un CV maestro completo y versiones adaptadas a cada
  oportunidad.

## 2. Resume: formato

Fuentes: Resume Checklist
(<https://cdn.uconnectlabs.com/wp-content/uploads/sites/123/2022/06/Resume-Checklist.pdf>),
Resume Guide
(<https://cdn.uconnectlabs.com/wp-content/uploads/sites/123/2021/06/Resume_Guide.pdf>),
<https://capd.mit.edu/resources/resumes/>.

- **[R]** 1 página (2 solo con posgrado o más de 10 años de experiencia).
- **[R]** Márgenes consistentes, entre 0,5" y 1".
- **[R]** Fuente de 10 a 12 pt, fácil de leer. Lista de MIT: Arial, Calibri,
  Cambria, Georgia, Helvetica, Times New Roman. Nada "colorful, fancy, or
  stylized".
- **[R]** Negrita e itálica con moderación (encabezados o puestos). Sin
  subrayado, sin color, sin gráficos.
- **[R]** Espacio en blanco suficiente. Fechas, formato y puntuación
  consistentes.
- **[R]** "Do not use a template; applicant tracking systems have trouble
  reading it." El objetivo es que un ATS lea el texto completo y en orden
  (ver sección 5).
- Papel: MIT da por sentado Carta (8½" × 11").

## 3. Resume: secciones

- **[R] Contacto:** nombre legal claro y en negrita arriba; teléfono; email
  profesional.
  - [E] Sample 2025 "UG Resume with Projects": una línea con teléfono · email ·
    LinkedIn · GitHub, sin dirección postal.
- **[R] Educación** (habitualmente primero):
  - nombre completo de la institución, sin siglas ("Massachusetts Institute of
    Technology, not MIT");
  - nombre oficial del título;
  - mes y año de egreso o de egreso esperado;
  - promedio si es bueno, siempre con escala;
  - materias alineadas con la búsqueda, pocas.
- **[R]** Secciones en orden de importancia para el empleador.
- **[R]** Nombres de sección descriptivos ("Research Experience", "Leadership
  & Service"), no genéricos ("Employment", "Other").
- **[R] Experiencia:** organización, puesto, ciudad y país, fechas; proyecto,
  actividad y resultado de cada experiencia.
- **[R] Habilidades:** todas las categorías relevantes (lenguajes de
  programación, idiomas, técnicas) y todas las habilidades relevantes de cada
  una.
  - [E] Formato "Categoría: a, b, c". El sample 2025 no usa niveles; el Global
    Resume 2025 pone niveles solo en idiomas ("English (native), French
    (fluent), German (basic)").
- **[R] Actividades/honores/liderazgo:** solo lo relevante.
- [E] Proyectos: "Título | tecnologías" con la fecha a la derecha y bullets.
  Orden del sample 2025: Education → Skills & Technical Tools → Experience →
  Projects.
- [E] Sin Summary en resumes de grado (solo los samples de PhD y egresados lo
  tienen).

## 4. Resume: redacción

Fuentes: Checklist, <https://capd.mit.edu/resources/resume-action-verbs/>,
<https://capd.mit.edu/resources/resumes-writing-about-your-skills/>.

- **[R]** Cada bullet empieza con un verbo de acción: pasado para lo
  terminado, presente para lo actual.
- **[R]** Fórmula PAR: proyecto, actividad, resultado. Logros, no tareas:
  nada de "Responsible for…" ni "Duties included".
- **[R]** Cuantificar: tamaño, escala, presupuesto, equipo, tiempo,
  resultado.
- **[R]** Sin "I" ni primera persona. Bullets, no párrafos. Voz activa.
- **[R]** Sin adjetivos autoelogiosos ("highly skilled", "excellent"). "Be
  honest and accurate, but not overly modest."
- **[R]** Keywords del sector y del aviso, sin abreviarlas.
- **[R]** No incluir: edad, estado civil, religión, salud, foto, afiliación
  política, salario, referencias ni "References available upon request",
  membresías no relacionadas, información repetida o desactualizada.
- **[R]** Adaptar el resume a cada tipo de puesto (*tailoring*).
- **[R]** Revisar varias veces y pedir que otro lo lea.
- IA (<https://capd.mit.edu/resources/ai-uses-for-resume-writing/>): sirve
  para comparar contra un aviso, chequear PAR y redundancias. No inventa
  contenido: todo dato sale de `fuentes/`.

## 5. ATS

Fuente: <https://capd.mit.edu/resources/make-your-resume-ats-friendly/>.

- **[R]** Sin gráficos, íconos, imágenes, tablas, cuadros de texto ni
  columnas: estructura lineal ("Boring is better").
- **[R]** Evitar Canva, LaTeX y armadores online.
- **[R]** No cortar keywords con guion de fin de línea. Evitar "various /
  multiple / several / etc.".
- **[R]** Prueba: guardar el resume como `.txt` y verificar que no falte texto
  y que el orden se conserve. En este proyecto la hace `scripts/check-ats.mjs`
  en cada build, con `pdftotext -layout` (lectura línea por línea, como la
  exportación a `.txt` de Word). [P] En el modo por defecto de `pdftotext`,
  una fecha alineada a la derecha junto a texto que ocupa varias líneas se lee
  como columna aparte; por eso las líneas con fecha a la derecha se mantienen
  cortas.
- [P] La regla de ATS es de la página de resumes: el CV, que sigue la columna
  de etiquetas de los Sample CVs, se controla solo por texto completo y largo,
  no por orden.

## 6. CV

Fuentes: <https://capd.mit.edu/resources/cvs/>, Sample CVs
(<https://cdn.uconnectlabs.com/wp-content/uploads/sites/123/2021/07/Sample-CVs-from-MIT-Career-Handbook.pdf>).

- Secciones: Name & Contact, Education, Research Experience,
  Fellowships/Grants/Awards/Honors, Teaching Experience, Mentoring Experience,
  Other Professional Experience, Presentations, Publications. Opcionales:
  Patents, Professional Associations, Leadership & Service, Languages, Skills.
  Solo se renderizan las que tienen contenido.
- **[S]** Orden estratégico: lo que va primero se destaca más.
- Educación en orden cronológico inverso. Idiomas con nivel ("proficient,
  fluent, or basic").
- Referencias al final del CV (en el resume no van).
- "There is no single correct format or style": consistencia, fuente legible,
  encabezados descriptivos, espacio en blanco.
- [E] Sample CVs: etiquetas de sección en una columna a la izquierda;
  institución y lugar en una línea, título y fecha en la siguiente; nombre y
  número de página ("2/4") arriba de cada página desde la segunda; número de
  página abajo en la primera.

## 7. Pendientes de aplicar (todavía fuera del proyecto)

Se usan cuando se incorporen; ver Pendientes en `CLAUDE.md`.

- **Cover letter**
  (<https://capd.mit.edu/resources/how-to-write-an-effective-cover-letter/>):
  - 1 página, 10–12 pt, dirigida a una persona con nombre ("Dear Hiring
    Manager" si no se sabe).
  - Intro con el propósito en la primera oración, 2–3 párrafos con ejemplos
    que complementan el resume sin repetirlo, cierre que reafirma el interés y
    agradece.
  - Si cambiás de campo, explicar el porqué.
  - La IA no escribe la carta; marcas a evitar: estructura formulaica, exceso
    de rayas, prosa sobrepulida.
- **Portfolio** (<https://capd.mit.edu/channels/portfolios/>,
  <https://mitcommlab.mit.edu/meche/commkit/portfolio/>):
  - 3–5 proyectos, portada con contacto e índice, una página por proyecto,
    2–6 visuales (~70 % de la página), mostrar el proceso, dejar claro el aporte
    individual.
  - PDF o sitio; GitHub Pages es la herramienta sugerida para trabajo técnico.
- **Other career writing**
  (<https://capd.mit.edu/resources/professional-correspondence-samples/>,
  <https://capd.mit.edu/resources/linkedin-2/>):
  - agradecimiento dentro de las 24 h, uno por entrevistador;
  - entrevista informativa: pedir 20–30 minutos y adjuntar el resume;
  - LinkedIn: headline con keywords, About en primera persona que complemente
    el resume, experiencia con logros, skills completas.

## 8. Decisiones del proyecto [P]

- **Papel:** cada documento sale en A4 y en Carta, y los dos tienen que entrar
  en el largo máximo. *(A revisar.)*
- **Tipografía:** Calibri en los dos documentos (en la web, Carlito como
  respaldo métrico). En resume y CV, cuerpo de 11 pt.
- **Títulos de sección:** resume a todo el ancho (regla de ATS + sample 2025);
  CV con columna izquierda (Sample CVs).
- **Habilidades:** lista por categoría sin niveles; idiomas con nivel entre
  paréntesis. *(A revisar.)*
- **Contacto:** sin teléfono ni dirección, aunque el Checklist pide teléfono:
  la web es pública y la política de datos de `CLAUDE.md` tiene prioridad.
- **Fechas:** en los estudios en curso va el egreso previsto ("Egreso
  previsto: 2030" / "Expected 2030"), por ahora sin mes.
- **Sin JS** en las páginas; la web muestra el mismo documento que el PDF.
- **Avance de carrera ("9 de 62 materias"):** solo en el CV académico. En los
  resumes no va: pone el foco en lo que falta, y MIT pide la fecha de egreso
  esperado, que la reemplaza cuando exista.
- **Ingeniería Mecánica UTN en los resumes:** fundida en la entrada de la UCA
  ("Incluye estudios previos…"), para que se lea como transferencia y no como
  abandono. En el CV académico, entrada propia.
- **Orden de formación por documento:** cada resume pone primero el título
  relevante para el puesto (Desarrollo: TUP primero), aunque no sea el más
  reciente ("sections listed in order of importance to the employer").
- **Materias relevantes:** pocas y sin repetir la misma materia en dos
  entradas del mismo resume.
- **CV académico:** sin "Áreas de interés" hasta tener intereses de
  investigación concretos; el FCE va también en Certificaciones.

## 9. Contradicciones resueltas

| Tema | Fuentes | Gana |
|---|---|---|
| Títulos de sección del resume | Samples viejos: columna izquierda. Página ATS: sin columnas. Sample 2025: a todo el ancho | Regla ATS + sample 2025 |
| Dirección en el contacto | Guide y samples viejos: sí. Sample 2025: no | Sample 2025 (y la política de datos) |
| Márgenes | "at least half-inch" (Resumes) vs 0,5"–1" (Checklist) | 0,5"–1" (compatible con las dos) |
| Largo del CV | 2–7 págs. (web) vs "length is not important" (Handbook) | Web; con contenido real, aunque sea menos |
