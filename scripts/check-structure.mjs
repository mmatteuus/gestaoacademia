import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOTS = ['src', 'backend/src'];
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const GENERATED_PREFIXES = ['src/components/ui/'];
const strictMode = process.argv.includes('--strict');

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function isGeneratedFile(relativePath) {
  return GENERATED_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
}

function getLineLimit(relativePath) {
  if (isGeneratedFile(relativePath)) return null;

  const isReactFile = relativePath.endsWith('.tsx') || relativePath.endsWith('.jsx');
  const isVisualLayer =
    relativePath.startsWith('src/pages/') ||
    relativePath.startsWith('src/components/') ||
    relativePath.startsWith('src/features/');

  return isReactFile && isVisualLayer ? 150 : 300;
}

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(fullPath)));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function findViolations() {
  const files = [];

  for (const root of ROOTS) {
    files.push(...(await collectSourceFiles(root)));
  }

  const violations = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(process.cwd(), file));
    const limit = getLineLimit(relativePath);

    if (limit === null) continue;

    const source = await readFile(file, 'utf8');
    const lineCount = source.split(/\r?\n/).length;

    if (lineCount > limit) {
      violations.push({
        path: relativePath,
        lines: lineCount,
        limit,
        excess: lineCount - limit,
      });
    }
  }

  return violations.sort((left, right) => right.excess - left.excess);
}

const violations = await findViolations();

console.log('Auditoria estrutural da Gêmeos Academia');
console.log('Limites: 150 linhas para arquivos React visuais e 300 para os demais arquivos.');
console.log('Primitivos em src/components/ui são excluídos por serem componentes gerados.');
console.log('O limite de 50 linhas por função continua sujeito a revisão humana.');

if (violations.length === 0) {
  console.log('\nNenhum arquivo acima dos limites configurados.');
  process.exit(0);
}

console.log(`\n${violations.length} arquivo(s) precisam de revisão:`);

for (const violation of violations) {
  console.log(
    `- ${violation.path}: ${violation.lines} linhas ` +
      `(limite ${violation.limit}, excesso ${violation.excess})`,
  );
}

if (strictMode) {
  console.error('\nAuditoria estrutural reprovada em modo estrito.');
  process.exitCode = 1;
} else {
  console.log('\nModo informativo: use --strict para reprovar quando houver violações.');
}
