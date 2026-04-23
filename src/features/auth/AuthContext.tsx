import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const STORAGE_KEY = 'gemeos.auth.v1';
const EXPIRY_KEY = 'gemeos.auth.expiry.v1';
const LOCKOUT_KEY = 'gemeos.auth.lockout.v1';
const ATTEMPTS_KEY = 'gemeos.auth.attempts.v1';
const SESSION_TOKEN = 'ok';
// Sessão válida por 24h — elimina login obrigatório ao reabrir o PWA,
// mas expira após um dia de inatividade por segurança.
const SESSION_DURATION_MS = 24 * 60 * 60_000;
const PASSWORD_HASH = '61ff9d5cda6880fa4b1a059e79e7c48dc6e55ed92d25037d246fbb0b6ab8a674';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

type LoginResult = { ok: boolean; lockedUntil?: number; remaining?: number };

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<LoginResult>;
  logout: () => void;
  getLockoutUntil: () => number | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isSessionValid(): boolean {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token !== SESSION_TOKEN) return false;
    const expiry = Number(localStorage.getItem(EXPIRY_KEY) || '0');
    if (!expiry || expiry <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionValid());
  const queryClient = useQueryClient();

  const checkForUpdates = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        registration.update();
      }
      
      if (registrations.length > 0) {
        toast("Verificando atualizações...", {
          description: "Buscando novas versões do sistema.",
          duration: 2000,
        });
      }
    } catch {
      // Silencioso
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === EXPIRY_KEY) {
        setIsAuthenticated(isSessionValid());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const getLockoutUntil = useCallback((): number | null => {
    try {
      const raw = localStorage.getItem(LOCKOUT_KEY);
      if (!raw) return null;
      const ts = Number(raw);
      if (!Number.isFinite(ts) || ts <= Date.now()) {
        localStorage.removeItem(LOCKOUT_KEY);
        return null;
      }
      return ts;
    } catch {
      return null;
    }
  }, []);

  const login = useCallback(async (password: string): Promise<LoginResult> => {
    const lockedUntil = getLockoutUntil();
    if (lockedUntil) return { ok: false, lockedUntil };

    const hash = await sha256Hex(password);
    const ok = hash === PASSWORD_HASH;
    if (ok) {
      try {
        localStorage.setItem(STORAGE_KEY, SESSION_TOKEN);
        localStorage.setItem(EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_KEY);
      } catch {
        /* ignore */
      }
      setIsAuthenticated(true);
      queryClient.invalidateQueries();
      checkForUpdates();
      return { ok: true };
    }

    let attempts = 0;
    try {
      attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
      localStorage.setItem(ATTEMPTS_KEY, String(attempts));
      if (attempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        localStorage.setItem(LOCKOUT_KEY, String(until));
        localStorage.removeItem(ATTEMPTS_KEY);
        return { ok: false, lockedUntil: until };
      }
    } catch {
      /* ignore */
    }
    return { ok: false, remaining: Math.max(0, MAX_ATTEMPTS - attempts) };
  }, [getLockoutUntil]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPIRY_KEY);
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false);
    // Redireciona para a tela de login após logout
    window.location.href = '/login';
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, getLockoutUntil }),
    [isAuthenticated, login, logout, getLockoutUntil]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
