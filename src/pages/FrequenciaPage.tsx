import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { sessoesAula, turmas, alunos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, CalendarCheck } from 'lucide-react';

export default function FrequenciaPage() {
  const [turmaSel, setTurmaSel] = useState(turmas[0].id);
  const sessoes = sessoesAula.filter(s => s.turmaId === turmaSel);
  const turma = turmas.find(t => t.id === turmaSel);

  return (
    <div className="space-y-6">
      <PageHeader title="Frequência" subtitle="Lançamento e acompanhamento de presença" />

      <div className="flex gap-2 flex-wrap">
        {turmas.map(t => (
          <Button key={t.id} variant={turmaSel === t.id ? 'default' : 'secondary'} size="sm" className="text-xs" onClick={() => setTurmaSel(t.id)}>
            {t.nome}
          </Button>
        ))}
      </div>

      {sessoes.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">Nenhuma sessão registrada para esta turma.</div>
      ) : (
        <div className="space-y-4">
          {sessoes.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{s.data}</span>
                  <span className="text-xs text-muted-foreground">• {s.professor}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {s.presencas.filter(p => p.presente).length}/{s.presencas.length} presentes
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {s.presencas.map(p => {
                  const aluno = alunos.find(a => a.id === p.alunoId);
                  return (
                    <div key={p.alunoId} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md border ${p.presente ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
                      {p.presente ? <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                      <span className="text-foreground truncate">{aluno?.nome || p.alunoId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
