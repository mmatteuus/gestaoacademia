import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { turmas, alunos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function TurmasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Turmas"
        subtitle={`${turmas.length} turmas ativas`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Nova Turma</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {turmas.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-lg p-5 hover:bg-accent/30 transition-colors group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t.nome}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.modalidade} • {t.professor}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t.alunoIds.length}/{t.capacidade}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t.horario}</span>
                <span>•</span>
                <span>{t.diasSemana.join(', ')}</span>
              </div>
              {/* Occupancy bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(t.alunoIds.length / t.capacidade) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {t.alunoIds.slice(0, 3).map(id => {
                const a = alunos.find(al => al.id === id);
                return a ? (
                  <span key={id} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{a.nome.split(' ')[0]}</span>
                ) : null;
              })}
              {t.alunoIds.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{t.alunoIds.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
