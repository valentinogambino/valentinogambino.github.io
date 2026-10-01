// Genera los documentos de data/cv.json según GUIA.md (MIT CAPD).
//   Resume (ing, dev): docs/  -> GitHub Pages
//   CV académico:      local/ -> solo en esta compu, no se publica
// Cada documento sale en ES y EN, en HTML y en PDF A4 y Carta.
//   node build.mjs           HTML + PDF + test ATS
//   node build.mjs --no-pdf  solo HTML (más rápido mientras se edita)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync, mkdtempSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkSensible } from './scripts/check-sensible.mjs';
import { checkAts, documentText } from './scripts/check-ats.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = { publish: join(ROOT, 'docs'), local: join(ROOT, 'local') };
const LANGS = ['es', 'en'];
const PAPERS = { a4: 'A4', letter: 'letter' };
const MAX_PAGES = { resume: 1, cv: 4 };
const EDGE_PATHS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const cv = JSON.parse(readFileSync(join(ROOT, 'data/cv.json'), 'utf8'));
const template = readFileSync(join(ROOT, 'src/template.html'), 'utf8');

const esc = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const t = (v, lang) => (v && typeof v === 'object' ? v[lang] : v);
const now = new Date();

const period = (start, end, L) => `${start} – ${end ?? L.present}`;
const decimal = (n, lang) => n.toFixed(2).replace('.', lang === 'es' ? ',' : '.');
const sentence = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

function header(lang) {
  const c = cv.contact;
  const parts = [esc(t(c.location, lang)), `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`];
  if (c.linkedin) {
    const shown = c.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    parts.push(`<a href="${esc(c.linkedin)}">${esc(shown)}</a>`);
  }
  return `<header class="doc-head">
  <h1>${esc(cv.name)}</h1>
  <p class="contact">${parts.join('<span class="sep" aria-hidden="true"> · </span>')}</p>
</header>`;
}

// Resume (sample MIT 2025): "Institución | Lugar" con la fecha a la derecha, título debajo.
// CV (Sample CVs de MIT): institución y lugar en una línea, título y fecha en la siguiente.
function entry(kind, { org, place, title, when, lines = [], bullets = [] }) {
  const rows = kind === 'resume'
    ? [`<p class="row"><span><b>${esc(org)}</b>${place ? ` | ${esc(place)}` : ''}</span><span class="when">${esc(when)}</span></p>`,
       title && `<p><i>${esc(title)}</i></p>`]
    : [`<p class="row"><b>${esc(org)}</b><span class="when">${esc(place ?? '')}</span></p>`,
       `<p class="row"><i>${esc(title ?? '')}</i><span class="when">${esc(when)}</span></p>`];
  return `<article class="entry">
${[...rows, ...lines.map((l) => `<p>${l}</p>`)].filter(Boolean).join('\n')}${bullets.length
    ? `\n<ul>\n${bullets.map((b) => `<li>${esc(b)}</li>`).join('\n')}\n</ul>` : ''}
</article>`;
}

function coursework(e, key, lang) {
  if (key !== 'all') return e.coursework?.[key]?.[lang] ?? [];
  return [...new Set(Object.values(e.coursework ?? {}).flatMap((c) => c[lang] ?? []))];
}

const languagesLine = (lang) =>
  cv.languages.map((l) => `${t(l.name, lang)} (${t(l.level, lang)})`).join(', ');

