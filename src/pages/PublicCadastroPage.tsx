import { Award } from 'lucide-react';
import { PublicCadastroForm } from '@/features/public-cadastro/components/PublicCadastroForm';
import { PublicCadastroSuccess } from '@/features/public-cadastro/components/PublicCadastroSuccess';
import { PublicFooter } from '@/features/public-cadastro/components/PublicFooter';
import { usePublicCadastro } from '@/features/public-cadastro/hooks/usePublicCadastro';

export default function PublicCadastroPage() {
  const { form, loading, error, success, setField, submit } = usePublicCadastro();

  if (success) {
    return <PublicCadastroSuccess />;
  }

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        <header className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary glow-primary-sm">
            <Award className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Cadastro de aluno</h1>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para iniciar o processo de matrícula na Gêmeos Academia.
          </p>
        </header>

        <PublicCadastroForm
          values={form}
          loading={loading}
          error={error}
          onChange={setField}
          onSubmit={submit}
        />

        <PublicFooter className="mt-4" />
      </div>
    </main>
  );
}
