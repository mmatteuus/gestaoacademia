import { AlunoTextField } from './AlunoTextField';

export function AlunoPersonalFields() {
  return (
    <section className="space-y-3" aria-labelledby="aluno-dados-pessoais">
      <div>
        <h3 id="aluno-dados-pessoais" className="text-sm font-semibold text-foreground">
          Dados pessoais
        </h3>
        <p className="text-xs text-muted-foreground">Informações de identificação e contato do aluno.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AlunoTextField name="nome" label="Nome completo" className="sm:col-span-2" />
        <AlunoTextField name="email" label="E-mail" type="email" />
        <AlunoTextField name="telefone" label="Telefone" type="tel" placeholder="(11) 99999-9999" />
        <AlunoTextField name="cpf" label="CPF" placeholder="000.000.000-00" />
        <AlunoTextField name="dataNascimento" label="Data de nascimento" type="date" />
      </div>
    </section>
  );
}
