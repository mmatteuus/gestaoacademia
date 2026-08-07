const CACHE_TTL_MS = 5 * 60_000;

const sheetNamesCache = {
  expiresAt: 0,
  names: null,
};

const headerCache = new Map();
const ensuredSheets = new Set();

export function getCachedSheetNames() {
  if (!sheetNamesCache.names || sheetNamesCache.expiresAt <= Date.now()) return null;
  return [...sheetNamesCache.names];
}

export function cacheSheetNames(names) {
  sheetNamesCache.names = [...names];
  sheetNamesCache.expiresAt = Date.now() + CACHE_TTL_MS;
}

export function setSheetKnown(sheetName) {
  if (!sheetNamesCache.names) return;
  if (!sheetNamesCache.names.includes(sheetName)) sheetNamesCache.names.push(sheetName);
  sheetNamesCache.expiresAt = Date.now() + CACHE_TTL_MS;
}

export function getCachedHeader(sheetName) {
  const cached = headerCache.get(sheetName);
  if (!cached || cached.expiresAt <= Date.now()) return null;
  return cached.headers;
}

export function cacheHeader(sheetName, headers) {
  headerCache.set(sheetName, {
    headers: [...headers],
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function isSheetEnsured(sheetName) {
  return ensuredSheets.has(sheetName);
}

export function markSheetEnsured(sheetName) {
  ensuredSheets.add(sheetName);
}

export function invalidateSheetCaches(_sheetName) {
  // As rotas de escrita atualizam os caches no mesmo fluxo. Invalidá-los aqui
  // provocaria leituras extras e maior consumo da cota da API do Google Sheets.
}
