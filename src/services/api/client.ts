// Em dev o Vite proxy manda /rows e /status para :3000, então usamos caminhos
// relativos por padrão. Sobrescrever via VITE_API_URL se a API estiver em outro host.
const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
const RAW_API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) ?? '';

export const API_BASE = RAW_BASE.replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  return API_BASE ? url.toString() : url.pathname + url.search;
}

function buildHeaders(contentType?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (RAW_API_KEY) {
    headers['X-API-Key'] = RAW_API_KEY;
  }
  return headers;
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const body = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg =
      (body && typeof body === 'object' && 'message' in body ? (body as { message?: string }).message : null) ??
      (body && typeof body === 'object' && 'error' in body ? (body as { error?: string }).error : null) ??
      `HTTP ${res.status}`;
    throw new ApiError(res.status, msg, body);
  }
  return body as T;
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

export const http = {
  get: <T>(path: string, query?: Record<string, string | number | undefined>) =>
    fetch(buildUrl(path, query), { method: 'GET', headers: buildHeaders() }).then(parse<T>),
  post: <T>(path: string, body: unknown, query?: Record<string, string | number | undefined>) =>
    fetch(buildUrl(path, query), {
      method: 'POST',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(body),
    }).then(parse<T>),
  put: <T>(path: string, body: unknown, query?: Record<string, string | number | undefined>) =>
    fetch(buildUrl(path, query), {
      method: 'PUT',
      headers: buildHeaders('application/json'),
      body: JSON.stringify(body),
    }).then(parse<T>),
};
