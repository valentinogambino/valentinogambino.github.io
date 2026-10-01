// Guardia de datos sensibles. Busca PATRONES genéricos, nunca valores literales:
// este archivo es público, así que no puede contener lo que intenta proteger.
//   node scripts/check-sensible.mjs            revisa docs/, local/ y data/
//   node scripts/check-sensible.mjs --staged   revisa lo que está en el índice de git (hook pre-commit)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SELF = 'scripts/check-sensible.mjs';
const TEXT_EXT = new Set(['.html', '.css', '.json', '.md', '.mjs', '.js', '.txt', '.xml', '.yml', '']);

// Números de documento y teléfonos: aplican a cualquier archivo de texto.
const NUMBER_PATTERNS = [
  ['número tipo DNI', /\b\d{1,2}\.\d{3}\.\d{3}\b|\b\d{8}\b/],
  ['teléfono', /(?:\+?54[\s-]?)?(?:9[\s-]?)?\b341[\s-]?\d{3}[\s-]?\d{4}\b|\b\d{10}\b/],
  ['fecha de nacimiento', /\b\d{1,2}\/\d{1,2}\/2002\b/],
];
// Palabras que solo tienen sentido en un documento personal: aplican al contenido publicable.
const WORD_PATTERNS = [
  ['domicilio', /pellegrini|domicilio|\bcalle\b/i],
  ['documento', /\bD\.?N\.?I\b|documento de identidad/i],
  ['nacimiento', /nacid[oa] el|fecha de nacimiento|date of birth/i],
];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function scan(rel, text) {
  const publishable = /^(docs|local|data)\//.test(rel);
  const patterns = publishable ? [...NUMBER_PATTERNS, ...WORD_PATTERNS] : NUMBER_PATTERNS;
  return patterns.filter(([, re]) => re.test(text)).map(([label]) => `${rel}: ${label}`);
}

export function checkSensible({ staged = false } = {}) {
  const problems = [];
  let files;
  if (staged) {
    files = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean);
    for (const f of files) if (f.startsWith('fuentes/')) problems.push(`${f}: archivo de fuentes/ en el commit`);
  } else {
    files = ['docs', 'local', 'data'].flatMap((d) => walk(join(ROOT, d))).map((p) => relative(ROOT, p).replaceAll('\\', '/'));
  }
  for (const rel of files) {
    if (rel === SELF || !TEXT_EXT.has(extname(rel))) continue;
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    problems.push(...scan(rel, readFileSync(abs, 'utf8')));
  }
  return problems;
}

// Comparación sin distinguir mayúsculas: en Windows la letra de unidad puede venir como c: o C:.
const isMain = process.argv[1]
  && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) {
  const problems = checkSensible({ staged: process.argv.includes('--staged') });
  if (problems.length) {
    console.error('Datos sensibles detectados:\n  ' + problems.join('\n  '));
    process.exit(1);
  }
  console.log('check-sensible: ok');
}
