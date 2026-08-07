import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { AlunoDetails } from '../hooks/useAlunoDetails';
import { getWhatsAppLink } from '../alunos.utils';
import { AlunoInfoRow } from './AlunoInfoRow';

export function AlunoPerfilTab({ details }: { details: AlunoDetails }) {
  const aluno = details.aluno;
  if (!aluno) return null;

  const removeTurma = (turmaId: string) => {
    const result = details.removeAlunoFromTurma(aluno.id, turmaId);
    if (!result.ok) toast.error(result.message || 'Falha ao remover turma.');
  };

  const addTurma = (turmaId: string) => {
    const result = details.addAlunoToTurma(aluno.id, turmaId);
    if (result.ok) toast.success('Aluno adicionado à turma.');
    else toast.error(result.message || 'Falha ao vincular turma.');
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2 rounded-md border border-border p-3">
        <AlunoInfoRow label="Telefone" value={aluno.telefone || '-'} />
        <AlunoInfoRow label="E-mail" value={aluno.email || '-'} />
        <AlunoInfoRow label="CPF" value={aluno.cpf || '-'} />
        <AlunoInfoRow label="Nascimento" value={aluno.dataNascimento || '-'} />
        <AlunoInfoRow label="Faixa" value={aluno.faixaAtual || '-'} />
        <AlunoInfoRow label="Status" value={aluno.status} />
      </div>

      {details.showResponsavel && (
        <div className="space-y-2 rounded-md border border-border p-3">
          <p className="text-xs font-semibold text-foreground">Responsável</p>
          <AlunoInfoRow label="Nome" value={details.responsavel?.nome || 'Não informado'} />
          <AlunoInfoRow label="Telefone" value={details.responsavel?.telefone || '-'} />
          {details.responsavel?.telefone && (
            <a
              href={getWhatsAppLink(details.responsavel.telefone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chamar no WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="space-y-2 rounded-md border border-border p-3">
        <p className="text-xs font-semibold text-foreground">Turmas</p>
        {details.turmasDoAluno.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aluno sem turma vinculada.</p>
        ) : (
          <div className="space-y-2">
            {details.turmasDoAluno.map((turma) => (
              <div
                key={turma.id}
                className="flex items-center justify-between rounded bg-secondary/40 px-2 py-1.5 text-xs"
              >
                <span>{turma.nome}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[11px]"
                  onClick={() => removeTurma(turma.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}

        {details.turmasDisponiveis.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {details.turmasDisponiveis.slice(0, 5).map((turma) => (
              <Button
                key={turma.id}
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 text-[11px]"
                onClick={() => addTurma(turma.id)}
              >
                + {turma.nome}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
