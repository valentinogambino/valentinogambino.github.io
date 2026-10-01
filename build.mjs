// Genera el CV en formato MIT (CAPD): data/cv.json + src/ -> docs/ (4 HTML + 4 PDF).
//   node build.mjs           HTML + PDF
//   node build.mjs --no-pdf  solo HTML (más rápido mientras se edita)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkSensible } from './scripts/check-sensible.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'docs');
const LANGS = ['es', 'en'];
const LEVEL_ORDER = ['advanced', 'intermediate', 'basic'];
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

function updated(lang, L) {
  const month = L.months[now.getMonth()];
  return `${L.updated}: ${month} ${lang === 'es' ? 'de ' : ''}${now.getFullYear()}`;
}

const period = (start, end, L) => `${start} – ${end ?? L.present}`;
const decimal = (n, lang) => n.toFixed(2).replace('.', lang === 'es' ? ',' : '.');

function header(lang) {
  const c = cv.contact;
  const parts = [esc(t(c.location, lang)), `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`];
  if (c.linkedin) {
    const shown = c.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    parts.push(`<a href="${esc(c.linkedin)}">${esc(shown)}</a>`);
  }
  return `<header class="cv-head">
  <h1>${esc(cv.name)}</h1>
  <p class="contact">${parts.join('<span class="sep" aria-hidden="true"> • </span>')}</p>
</header>`;
}

// Una entrada al estilo MIT: institución + lugar, título + fechas, y líneas de detalle.
function entry({ org, place, title, when, lines }) {
  return `  <article class="entry">
    <p class="org">${esc(org)}</p>
    <p class="place">${esc(place)}</p>
    <p class="title">${esc(title)}</p>
    <p class="when">${esc(when)}</p>
${lines.filter(Boolean).map((l) => `    <p class="line">${l}</p>`).join('\n')}
  </article>`;
}

const sections = {
  education: (variantKey, lang, L) => cv.variants[variantKey].educationOrder.map((key) => {
    const e = cv.education[key];
    const facts = [
      e.progress && L.progress.replace('{approved}', e.progress.approved).replace('{total}', e.progress.total),
      t(e.detail, lang),
      e.gpa != null && L.gpa.replace('{gpa}', decimal(e.gpa, lang)),
    ].filter(Boolean).map(esc).join(' ');
    const courses = e.coursework?.[variantKey]?.[lang] ?? [];
    return entry({
      org: t(e.institution, lang),
      place: t(e.location, lang),
      title: t(e.degree, lang),
      when: period(e.start, e.end, L),
      lines: [
        facts,
        courses.length && `<span class="lead">${esc(L.coursework)}:</span> ${courses.map(esc).join(', ')}.`,
      ],
    });
  }).join('\n'),

  experience: (variantKey, lang, L) => {
    if (!cv.experience.length) return null;
    return cv.experience.map((x) => entry({
      org: t(x.org, lang),
      place: t(x.location, lang) ?? '',
      title: t(x.role, lang),
      when: period(x.start, x.end, L),
      lines: (t(x.bullets, lang) ?? []).map((b) => `• ${esc(b)}`),
    })).join('\n');
  },

  // Una línea por categoría, con la redacción de los ejemplos de MIT ("proficient in…; familiar with…").
  skills: (variantKey, lang, L) => {
    const lines = cv.variants[variantKey].skillOrder.map((key) => {
      const group = cv.skills[key];
      const clauses = LEVEL_ORDER.map((level) => {
        const names = group.items.filter((i) => i.level === level).map((i) => esc(t(i.name, lang)));
        return names.length ? `${L.levels[level]} ${names.join(', ')}` : '';
      }).filter(Boolean);
      clauses.push(...group.items.filter((i) => !i.level).map((i) => esc(t(i.name, lang))));
      return `<span class="lead">${esc(t(group.label, lang))}:</span> ${clauses.join('; ')}.`;
    });
    lines.push(`<span class="lead">${esc(L.languages)}:</span> ${esc(t(cv.languages, lang))}.`);
    lines.push(`<span class="lead">${esc(L.interests)}:</span> ${esc(t(cv.interests, lang))}.`);
    return `<div class="skill-lines">
${lines.map((l) => `  <p>${l}</p>`).join('\n')}
</div>`;
  },
};

function render(variantKey, lang) {
  const variant = cv.variants[variantKey];
  const L = cv.labels[lang];
  const other = lang === 'es' ? 'en' : 'es';
  const path = variant.path + (lang === 'en' ? 'en/' : '');
  const depth = path.split('/').filter(Boolean).length;
  const root = '../'.repeat(depth);
  const otherPath = variant.path + (other === 'en' ? 'en/' : '');

  const body = [
    header(lang),
    ...variant.sections.map((name) => {
      const html = sections[name](variantKey, lang, L);
      return html && `<section class="cv-section ${name}" aria-labelledby="h-${name}">
<h2 id="h-${name}">${esc(L[name])}</h2>
<div class="cv-body">
${html}
</div>
</section>`;
    }).filter(Boolean),
    `<footer class="cv-foot">${esc(updated(lang, L))}</footer>`,
  ].join('\n');

  const vars = {
    lang,
    otherLang: other,
    title: `CV — ${cv.name}${L.titleSuffix[variantKey]}`,
    description: `CV — ${cv.name}`,
    canonical: cv.siteUrl + path,
    otherCanonical: cv.siteUrl + otherPath,
    root,
    controlsLabel: L.controls,
    otherLangHref: lang === 'es' ? 'en/' : '../',
    otherLangLabel: L.otherLang,
    pdfHref: `${root}${variant.pdf}-${lang}.pdf`,
    downloadPdf: L.downloadPdf,
    body,
  };
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, k) => (k === 'body' ? vars.body : esc(vars[k])));
  const file = join(OUT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return { file, pdf: join(OUT, `${variant.pdf}-${lang}.pdf`) };
}

function printPdf(htmlFile, pdfFile) {
  const edge = EDGE_PATHS.find(existsSync);
  if (!edge) throw new Error('No encontré Microsoft Edge para generar los PDF.');
  rmSync(pdfFile, { force: true });
  execFileSync(edge, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=8000',
    `--print-to-pdf=${pdfFile}`,
    pathToFileURL(htmlFile).href,
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

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
copyFileSync(join(ROOT, 'src/styles.css'), join(OUT, 'styles.css'));
writeFileSync(join(OUT, '.nojekyll'), '');

const outputs = [];
for (const variantKey of Object.keys(cv.variants)) {
  for (const lang of LANGS) outputs.push(render(variantKey, lang));
}
console.log(`HTML: ${outputs.length} páginas`);

// La guardia corre sobre los HTML antes de imprimir: los PDF salen de esos mismos
// HTML (y comprimidos no se pueden revisar con regex). Si falla, docs/ se borra
// para que nada sensible quede en la carpeta que se publica.
const problems = checkSensible();
if (problems.length) {
  rmSync(OUT, { recursive: true, force: true });
  console.error('Datos sensibles detectados (docs/ borrado):\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('check-sensible: ok');

if (!process.argv.includes('--no-pdf')) {
  for (const { file, pdf } of outputs) printPdf(file, pdf);
  console.log(`PDF: ${outputs.length} archivos`);
}
