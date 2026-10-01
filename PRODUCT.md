# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML + CSS, no framework and no client-side JS. A dependency-free Node 24
script (`build.mjs`) renders `data/cv.json` into `docs/`; PDFs are printed
locally with Edge headless. Hosted on GitHub Pages (`main` + `/docs`) at
`valentinogambino.github.io/cv`. Astro and Next.js were considered and rejected.

## Users

- Recruiters and HR screeners at industrial and technology companies in Argentina
  (e.g. Techint) who open a shared link or download the PDF, scanning for
  degree, progress, tools and languages in under a minute.
- Applicant tracking systems that parse the PDF.
- The owner, Valentino Gambino, who updates it every six months.

## Product Purpose

A personal CV in Spanish and English, in two variants from one data file:
**Ingeniería** (main, at `/cv/`) and **Desarrollo** (shared by link at
`/cv/dev/`). Success: a reader immediately sees who he is and what he can do,
the PDF parses cleanly, and a semester update means editing one JSON file
plus running one command.

## Positioning

A mechanical technician studying industrial engineering and programming at the
same time: hands-on manufacturing (CAD/CAM, CNC, machining) plus real software
skills. Neither a pure engineering nor a pure developer CV.

## Capabilities and Constraints

- Sections: profile, experience (hidden while empty), education with
  courses-passed progress, tools by category with levels in words, languages,
  areas of interest. No projects section for now.
- One column, selectable text, no icons, no skill bars (ATS-safe).
- Must work at 402px CSS width without horizontal scroll; print to A4 in 1–2
  pages, controls hidden in print.
- Language switch and PDF download are plain links.
- Indexable by search engines.

## Brand Commitments

None beyond the name "Valentino Gambino".

## Evidence on Hand

All content lives in `data/cv.json`, sourced from documents in `fuentes/`
(gitignored). No work experience, testimonials, projects, certifications or
photo exist; do not fabricate any.

## Product Principles

1. Truth over polish: every claim traces to a source document or an explicit
   confirmation from the owner.
2. Machine-readable first: what an ATS reads must equal what a human sees.
3. Maintenance in minutes: content changes never require touching markup or
   styles.
4. Public by design, private by default: only name, email, city, LinkedIn,
   studies and skills are ever published.

## Accessibility & Inclusion

Semantic HTML with a sensible heading order, sufficient contrast, readable on
phones, and printable.
