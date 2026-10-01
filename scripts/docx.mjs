// Resume en Word (.docx) a partir del mismo HTML que la página y el PDF, para los
// portales que no aceptan PDF. Sin dependencias: un .docx es un ZIP con XML, y Node
// trae deflate y CRC32. Solo cubre el marcado del resume (títulos a todo el ancho);
// el CV, con su columna de etiquetas, sale solo en PDF.
import { deflateRawSync, crc32 } from 'node:zlib';

const PAGE = { a4: { w: 11906, h: 16838 }, letter: { w: 12240, h: 15840 } }; // twips
const MARGIN = 1080; // 0,75", igual que @page en styles.css

const decode = (s) => s
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&amp;', '&');
const xml = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Corridas de texto de un bloque HTML: <b>, <i> y la fecha (<span class="when">),
// que va en cursiva tras un tabulador alineado a la derecha.
function runs(inner) {
  const out = [];
  let bold = false;
  let italic = false;
  for (const part of inner.split(/(<[^>]+>)/)) {
    if (!part) continue;
    if (part.startsWith('<')) {
      if (/^<b\b/.test(part)) bold = true;
      else if (part === '</b>') bold = false;
      else if (/^<i\b/.test(part)) italic = true;
      else if (part === '</i>') italic = false;
      else if (/^<span class="when"/.test(part)) { out.push({ tab: true }); italic = true; }
      else if (part === '</span>') italic = false;
      continue;
    }
    out.push({ text: decode(part), bold, italic });
  }
  return out;
}

function run({ text, tab, bold, italic }, extra = '') {
  const props = `${bold ? '<w:b/>' : ''}${italic ? '<w:i/>' : ''}${extra}`;
  const rPr = props ? `<w:rPr>${props}</w:rPr>` : '';
  return tab ? `<w:r>${rPr}<w:tab/></w:r>` : `<w:r>${rPr}<w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
}

const paragraph = (pPr, body) => `<w:p><w:pPr>${pPr}</w:pPr>${body}</w:p>`;

function documentXml(html, paper) {
  const width = PAGE[paper].w - 2 * MARGIN;
  const blocks = [];
  let newEntry = false;
  let first = true;
  const re = /<article\b[^>]*>|<(h1|h2|p|li)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  for (const [tag, name, attrs, inner] of html.matchAll(re)) {
    if (!name) { newEntry = !first; continue; }
    const cls = /class="([^"]*)"/.exec(attrs)?.[1] ?? '';
    const rs = runs(inner);
    const text = rs.map((r) => run(r)).join('');
    if (name === 'h1') {
      blocks.push(paragraph('<w:jc w:val="center"/>', rs.map((r) => run(r, '<w:b/><w:sz w:val="32"/>')).join('')));
    } else if (cls === 'contact') {
      blocks.push(paragraph('<w:spacing w:after="160"/><w:jc w:val="center"/>', text));
    } else if (name === 'h2') {
      // <w:caps/> muestra mayúsculas sin cambiar el texto, como text-transform en CSS.
      blocks.push(paragraph(
        '<w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/></w:pBdr><w:spacing w:before="180" w:after="80"/>',
        rs.map((r) => run(r, '<w:b/><w:caps/>')).join('')));
      first = true;
      continue;
    } else if (name === 'li') {
      blocks.push(paragraph('<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>', text));
    } else {
      const before = newEntry ? '<w:spacing w:before="100"/>' : '';
      const keep = cls === 'row' || /^<i>/.test(inner) ? '<w:keepNext/>' : '';
      const tabs = cls === 'row' ? `<w:tabs><w:tab w:val="right" w:pos="${width}"/></w:tabs>` : '';
      const hang = cls === 'hang' ? '<w:ind w:left="240" w:hanging="240"/>' : '';
      blocks.push(paragraph(`${keep}${tabs}${before}${hang}`, text));
    }
    newEntry = false;
    first = false;
  }
  const { w, h } = PAGE[paper];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${blocks.join('')}<w:sectPr><w:pgSz w:w="${w}" w:h="${h}"/><w:pgMar w:top="${MARGIN}" w:right="${MARGIN}" w:bottom="${MARGIN}" w:left="${MARGIN}" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

const styles = (lang) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="${lang === 'es' ? 'es-AR' : 'en-US'}"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>`;

const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="300" w:hanging="300"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

const core = (title, author, lang) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xml(title)}</dc:title><dc:creator>${xml(author)}</dc:creator><dc:language>${lang}</dc:language></cp:coreProperties>`;

const PARTS = {
  '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
  '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
  'word/_rels/document.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`,
};

// ZIP mínimo con fecha fija (1/1/1980): el mismo contenido da el mismo archivo,
// así git no ve cambios cuando el resume no cambió.
function zip(files) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content, 'utf8');
    const packed = deflateRawSync(data);
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6);
    head.writeUInt16LE(8, 8); head.writeUInt16LE(0, 10); head.writeUInt16LE(0x21, 12);
    head.writeUInt32LE(crc, 14); head.writeUInt32LE(packed.length, 18); head.writeUInt32LE(data.length, 22);
    head.writeUInt16LE(nameBuf.length, 26); head.writeUInt16LE(0, 28);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0); dir.writeUInt16LE(20, 4); dir.writeUInt16LE(20, 6); dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10); dir.writeUInt16LE(0, 12); dir.writeUInt16LE(0x21, 14);
    dir.writeUInt32LE(crc, 16); dir.writeUInt32LE(packed.length, 20); dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28); dir.writeUInt32LE(offset, 42);
    local.push(head, nameBuf, packed);
    central.push(dir, nameBuf);
    offset += head.length + nameBuf.length + packed.length;
  }
  const dirBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8); end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(dirBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, dirBuf, end]);
}

// Texto del .docx en orden de lectura, para la prueba ATS (mismos fragmentos que el PDF).
export const docxText = (documentXmlString) => documentXmlString
  .replace(/<w:tab\/>/g, ' ').replace(/<\/w:p>/g, '\n')
  .replace(/<[^>]+>/g, '').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

export function resumeDocx(html, { paper, title, author, lang }) {
  const document = documentXml(html, paper);
  const buffer = zip({
    ...PARTS,
    'word/document.xml': document,
    'word/styles.xml': styles(lang),
    'word/numbering.xml': numbering,
    'docProps/core.xml': core(title, author, lang),
  });
  return { buffer, text: docxText(document) };
}
