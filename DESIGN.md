---
name: CV Valentino Gambino
description: CV como hoja de plano técnico, apto para ATS, en web y PDF A4.
colors:
  teal-ink: "oklch(45% 0.085 200)"
  teal-wash: "oklch(94% 0.025 200)"
  graphite: "oklch(23% 0.012 240)"
  graphite-soft: "oklch(43% 0.014 240)"
  frame-line: "oklch(30% 0.012 240)"
  hairline: "oklch(84% 0.01 230)"
  sheet: "oklch(100% 0 0)"
  desk: "oklch(95.5% 0.006 230)"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 2.8vw, 2.875rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Barlow Semi Condensed, Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    letterSpacing: "0.09em"
  title:
    fontFamily: "Barlow Semi Condensed, Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Barlow Semi Condensed, Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  row: "0.875rem"
  gap: "1.5rem"
  section: "2.25rem"
  sheet: "clamp(1.25rem, 0.6rem + 3vw, 3rem)"
components:
  title-block-cell:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.875rem"
  revision-cell:
    backgroundColor: "{colors.teal-wash}"
    textColor: "{colors.teal-ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.875rem"
  text-link:
    textColor: "{colors.teal-ink}"
---

# Design System: CV Valentino Gambino

## Overview

**Creative North Star: "La hoja de plano"**

El CV se lee como una lámina de dibujo técnico. El marco es una línea fina
doble y el encabezado es un rótulo (title block, ISO 7200) con nombre,
contacto y número de revisión, en lugar del "hero" de currículum. Es denso
y sobrio. La jerarquía sale del peso tipográfico, de las líneas y de una
sola tinta de acento. Todo es texto real en una columna, así que lo que ve
un reclutador es lo mismo que lee un ATS.

La revisión semestral es parte del lenguaje visual: `Rev. AAAA-S` aparece en
el rótulo y en el pie, como en un plano.

**Key Characteristics:**
- Rótulo enmarcado con celdas etiquetadas; la celda de revisión va lavada en teal.
- Una columna, sin íconos, sin barras de nivel; los niveles se escriben en palabras.
- Barlow Semi Condensed para los títulos, Barlow para el texto y numerales tabulares.
- Esquinas rectas en todo.
- La versión impresa A4 es la misma hoja sin controles, en una página.

## Colors

Grafito sobre hoja blanca, con una única tinta teal. Estrategia restringida:
neutros más un acento.

### Primary
- **Tinta teal** (teal-ink): títulos de sección, links, número de revisión y anillo de foco. Es el único color con croma.
- **Lavado teal** (teal-wash): fondo de la celda de revisión y color de selección de texto.

### Neutral
- **Grafito** (graphite): el texto.
- **Grafito suave** (graphite-soft): instituciones, fechas, etiquetas del rótulo y niveles.
- **Línea de marco** (frame-line): marco de la hoja, bordes del rótulo y raya del pie.
- **Línea fina** (hairline): divisiones internas del rótulo y la raya que sigue a cada título de sección.
- **Hoja** (sheet) y **mesa** (desk): el papel y el fondo frío que lo rodea en pantalla.

**The One Ink Rule.** El teal solo marca la estructura (títulos, revisión,
links). Nunca va en bloques de texto ni en fondos grandes.

## Typography

**Display Font:** Barlow Semi Condensed (con Barlow y Segoe UI)
**Body Font:** Barlow (con Segoe UI y system-ui)

**Character:** Una grotesca de cartelería vial e industrial. La versión
semicondensada da la voz de rótulo de plano; la normal da legibilidad de
lectura.

### Hierarchy
- **Display** (700, clamp 2–2.875rem, 1): solo el nombre, dentro del rótulo.
- **Headline** (600, 0.9375rem, 0.09em, mayúsculas, teal): títulos de sección, seguidos de una línea fina hasta el borde.
- **Title** (600, 1.125rem, 1.25): carrera o puesto en cada entrada.
- **Body** (400, 1rem, 1.5, numerales tabulares): texto; el perfil limitado a 68ch.
- **Label** (600, 0.6875rem, 0.08em, mayúsculas, grafito suave): etiquetas de campo del rótulo.

**The Label Is A Field Rule.** Las etiquetas en mayúsculas pequeñas solo
nombran campos del rótulo. Nunca van como "eyebrow" arriba de un título.

## Layout

Una columna de hasta 50rem centrada sobre la mesa. El padding de la hoja es
fluido. El rótulo es una grilla de dos columnas (1.7fr / 1fr). Las entradas
llevan la fecha alineada a la derecha. Las herramientas son una grilla de
categoría (11rem) más contenido. Por debajo de 40rem, todo pasa a una
columna: el rótulo se apila y las fechas bajan debajo del título. Funciona
sin scroll horizontal a 360 y 402px. Los bordes usan
`env(safe-area-inset-*)`.

Impresión: A4 con márgenes de 13–15mm y raíz de 10.5pt. Los controles se
ocultan. Las entradas no se cortan entre páginas. Tiene que entrar en 1
página.

**The One Sheet Rule.** Si un cambio de contenido manda el PDF a una segunda
página, se ajusta primero el espaciado de impresión, no el texto.

## Elevation & Depth

Plana. No hay sombras. La profundidad sale de líneas: el marco doble
(borde + outline a 5px) separa la hoja de la mesa, y los bordes de 1px
arman el rótulo.

## Shapes

Esquinas rectas en todo (0). Formas rectangulares de lámina técnica: marcos,
celdas y rayas.

## Components

### Rótulo (signature)
Grilla enmarcada en línea de marco. A la izquierda va el nombre (Display) y
el subtítulo; cada rol del subtítulo queda sin cortes y las líneas solo se
parten en el separador "·". A la derecha van los campos etiquetados (email,
ubicación, LinkedIn si existe), separados por líneas finas. Abajo, la celda
de revisión con fondo lavado y el código en teal.

### Links
Teal con subrayado de 1px y offset de 0.2em. Al pasar el mouse, el
subrayado sube a 2px. El foco es un outline teal de 2px con offset de 3px.
En impresión van en grafito, sin subrayado.

### Controles (idioma / PDF)
Links de texto en Semi Condensed, mayúsculas y teal, alineados a la derecha
fuera de la hoja. Se ocultan al imprimir.

### Entrada (formación / experiencia)
Título más fecha a la derecha; abajo, la institución en grafito suave y la
nota de avance.

## Do's and Don'ts

### Do:
- **Do** escribir los niveles en palabras ("Intermedio: …"), agrupando los ítems del mismo nivel.
- **Do** mantener el número de revisión en el rótulo y en el pie.
- **Do** verificar que cada PDF tenga 1 página y que las páginas no tengan scroll horizontal a 402px después de cada cambio.

### Don't:
- **Don't** usar íconos, barras o anillos de nivel, ni una barra lateral (elección explícita del dueño por ATS).
- **Don't** redondear esquinas ni agregar sombras.
- **Don't** poner etiquetas tipo eyebrow arriba de los títulos de sección.
