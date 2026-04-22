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

