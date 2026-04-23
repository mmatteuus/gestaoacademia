/**
 * Conta requisições pendentes na fila de Background Sync do Workbox.
 * O Workbox armazena em IndexedDB "workbox-background-sync" → store "requests",
 * filtrando por queueName.
 *
 * Mantemos a leitura best-effort: se o IndexedDB não estiver disponível
 * (browsers antigos, modo privado), retorna 0 sem quebrar a UI.
 */

const DB_NAME = "workbox-background-sync";
const STORE_NAME = "requests";
const QUEUE_NAME = "gemeos-writes-queue";

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    try {
      const req = indexedDB.open(DB_NAME);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onupgradeneeded = () => {
        // Fila ainda não existe (Workbox a cria ao primeiro falhado).
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

export async function getPendingWriteCount(): Promise<number> {
  const db = await openDb();
  if (!db) return 0;
  try {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.close();
      return 0;
    }
    return await new Promise<number>((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      let count = 0;
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (!cursor) return resolve(count);
        const value = cursor.value as { queueName?: string };
        if (value?.queueName === QUEUE_NAME) count += 1;
        cursor.continue();
      };
      cursorReq.onerror = () => resolve(0);
      tx.oncomplete = () => db.close();
      tx.onerror = () => {
        db.close();
        resolve(0);
      };
    });
  } catch {
    db.close();
    return 0;
  }
}
