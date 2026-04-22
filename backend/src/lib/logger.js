const SENSITIVE_KEYS = ['password', 'token', 'secret', 'authorization', 'cpf', 'card', 'cvv', 'email', 'refresh_token'];

function redact(value, keyPath = '') {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => redact(item, keyPath));
  if (typeof value === 'object') {
    const output = {};
    for (const [key, innerValue] of Object.entries(value)) {
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      const lowered = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitiveKey) => lowered.includes(sensitiveKey))) {
        output[key] = '[REDACTED]';
      } else {
        output[key] = redact(innerValue, nextPath);
      }
    }
    return output;
  }
  return value;
}

function log(level, payload) {
  const base = {
    level,
    at: new Date().toISOString(),
  };
  const safe = redact(payload || {});
  const line = JSON.stringify({ ...base, ...safe });
  if (level === 'error') {
    console.error(line);
    return;
  }
  if (level === 'warn') {
    console.warn(line);
    return;
  }
  console.log(line);
}

export const logger = {
  info(payload) {
    log('info', payload);
  },
  warn(payload) {
    log('warn', payload);
  },
  error(payload) {
    log('error', payload);
  },
};
