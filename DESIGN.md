---
name: CV Valentino Gambino
description: CV en formato MIT (CAPD), apto para ATS, en web y PDF A4 de una página.
colors:
  ink: "#111111"
  ink-soft: "#444444"
  rule: "#111111"
  paper: "#ffffff"
  selection: "#e4e4e4"
typography:
  display:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "1.7rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
    fontFeature: "smcp"
  headline:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "1rem"
    fontWeight: 700
  body:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.38
  label:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
rounded:
  none: "0"
spacing:
  entry: "0.7rem"
  section: "1rem"
  label-column: "7.25rem"
  column-gap: "1.25rem"
components:
  text-link:
    textColor: "{colors.ink}"
---

# Design System: CV Valentino Gambino

## Overview

**Creative North Star: "El CV de MIT"**

El CV sigue el formato que recomienda MIT Career Advising & Professional
Development (CAPD) y sus CV de ejemplo:

- serif conservadora entre 10 y 12pt;
- márgenes uniformes;
- una página;
- negrita solo en datos clave;
- títulos de sección en una columna angosta a la izquierda;
- institución y lugar en una línea, título y fechas en la siguiente.

No hay color ni ornamentos: la autoridad sale de lo convencional. Todo el
texto es real y está en el orden de lectura, así que un ATS lo lee tal
cual.

**Key Characteristics:**
- Nombre centrado en versalitas, línea de contacto centrada y una regla negra debajo.
- Etiquetas de sección a la izquierda, contenido a la derecha; en móvil la etiqueta pasa arriba.
- Institución en negrita y título en cursiva; lugar y fechas alineados a la derecha.
- Habilidades en una línea por categoría, con niveles escritos al estilo MIT ("proficient in…; familiar with…").
- La impresión A4 es la misma página, en 11pt y con márgenes de 19mm.

## Colors

Tinta negra sobre papel blanco, sin acento.

### Neutral
- **Tinta** (ink): todo el texto y las reglas.
- **Tinta suave** (ink-soft): solo la fecha de actualización y, en móvil, el lugar y las fechas.
- **Papel** (paper): el fondo, tanto en pantalla como impreso.
- **Selección** (selection): gris claro para el texto seleccionado.

**The No Color Rule.** MIT recomienda un CV conservador: nada de color, ni
siquiera en los links, que van en tinta y subrayados.

## Typography

**Body Font:** Tinos (métricamente compatible con Times New Roman), con Times New Roman de respaldo.

**Character:** Es la serif de documento formal por excelencia. Un solo tipo
para todo; la jerarquía sale de la negrita, la cursiva y las versalitas.

### Hierarchy
- **Display** (700, 1.7rem, versalitas): solo el nombre.
- **Headline** (700, 1rem): etiquetas de sección ("Formación", "Habilidades e intereses").
- **Body** (400, 1rem, 1.38): todo el contenido. En el PDF, 11pt.
- **Label** (400, 0.9375rem): la línea de contacto.

**The Bold Sparingly Rule.** La negrita queda reservada para el nombre, las
etiquetas de sección, las instituciones y los rótulos de línea
("CAD/CAM:", "Materias relevantes:"). Esa es la regla textual de MIT.

## Layout

Una columna de 50rem centrada. Cada sección es una grilla con la etiqueta en
7.25rem y el contenido al lado, con 1.25rem de separación. Cada entrada es
una grilla de dos columnas: a la izquierda, institución y título; a la
derecha, lugar y fechas. Las líneas de detalle ocupan el ancho completo.
Las líneas de habilidades usan sangría francesa de 1em.

Por debajo de 40rem, la etiqueta pasa arriba con una regla; el lugar y las
fechas bajan en gris, en este orden: institución, lugar, título, fechas,
detalle. La línea de contacto se apila. No hay scroll horizontal a 360 ni a
402px, y los bordes usan `env(safe-area-inset-*)`.

**The One Page Rule.** Los 4 PDF tienen que entrar en una página A4. Si el
contenido crece, primero se ajusta el espaciado de impresión. El tamaño de
letra nunca baja de 10pt (mínimo de MIT).

## Elevation & Depth

Plana. No hay sombras ni fondos: solo una regla negra de 1px bajo el
encabezado y, en móvil, bajo cada etiqueta.

## Shapes

Sin formas: no hay cajas, tarjetas ni bordes redondeados. Es tipografía
sobre papel.

## Components

### Encabezado
El nombre va centrado en versalitas negrita. Debajo, una línea centrada con
ciudad • email • LinkedIn (si existe), y luego la regla negra a ancho
completo.

### Entrada (formación / experiencia)
Primera línea: institución en negrita, con el lugar a la derecha. Segunda
línea: título en cursiva, con las fechas a la derecha. Después, el avance,
la nota y el promedio en una línea, y "Materias relevantes:" con el rótulo
en negrita.

### Links y controles
En tinta, subrayados con 1px y offset de 0.18em; al pasar el mouse, 2px.
El foco es un outline negro de 2px. Los controles "English · Descargar PDF"
van arriba a la derecha y se ocultan al imprimir.

## Do's and Don'ts

### Do:
- **Do** mantener una serif conservadora entre 10 y 12pt en el PDF (11pt hoy).
- **Do** listar la formación en orden cronológico inverso, con una línea de "Materias relevantes" por carrera.
- **Do** escribir los niveles con la redacción MIT: "manejo intermedio de…; conocimientos básicos de…" / "proficient in…; familiar with…".

### Don't:
- **Don't** agregar color, íconos, barras de nivel, foto ni una barra lateral.
- **Don't** incluir datos personales (edad, documento, estado civil) ni "referencias a pedido". Es regla de MIT y de este proyecto.
- **Don't** usar negrita fuera de los casos de la regla de arriba.
