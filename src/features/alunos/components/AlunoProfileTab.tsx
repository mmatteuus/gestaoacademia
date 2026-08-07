import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Aluno, Responsavel, Turma } from '@/types';
import { AlunoInfoRow } from './AlunoInfoRow';
import { getWhatsAppLink } from '../utils/aluno-details.utils';

interface AlunoProfileTabProps {
  aluno: Aluno;
  responsavel: Responsavel | null;
  showResponsavel: boolean;
  turmas: Turma[];
  turmasDisponiveis: Turma[];
  onAddTurma: (turmaId: string) => void;
  onRemoveTurma: (turmaId: string) => void;
}

export function AlunoProfileTab({
  aluno,
  responsavel,
  showResponsavel,
  turmas,
  turmasDisponiveis,
  onAddTurma,
  onRemoveTurma,
}: AlunoProfileTabProps) {
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

      {showResponsavel && (
        <div className="space-y-2 rounded-md border border-border p-3">
          <p className="text-xs font-semibold text-foreground">Responsável</p>
          <AlunoInfoRow label="Nome" value={responsavel?.nome || 'Não informado'} />
          <AlunoInfoRow label="Telefone" value={responsavel?.telefone || '-'} />
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
        {turmas.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aluno sem turma vinculada.</p>
        ) : (
          <div className="space-y-2">
            {turmas.map((turma) => (
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
