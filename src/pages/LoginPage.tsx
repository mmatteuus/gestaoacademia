import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(password);
      if (!result.ok) {
        if (result.lockedUntil) {
          const seconds = Math.ceil((result.lockedUntil - Date.now()) / 1000);
          setError(`Muitas tentativas. Tente novamente em ${seconds}s.`);
        } else if (typeof result.remaining === 'number') {
          setError(`Senha incorreta. Restam ${result.remaining} tentativa(s).`);
        } else {
          setError('Senha incorreta.');
        }
      }
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-background px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl glass-card p-6 sm:p-7"
        aria-label="Entrar no sistema"
      >
        <header className="space-y-2 text-center">
          <img
            src="/icons/logo-gemeos-white-bg.png"
            alt="Gêmeos Academia"
            className="mx-auto h-14 w-auto"
          />
          <h1 className="text-xl font-semibold">Gêmeos Academia</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito. Informe a senha para continuar.</p>
        </header>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="pr-11"
              aria-invalid={!!error}
              aria-describedby={error ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-0 flex h-full w-11 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && (
            <p id="password-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full h-11" disabled={loading || !password}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Desenvolvido por{' '}
          <a
            href="https://MtsFerreira - Oss.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            MtsFerreira - Oss
          </a>
        </p>
      </form>
    </main>
  );
}
