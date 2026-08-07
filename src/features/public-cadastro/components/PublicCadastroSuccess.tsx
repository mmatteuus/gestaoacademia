import { CheckCircle2 } from 'lucide-react';
import { PublicFooter } from './PublicFooter';

export function PublicCadastroSuccess() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-4 rounded-2xl p-7 text-center glass-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h1 className="text-xl font-semibold">Cadastro enviado!</h1>
        <p className="text-sm text-muted-foreground">
          Recebemos seus dados. Em breve a academia vai entrar em contato para finalizar a matrícula.
        </p>
        <PublicFooter className="pt-2" />
      </div>
    </main>
  );
}
