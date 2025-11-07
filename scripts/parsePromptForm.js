/**
 * Parse and validate form definitions embedded in instruction/301prompt
 * Extract all form fields, expected types, options, and validation rules.
 * Generate a structured JSON report with robust error handling.
 */
const fs = require('fs');
const path = require('path');

const PROMPT_PATH = path.join(process.cwd(), 'instruction', '301prompt');
const OUTPUT_PATH = path.join(process.cwd(), 'reports', 'parsed-301prompt-form.json');

function readPrompt() {
  try {
    return fs.readFileSync(PROMPT_PATH, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read 301prompt: ${err.message}`);
  }
}

function extractHTMLBlocks(text) {
  // Capture fenced code blocks tagged as html
  const blocks = [];
  const regex = /```html([\s\S]*?)```/gi;
  let m;
  while ((m = regex.exec(text)) !== null) {
    blocks.push(m[1]);
  }
  return blocks;
}

function parseFieldsFromHTML(html) {
  const fields = [];
  // Inputs
  const inputRegex = /<input([^>]*?)>/gi;
  let mi;
  while ((mi = inputRegex.exec(html)) !== null) {
    const attrs = mi[1];
    const id = (attrs.match(/id="([^"]+)"/) || [])[1] || null;
    const type = (attrs.match(/type="([^"]+)"/) || [])[1] || 'text';
    const accept = (attrs.match(/accept="([^"]+)"/) || [])[1] || null;
    if (!id) {
      fields.push({ error: 'Input missing id', raw: mi[0] });
      continue;
    }
    fields.push({ kind: 'input', id, type, accept });
  }

  // Textareas
  const taRegex = /<textarea([^>]*?)>([\s\S]*?)<\/textarea>/gi;
  let mt;
  while ((mt = taRegex.exec(html)) !== null) {
    const attrs = mt[1];
    const id = (attrs.match(/id="([^"]+)"/) || [])[1] || null;
    const rows = (attrs.match(/rows="([^"]+)"/) || [])[1] || null;
    if (!id) {
      fields.push({ error: 'Textarea missing id', raw: mt[0] });
      continue;
    }
    fields.push({ kind: 'textarea', id, rows });
  }

  // Selects and options
  const selRegex = /<select([^>]*?)>([\s\S]*?)<\/select>/gi;
  let ms;
  while ((ms = selRegex.exec(html)) !== null) {
    const attrs = ms[1];
    const body = ms[2];
    const id = (attrs.match(/id="([^"]+)"/) || [])[1] || null;
    if (!id) {
      fields.push({ error: 'Select missing id', raw: ms[0] });
      continue;
    }
    const options = [];
    const optRegex = /<option([^>]*?)>([^<]*)<\/option>/gi;
    let mo;
    while ((mo = optRegex.exec(body)) !== null) {
      const oattrs = mo[1];
      const value = (oattrs.match(/value="([^"]+)"/) || [])[1] || null;
      const label = (mo[2] || '').trim();
      options.push({ value, label });
    }
    fields.push({ kind: 'select', id, options });
  }

  return fields;
}

function categorizeFields(fields) {
  // Map fields to logical sections based on known ids in 301prompt
  const sections = {
    singleRedirect: [],
    bulkRedirect: [],
    domainRedirect: [],
    configPanel: [],
    misc: [],
    errors: []
  };

  const idToSection = (id) => {
    if (['oldUrl', 'newUrl'].includes(id)) return 'singleRedirect';
    if (['bulkInput', 'csvUpload'].includes(id)) return 'bulkRedirect';
    if (['oldDomain', 'newDomain', 'forceHttps', 'wwwPreference'].includes(id)) return 'domainRedirect';
    if (['serverType', 'redirectType', 'caseSensitive', 'exactMatch', 'preserveQuery', 'trailingSlash', 'addComments'].includes(id)) return 'configPanel';
    return 'misc';
  };

  for (const f of fields) {
    if (f.error) {
      sections.errors.push(f);
      continue;
    }
    const section = idToSection(f.id);
    sections[section].push(f);
  }
  return sections;
}

function getValidationRules() {
  // From 301prompt Validation Rules section
  const rules = {
    urlPattern: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
    domainPattern: '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$',
    pathPattern: '^[a-zA-Z0-9\\/_-\\.]*$'
  };
  // Verify regex compiles
  const compiled = {};
  try { compiled.urlPattern = new RegExp(rules.urlPattern, 'i'); } catch (e) { compiled.urlPatternError = e.message; }
  try { compiled.domainPattern = new RegExp(rules.domainPattern, 'i'); } catch (e) { compiled.domainPatternError = e.message; }
  try { compiled.pathPattern = new RegExp(rules.pathPattern); } catch (e) { compiled.pathPatternError = e.message; }
  return { rules, compiledErrors: Object.fromEntries(Object.entries(compiled).filter(([k]) => k.endsWith('Error'))) };
}

function assignExpectedTypes(sectioned) {
  const typed = JSON.parse(JSON.stringify(sectioned));
  const setType = (id, type, validators) => {
    const sec = Object.keys(typed).find(s => typed[s].some(f => f.id === id));
    if (!sec) return;
    typed[sec] = typed[sec].map(f => f.id === id ? { ...f, expectedType: type, validators } : f);
  };

  // Single
  setType('oldUrl', 'string:url_or_path', ['urlPattern', 'pathPattern']);
  setType('newUrl', 'string:url_or_path', ['urlPattern', 'pathPattern']);

  // Bulk
  setType('bulkInput', 'string:csv_text', []);
  setType('csvUpload', 'file:csv_xlsx', []);

  // Domain
  setType('oldDomain', 'string:domain', ['domainPattern']);
  setType('newDomain', 'string:domain', ['domainPattern']);
  setType('forceHttps', 'boolean', []);
  setType('wwwPreference', 'enum', ['keep', 'add', 'remove']);

  // Config
  setType('serverType', 'enum', ['apache', 'nginx', 'php', 'html', 'javascript']);
  setType('redirectType', 'enum:number', ['301', '302', '307', '308']);
  setType('caseSensitive', 'boolean', []);
  setType('exactMatch', 'boolean', []);
  setType('preserveQuery', 'boolean', []);
  setType('trailingSlash', 'boolean', []);
  setType('addComments', 'boolean', []);

  return typed;
}

function processAll() {
  const source = readPrompt();
  const htmlBlocks = extractHTMLBlocks(source);
  if (htmlBlocks.length === 0) {
    throw new Error('No HTML code blocks found in 301prompt.');
  }

  const allFields = htmlBlocks.flatMap(parseFieldsFromHTML);
  const sectioned = categorizeFields(allFields);
  const validation = getValidationRules();
  const typed = assignExpectedTypes(sectioned);

  // Build comprehensive output
  const output = {
    sourceFile: PROMPT_PATH,
    generatedAt: new Date().toISOString(),
    summary: {
      totalBlocks: htmlBlocks.length,
      totalFields: allFields.length,
      sections: Object.fromEntries(Object.entries(typed).map(([k, v]) => [k, v.length]))
    },
    validationRules: validation.rules,
    validationCompileErrors: validation.compiledErrors,
    sections: typed
  };

  // Ensure reports directory exists
  const reportsDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  return output;
}

// Execute and print summary
try {
  const result = processAll();
  console.log('Parsed 301prompt form data successfully.');
  console.log('Output file:', OUTPUT_PATH);
  console.log('Summary:', JSON.stringify(result.summary, null, 2));
} catch (err) {
  console.error('Error processing 301prompt form data:', err.message);
  process.exitCode = 1;
}