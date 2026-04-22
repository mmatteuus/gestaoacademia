const lockStates = new Map();

export function withLock(key, task) {
  const lockKey = String(key || 'default');
  const state = lockStates.get(lockKey) || { tail: Promise.resolve(), pending: 0 };
  lockStates.set(lockKey, state);
  state.pending += 1;

  const run = state.tail.catch(() => {}).then(task);
  state.tail = run.catch(() => {});

  return run.finally(() => {
    state.pending -= 1;
    if (state.pending <= 0) {
      lockStates.delete(lockKey);
    }
  });
}

/**
 * Adquire múltiplos locks em ordem determinística (sort) para evitar deadlock,
 * e libera todos no fim. Útil para operações multi-recurso (ex.: venda com vários produtos).
 */
export function withLocks(keys, task) {
  const ordered = Array.from(new Set((keys || []).map((k) => String(k || 'default')))).sort();
  if (ordered.length === 0) return Promise.resolve().then(task);

  const acquire = (index) => {
    if (index >= ordered.length) return task();
    return withLock(ordered[index], () => acquire(index + 1));
  };

  return acquire(0);
}

