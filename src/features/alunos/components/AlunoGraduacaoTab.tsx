import { CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Aluno, GraduacaoAluno } from '@/types';
import { InfoRow } from './InfoRow';

interface Props {
  aluno: Aluno;
  graduacao: GraduacaoAluno | null;
  percentual: number;
}

export function AlunoGraduacaoTab({ aluno, graduacao, percentual }: Props) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 pt-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-8 text-xs"
        onClick={() => navigate(`/graduacao?aluno=${aluno.id}`)}
      >
        Abrir graduação deste aluno
      </Button>

      {graduacao ? (
        <>
          <div className="rounded-md border border-border p-3">
            <InfoRow label="Faixa atual" value={graduacao.faixaAtual || '-'} />
            <InfoRow label="Próxima faixa" value={graduacao.proximaFaixa || '-'} />
            <InfoRow label="Aulas" value={`${graduacao.aulasRealizadas}/${graduacao.aulasNecessarias}`} />
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
          Histórico detalhado será exibido conforme os registros de graduação.
        </div>
      </div>
    </div>
  );
}
