import { useState, type FormEvent } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Form = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  categoria: string;
  faixa_atual: string;
  observacoes: string;
};

const initial: Form = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  data_nascimento: '',
  categoria: '',
  faixa_atual: '',
  observacoes: '',
};

const REQUEST_TIMEOUT_MS = 12000;

export default function PublicCadastroPage() {
  const [form, setForm] = useState<Form>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch('/api/public/aluno-cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.ok) {
        setError(body?.message || 'Não foi possível enviar. Tente novamente.');
        return;
      }
      setSuccess(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError('Tempo de resposta excedido. Verifique a conexão e tente novamente.');
      } else {
        setError('Falha de rede. Verifique sua conexão e tente novamente.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-2xl glass-card p-7 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-success/15 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <h1 className="text-xl font-semibold">Cadastro enviado!</h1>
          <p className="text-sm text-muted-foreground">
            Recebemos seus dados. Em breve a academia vai entrar em contato para finalizar a matrícula.
          </p>
          <FooterCredit className="pt-2" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        <header className="mb-6 text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary glow-primary-sm">
            <Award className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Cadastro de aluno</h1>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para iniciar o processo de matrícula na Gêmeos Academia.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl glass-card p-5 sm:p-6" aria-label="Formulário de cadastro">
          <Field label="Nome completo *" htmlFor="nome">
            <Input id="nome" required value={form.nome} onChange={(e) => set('nome', e.target.value)} autoComplete="name" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefone *" htmlFor="telefone">
              <Input id="telefone" required value={form.telefone} onChange={(e) => set('telefone', e.target.value)} autoComplete="tel" inputMode="tel" />
            </Field>
            <Field label="E-mail" htmlFor="email">
              <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" inputMode="email" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="CPF" htmlFor="cpf">
              <Input id="cpf" value={form.cpf} onChange={(e) => set('cpf', e.target.value)} inputMode="numeric" />
            </Field>
            <Field label="Data de nascimento" htmlFor="data_nascimento">
              <Input id="data_nascimento" type="date" value={form.data_nascimento} onChange={(e) => set('data_nascimento', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Categoria" htmlFor="categoria">
              <select
                id="categoria"
                value={form.categoria}
                onChange={(e) => set('categoria', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
              >
                <option value="">Selecione</option>
                <option value="Adulto">Adulto</option>
                <option value="Juvenil">Juvenil</option>
                <option value="Infantil">Infantil</option>
              </select>
            </Field>
            <Field label="Faixa atual" htmlFor="faixa_atual">
              <Input id="faixa_atual" placeholder="Ex.: Branca" value={form.faixa_atual} onChange={(e) => set('faixa_atual', e.target.value)} />
            </Field>
          </div>
          <Field label="Observações" htmlFor="observacoes">
            <textarea
              id="observacoes"
              value={form.observacoes}
              onChange={(e) => set('observacoes', e.target.value)}
              maxLength={500}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
            />
          </Field>

          {error && (
            <p role="alert" className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading || !form.nome || !form.telefone}>
            {loading ? 'Enviando...' : 'Enviar cadastro'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">* campos obrigatórios</p>
        </form>

        <FooterCredit className="mt-4" />
      </div>
    </main>
  );
}

function FooterCredit({ className }: { className?: string }) {
  return (
    <p className={`text-center text-xs text-muted-foreground ${className || ''}`.trim()}>
      Desenvolvido por{' '}
      <a
        href="https://www.mtsferreira.dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
MtsFerreira.dev - Oss
      </a>
    </p>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
