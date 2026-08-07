import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Aluno, Responsavel, Turma } from '@/types';
import { getWhatsAppLink } from '../alunos-page.utils';
import { InfoRow } from './InfoRow';

interface Props {
  aluno: Aluno;
  responsavel: Responsavel | null;
  showResponsavel: boolean;
  turmasDoAluno: Turma[];
  turmasDisponiveis: Turma[];
  onAddTurma: (turmaId: string) => void;
  onRemoveTurma: (turmaId: string) => void;
}

export function AlunoPerfilTab({
  aluno,
  responsavel,
  showResponsavel,
  turmasDoAluno,
  turmasDisponiveis,
  onAddTurma,
  onRemoveTurma,
}: Props) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2 rounded-md border border-border p-3">
        <InfoRow label="Telefone" value={aluno.telefone || '-'} />
        <InfoRow label="E-mail" value={aluno.email || '-'} />
        <InfoRow label="CPF" value={aluno.cpf || '-'} />
        <InfoRow label="Nascimento" value={aluno.dataNascimento || '-'} />
        <InfoRow label="Faixa" value={aluno.faixaAtual || '-'} />
        <InfoRow label="Status" value={aluno.status} />
      </div>

      {showResponsavel && (
        <div className="space-y-2 rounded-md border border-border p-3">
          <p className="text-xs font-semibold text-foreground">Responsável</p>
          <InfoRow label="Nome" value={responsavel?.nome || 'Não informado'} />
          <InfoRow label="Telefone" value={responsavel?.telefone || '-'} />
          {responsavel?.telefone && (
            <a
              href={getWhatsAppLink(responsavel.telefone)}
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
        {turmasDoAluno.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aluno sem turma vinculada.</p>
        ) : (
          <div className="space-y-2">
            {turmasDoAluno.map((turma) => (
              <div key={turma.id} className="flex items-center justify-between rounded bg-secondary/40 px-2 py-1.5 text-xs">
                <span>{turma.nome}</span>
                <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => onRemoveTurma(turma.id)}>
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
        {turmasDisponiveis.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {turmasDisponiveis.slice(0, 5).map((turma) => (
              <Button
                key={turma.id}
                size="sm"
                variant="secondary"
                className="h-7 text-[11px]"
                onClick={() => onAddTurma(turma.id)}
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
