// Prueba ATS de MIT CAPD (GUIA.md, sección 5): el texto extraído del PDF tiene
// que traer todo el contenido de la página y en el mismo orden. Además controla el
// largo máximo en hojas. Con order: false (CV con columna de etiquetas, que MIT
// no somete a la regla de ATS) solo exige que el texto esté completo. Usa pdftotext (viene con Git para Windows y con MiKTeX).
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const PDFTOTEXT = [
  'pdftotext',
  'C:/Program Files/Git/mingw64/bin/pdftotext.exe',
  `${process.env.LOCALAPPDATA}/Programs/MiKTeX/miktex/bin/x64/pdftotext.exe`,
];

const decode = (s) => s
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&amp;', '&');

// Mayúsculas por CSS, ligaduras y espacios no son diferencias de contenido.
const norm = (s) => s.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

// Fragmentos de texto del cuerpo del documento, en orden de lectura.
export function documentText(html) {
  return html
    .replace(/<span class="sep"[^>]*>.*?<\/span>/g, '\n')
    .split(/<[^>]+>/)
    .map((s) => norm(decode(s)))
    .filter((s) => s.length > 1);
}

function pdfText(pdf) {
  for (const bin of PDFTOTEXT) {
    if (bin.includes('/') && !existsSync(bin)) continue;
    try {
      return execFileSync(bin, ['-layout', '-enc', 'UTF-8', pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }
  throw new Error('No encontré pdftotext (Git para Windows o MiKTeX) para la prueba ATS.');
}

export function checkAts(pdf, fragments, maxPages, { order = true } = {}) {
  const raw = pdfText(pdf);
  const problems = [];
  const pages = raw.split('\f').filter((p) => p.trim()).length;
  if (pages > maxPages) problems.push(`${pages} hojas (máximo ${maxPages})`);
  const text = norm(raw);
  let at = 0;
  for (const f of fragments) {
    const i = text.indexOf(f, order ? at : 0);
    if (i === -1) {
      problems.push(text.includes(f) ? `fuera de orden: "${f}"` : `falta en el texto: "${f}"`);
      continue;
    }
    if (order) at = i + f.length;
  }
  return problems;
}