const sections = {
  education: (doc, lang, L) => doc.educationOrder.map((key) => {
    const e = cv.education[key];
    const facts = [
      e.progress && L.progress.replace('{approved}', e.progress.approved).replace('{total}', e.progress.total),
      t(e.detail, lang),
      e.gpa != null && L.gpa.replace('{gpa}', decimal(e.gpa, lang)),
    ].filter(Boolean).map(sentence).map(esc).join(' ');
    const courses = coursework(e, doc.coursework, lang);
    const label = doc.coursework === 'all' ? L.courseworkAll : L.coursework;
    return entry(doc.kind, {
      org: t(e.institution, lang),
      place: t(e.location, lang),
      title: t(e.degree, lang),
      when: period(e.start, e.end, L),
      lines: [
        facts,
        courses.length && `<b>${esc(label)}:</b> ${courses.map(esc).join(', ')}`,
      ].filter(Boolean),
    });
  }).join('\n'),

  experience: (doc, lang, L) => cv.experience.map((x) => entry(doc.kind, {
    org: t(x.org, lang),
    place: t(x.location, lang),
    title: t(x.role, lang),
    when: period(x.start, x.end, L),
    bullets: t(x.bullets, lang) ?? [],
  })).join('\n'),

  // Sample MIT 2025: "Título | tecnologías" con la fecha a la derecha.
  projects: (doc, lang, L) => cv.projects.map((p) => entry(doc.kind, {
    org: t(p.title, lang),
    place: (p.tools ?? []).map((x) => t(x, lang)).join(', '),
    when: p.end ? period(p.start, p.end, L) : p.start,
    bullets: t(p.bullets, lang) ?? [],
  })).join('\n'),

  // Una línea por categoría, sin niveles; en el resume los idiomas cierran la sección.
  skills: (doc, lang, L) => {
    const lines = doc.skillOrder.map((key) => {
      const g = cv.skills[key];
      return `<b>${esc(t(g.label, lang))}:</b> ${g.items.map((i) => esc(t(i, lang))).join(', ')}`;
    });
    if (doc.kind === 'resume') lines.push(`<b>${esc(L.languages)}:</b> ${esc(languagesLine(lang))}`);
    return lines.map((l) => `<p class="hang">${l}</p>`).join('\n');
  },

  languages: (doc, lang) => `<p>${esc(languagesLine(lang))}</p>`,

  interests: (doc, lang) => `<p>${esc(t(cv.interests, lang).join(', '))}</p>`,
};

function render(key, lang) {
  const doc = cv.documents[key];
  const L = cv.labels[lang];
  const other = lang === 'es' ? 'en' : 'es';
  const outRoot = doc.publish ? OUT.publish : OUT.local;
  const path = doc.path + (lang === 'en' ? 'en/' : '');
  const root = '../'.repeat(path.split('/').filter(Boolean).length);
  const file = (paper) => `${doc.file[lang]}-${paper}.pdf`;

  const body = [
    header(lang),
    ...doc.sections.map((name) => {
      const html = sections[name](doc, lang, L);
      return html && `<section class="sec" aria-labelledby="h-${name}">
<h2 id="h-${name}">${esc(L.headings[doc.kind][name])}</h2>
<div class="sec-body">
${html}
</div>
</section>`;
    }).filter(Boolean),
  ].join('\n');

  const meta = [];
  if (!doc.index) meta.push('<meta name="robots" content="noindex">');
  if (doc.publish) {
    const url = (l) => cv.siteUrl + doc.path + (l === 'en' ? 'en/' : '');
    meta.push(`<link rel="canonical" href="${esc(url(lang))}">`,
      `<link rel="alternate" hreflang="${lang}" href="${esc(url(lang))}">`,
      `<link rel="alternate" hreflang="${other}" href="${esc(url(other))}">`);
  }
  // El CV lleva nombre y número de página desde la segunda hoja, como los Sample CVs.
  if (doc.kind === 'cv') {
    const name = cv.name.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    meta.push(`<style>
@page { @top-left { content: "${name}"; } @top-right { content: counter(page) "/" counter(pages); } }
@page :first { @top-left { content: none; } @top-right { content: none; } @bottom-center { content: counter(page) "/" counter(pages); } }
</style>`);
  }

  const controls = [
    `<a href="${lang === 'es' ? 'en/' : '../'}" hreflang="${other}" lang="${other}">${esc(L.otherLang)}</a>`,
    `<a href="${root}${file('a4')}" download>${esc(L.pdfA4)}</a>`,
    `<a href="${root}${file('letter')}" download>${esc(L.pdfLetter)}</a>`,
  ].join('\n');

  const vars = {
    lang,
    title: `${cv.name} — ${L.kind[doc.kind]}${L.variant[key]}`,
    meta: meta.join('\n'),
    root,
    controlsLabel: L.controls,
    controls,
    kind: doc.kind,
    updated: `${L.updated}: ${L.months[now.getMonth()]} ${lang === 'es' ? 'de ' : ''}${now.getFullYear()}`,
    body,
  };
  const raw = new Set(['meta', 'controls', 'body']);
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, k) => (raw.has(k) ? vars[k] : esc(vars[k])));
  const out = join(outRoot, path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  return {
    key, lang, kind: doc.kind, html: out,
    text: documentText(body),
    pdfs: Object.keys(PAPERS).map((paper) => ({ paper, file: join(outRoot, file(paper)) })),
  };
}

