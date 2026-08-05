import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEMO_PASSWORD = 'academia123';

export default function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(password);
      if (!result.ok) {
        if (result.lockedUntil) {
          const seconds = Math.ceil((result.lockedUntil - Date.now()) / 1000);
          setError(`Muitas tentativas. Tente novamente em ${seconds}s.`);
        } else {
          setError('Senha demonstrativa inválida.');
        }
      }
    } catch {
      setError('Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm space-y-6 rounded-2xl p-6 sm:p-7" aria-label="Entrar no sistema">
        <header className="space-y-2 text-center">
          <div className="mx-auto w-fit rounded-xl bg-white p-2">
            <img src="/icons/logo-gemeos-white-bg.png" alt="Gêmeos Academia" className="h-14 w-auto object-contain" />
          </div>
          <h1 className="text-xl font-semibold">Gêmeos Academia</h1>
          <p className="text-sm text-muted-foreground">A credencial demonstrativa já está preenchida.</p>
        </header>

        <div className="space-y-2">
          <Label htmlFor="password">Senha de demonstração</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(null);
              }}
              required
              className="pr-11"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'password-error' : 'password-hint'}
            />
            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              className="absolute inset-y-0 right-0 flex h-full w-11 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error ? (
            <p id="password-error" role="alert" className="text-sm text-destructive">{error}</p>
          ) : (
            <p id="password-hint" className="text-xs text-muted-foreground">Clique em Entrar para acessar a demonstração.</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={loading || !password}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Desenvolvido por{' '}
          <a href="https://www.mtsferreira.dev/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            MtsFerreira
          </a>
        </p>
      </form>
    </main>
  );
}
