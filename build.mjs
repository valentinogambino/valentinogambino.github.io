// Genera el CV: data/cv.json + src/ -> docs/ (4 HTML + 4 PDF).
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
const LEVEL_ORDER = ['advanced', 'intermediate', 'basic', null];
const EDGE_PATHS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const cv = JSON.parse(readFileSync(join(ROOT, 'data/cv.json'), 'utf8'));
const template = readFileSync(join(ROOT, 'src/template.html'), 'utf8');

const esc = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const t = (v, lang) => (v && typeof v === 'object' ? v[lang] : v);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Revisión semestral: ene–jun = 1, jul–dic = 2. Coincide con el tag de git.
const now = new Date();
const revision = `${now.getFullYear()}-${now.getMonth() < 6 ? 1 : 2}`;

function updated(L) {
  const month = L.months[now.getMonth()];
  return `${L.updated}: ${month} ${L === cv.labels.es ? 'de ' : ''}${now.getFullYear()}`;
}

function period(start, end, L) {
  return `${start} – ${end ?? L.present}`;
}

function titleBlock(variant, lang, L) {
  const c = cv.contact;
  const fields = [
    [L.email, `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`],
    [L.location, esc(t(c.location, lang))],
  ];
  if (c.linkedin) {
    const shown = c.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    fields.push([L.linkedin, `<a href="${esc(c.linkedin)}">${esc(shown)}</a>`]);
  }
  return `<header class="title-block">
  <div class="tb-name">
    <h1>${esc(cv.name)}</h1>
    <p class="headline">${t(variant.headline, lang).split(' · ').map((r) => `<span>${esc(r)}</span>`).join(' · ')}</p>
  </div>
  <dl class="tb-fields">
${fields.map(([k, v]) => `    <div><dt class="tb-label">${esc(k)}</dt><dd>${v}</dd></div>`).join('\n')}
    <div class="tb-rev"><dt class="tb-label">${esc(L.revision)}</dt><dd>${revision}</dd></div>
  </dl>
</header>`;
}

const sections = {
  summary: (variant, lang) => `<p>${esc(t(variant.summary, lang))}</p>`,

  experience: (variant, lang, L) => {
    if (!cv.experience.length) return null;
    return `<div class="entries">
${cv.experience.map((x) => `  <article class="entry">
    <h3>${esc(t(x.role, lang))}</h3>
    <p class="when">${esc(period(x.start, x.end, L))}</p>
    <p class="where">${esc(t(x.org, lang))}</p>
${(t(x.bullets, lang) ?? []).map((b) => `    <p class="note">${esc(b)}</p>`).join('\n')}
  </article>`).join('\n')}
</div>`;
  },

  education: (variant, lang, L) => `<div class="entries">
${variant.educationOrder.map((key) => {
    const e = cv.education[key];
    const progress = e.progress
      ? `\n    <p class="note">${esc(L.progress.replace('{approved}', e.progress.approved).replace('{total}', e.progress.total))}</p>`
      : '';
    return `  <article class="entry">
    <h3>${esc(t(e.degree, lang))}</h3>
    <p class="when">${esc(period(e.start, e.end, L))}</p>
    <p class="where">${esc(t(e.institution, lang))}</p>${progress}
  </article>`;
  }).join('\n')}
</div>`,

  skills: (variant, lang, L) => `<dl class="skill-list">
${variant.skillOrder.map((key) => {
    const group = cv.skills[key];
    const lines = LEVEL_ORDER.map((level) => {
      const names = group.items.filter((i) => i.level === level).map((i) => esc(t(i.name, lang)));
      if (!names.length) return '';
      const label = level ? `<span class="lvl">${esc(cap(L.levels[level]))}:</span> ` : '';
      return `      <p>${label}${names.join(', ')}</p>`;
    }).filter(Boolean);
    return `  <div class="skill-group">
    <dt>${esc(t(group.label, lang))}</dt>
    <dd>
${lines.join('\n')}
    </dd>
  </div>`;
  }).join('\n')}
</dl>`,

  languages: (variant, lang) => `<ul class="inline-list">
${cv.languages.map((l) => `  <li>${esc(t(l.name, lang))} — ${esc(t(l.level, lang).toLowerCase())}</li>`).join('\n')}
</ul>`,

  interests: (variant, lang) => {
    const items = cv.interests[lang];
    if (!items?.length) return null;
    return `<ul class="inline-list">
${items.map((i) => `  <li>${esc(i)}</li>`).join('\n')}
</ul>`;
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
    titleBlock(variant, lang, L),
    ...variant.sections.map((name) => {
      const html = sections[name](variant, lang, L);
      return html && `<section class="${name}" aria-labelledby="h-${name}">
<h2 id="h-${name}">${esc(L[name])}</h2>
${html}
</section>`;
    }).filter(Boolean),
    `<footer class="sheet-foot">
  <span>${esc(L.revision)} ${revision} · ${esc(updated(L))}</span>
  <span>${esc(cv.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</span>
</footer>`,
  ].join('\n');

  const vars = {
    lang,
    otherLang: other,
    title: `CV — ${cv.name}${L.titleSuffix[variantKey]}`,
    description: t(variant.summary, lang),
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
console.log(`HTML: ${outputs.length} páginas (rev. ${revision})`);

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
