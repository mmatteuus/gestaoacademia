import { CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AlunoDetails } from '../hooks/useAlunoDetails';
import { AlunoInfoRow } from './AlunoInfoRow';

export function AlunoGraduacaoTab({ details }: { details: AlunoDetails }) {
  const navigate = useNavigate();
  const aluno = details.aluno;
  if (!aluno) return null;

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

      {details.graduacao ? (
        <>
          <div className="space-y-1 rounded-md border border-border p-3">
            <AlunoInfoRow label="Faixa atual" value={details.graduacao.faixaAtual || '-'} />
            <AlunoInfoRow label="Próxima faixa" value={details.graduacao.proximaFaixa || '-'} />
            <AlunoInfoRow
              label="Aulas"
              value={`${details.graduacao.aulasRealizadas}/${details.graduacao.aulasNecessarias}`}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso para graduação</span>
              <span>{details.percentualGraduacao}%</span>
            </div>
            <Progress value={Math.min(100, details.percentualGraduacao)} className="h-2" />
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Sem dados de graduação para este aluno.
        </p>
      )}

      <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-3.5 w-3.5" />
          O histórico detalhado será exibido conforme novos registros de graduação.
        </div>
      </div>
    </div>
  );
}
