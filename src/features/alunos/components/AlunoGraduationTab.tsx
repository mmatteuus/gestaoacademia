import { CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { GraduacaoAluno } from '@/types';
import { AlunoInfoRow } from './AlunoInfoRow';

interface AlunoGraduationTabProps {
  graduacao: GraduacaoAluno | null;
  percentual: number;
  onOpenGraduation: () => void;
}

export function AlunoGraduationTab({
  graduacao,
  percentual,
  onOpenGraduation,
}: AlunoGraduationTabProps) {
  return (
    <div className="space-y-3 pt-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-8 text-xs"
        onClick={onOpenGraduation}
      >
        Abrir graduação deste aluno
      </Button>

      {graduacao ? (
        <>
          <div className="rounded-md border border-border p-3">
            <AlunoInfoRow label="Faixa atual" value={graduacao.faixaAtual || '-'} />
            <AlunoInfoRow label="Próxima faixa" value={graduacao.proximaFaixa || '-'} />
            <AlunoInfoRow
              label="Aulas"
              value={`${graduacao.aulasRealizadas}/${graduacao.aulasNecessarias}`}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso para graduação</span>
              <span>{percentual}%</span>
            </div>
            <Progress value={Math.min(100, percentual)} className="h-2" />
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">Sem dados de graduação para este aluno.</p>
      )}

      <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-3.5 w-3.5" />
          O histórico detalhado será exibido conforme os registros de graduação.
        </div>
      </div>
    </div>
  );
}