// Edge imprime una copia temporal de la página con el tamaño de hoja fijado;
// <base> hace que la hoja de estilos se resuelva igual que en la página real.
function printPdf(htmlFile, paper, pdfFile, tmp) {
  const edge = EDGE_PATHS.find(existsSync);
  if (!edge) throw new Error('No encontré Microsoft Edge para generar los PDF.');
  const page = readFileSync(htmlFile, 'utf8').replace('<head>',
    `<head>\n<base href="${pathToFileURL(dirname(htmlFile)).href}/">`)
    .replace('</head>', `<style>@page { size: ${PAPERS[paper]}; }</style>\n</head>`);
  const tmpHtml = join(tmp, `${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(tmpHtml, page);
  rmSync(pdfFile, { force: true });
  execFileSync(edge, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=8000',
    `--print-to-pdf=${pdfFile}`,
    pathToFileURL(tmpHtml).href,
  ], { stdio: 'ignore' });
  if (!existsSync(pdfFile)) throw new Error(`Edge no generó ${pdfFile}`);
  scrubPdfInfo(pdfFile);
}

// Edge escribe su user-agent (SO y versión) en /Creator y /Producer. Se pisan con
// texto del mismo largo para no correr los offsets de la tabla xref del PDF.
function scrubPdfInfo(pdfFile) {
  const pdf = readFileSync(pdfFile).toString('latin1');
  const clean = pdf.replace(/\/(Creator|Producer) \(((?:\\.|[^\\)])*)\)/g, (_, key, inner) =>
    inner.length < 2 ? `/${key} (${' '.repeat(inner.length)})` : `/${key} (${'CV'.padEnd(inner.length, ' ')})`);
  writeFileSync(pdfFile, Buffer.from(clean, 'latin1'));
}

for (const dir of Object.values(OUT)) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(ROOT, 'src/styles.css'), join(dir, 'styles.css'));
}
writeFileSync(join(OUT.publish, '.nojekyll'), '');

const pages = [];
for (const key of Object.keys(cv.documents)) {
  for (const lang of LANGS) pages.push(render(key, lang));
}
console.log(`HTML: ${pages.length} páginas`);

// La guardia corre sobre los HTML antes de imprimir: los PDF salen de esos mismos
// HTML (y comprimidos no se pueden revisar con regex). Si falla, se borran docs/ y
// local/ para que nada sensible quede en una carpeta que se publica o se comparte.
const problems = checkSensible();
if (problems.length) {
  for (const dir of Object.values(OUT)) rmSync(dir, { recursive: true, force: true });
  console.error('Datos sensibles detectados (docs/ y local/ borrados):\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('check-sensible: ok');

if (!process.argv.includes('--no-pdf')) {
  const tmp = mkdtempSync(join(tmpdir(), 'cv-build-'));
  const failures = [];
  try {
    for (const p of pages) {
      for (const { paper, file } of p.pdfs) {
        printPdf(p.html, paper, file, tmp);
        failures.push(...checkAts(file, p.text, MAX_PAGES[p.kind], { order: p.kind === 'resume' }).map((f) => `${relative(ROOT, file)}: ${f}`));
      }
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`PDF: ${pages.length * Object.keys(PAPERS).length} archivos`);
  if (failures.length) {
    console.error('check-ats falló:\n  ' + failures.join('\n  '));
    process.exit(1);
  }
  console.log('check-ats: ok');
}
