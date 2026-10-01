---
name: Documentos de carrera de Valentino Gambino
description: Resume y CV según MIT CAPD, aptos para ATS, en web y PDF A4 y Carta.
colors:
  ink: "#111111"
  ink-soft: "#555555"
  paper: "#ffffff"
  surround: "#ececec"
  selection: "#dcdcdc"
typography:
  display:
    fontFamily: "Calibri, Carlito, sans-serif"
    fontSize: "16pt"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "Calibri, Carlito, sans-serif"
    fontSize: "11pt"
    fontWeight: 700
  body:
    fontFamily: "Calibri, Carlito, sans-serif"
    fontSize: "11pt"
    fontWeight: 400
    lineHeight: 1.25
rounded:
  none: "0"
spacing:
  page-margin: "0.75in"
  section: "9pt"
  entry: "5pt"
  cv-label-column: "1.35in"
components:
  text-link:
    textColor: "{colors.ink}"
---

# Sistema visual

Todo sale de `GUIA.md`; este archivo documenta cómo se aplicó. Si algo de
acá contradice la guía, gana la guía.

## Principio

Los documentos son los de MIT CAPD, sin interpretación propia: Calibri de 11pt,
negro sobre blanco, sin color, íconos, gráficos ni subrayado. La web muestra la
misma hoja que el PDF, sobre un fondo gris, con tres links arriba (idioma, PDF
A4, PDF Carta) y la fecha de actualización abajo. Ni los links ni la fecha
salen en el PDF.

## Resume (sample MIT 2025 "UG Resume with Projects")

- Nombre centrado en negrita, de 16pt. Debajo, una línea centrada: ciudad ·
  email · LinkedIn (si existe).
- Títulos de sección a todo el ancho, en mayúsculas y negrita, con una regla de
  1px debajo. Sin columnas: es la regla de ATS de MIT.
- Entrada: "**Institución** | Lugar" con la fecha en cursiva a la derecha;
  debajo, el título en cursiva; después, avance, detalle y promedio en una
  línea, y "**Materias relevantes:** …".
- Habilidades: una línea por categoría, "**Categoría:** a, b, c", con sangría
  francesa. La última línea es "**Idiomas:**", con el nivel entre paréntesis.
- Orden de secciones: Educación, Experiencia, Proyectos, Habilidades técnicas
  e idiomas. Las vacías no aparecen.

## CV (Sample CVs del Career Handbook)

- Mismo encabezado que el resume.
- Etiqueta de sección en negrita en una columna de 1.35in a la izquierda; el
  contenido a la derecha. En móvil la etiqueta pasa arriba.
- Entrada: institución en negrita con el lugar a la derecha; título en cursiva
  con la fecha a la derecha.
- Impresión: número de página "1/N" abajo en la primera hoja; desde la
  segunda, nombre arriba a la izquierda y "n/N" arriba a la derecha.

## Medidas

- Cuerpo 11pt en pantalla y en PDF. MIT pide entre 10 y 12pt: nunca bajar
  de 10.
- Márgenes de 0.75in en A4 y en Carta (MIT: entre 0.5 y 1in).
- La fecha a la derecha nunca se corta ni baja de línea; si el texto de la
  izquierda es largo, se corta él. Si eso hace que la prueba ATS falle, se
  acorta el texto.
- Por debajo de 40rem la hoja pierde la sombra y usa 16px de margen lateral
  con `env(safe-area-inset-*)`. Tiene que entrar a 402px sin scroll
  horizontal.

## No hacer

- Color, íconos, barras de nivel, foto, tablas o columnas en el resume.
- Negrita fuera del nombre, los títulos, las instituciones y los rótulos de
  línea.
- Subrayado dentro del documento (los links lo muestran solo al pasar el
  mouse).
- Corte de palabras con guion (`hyphens: manual`).
