import { PageHeader } from '@/components/shared/PageHeader';
import { responsaveis, alunos } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ResponsaveisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Responsáveis"
        subtitle={`${responsaveis.length} responsáveis cadastrados`}
        actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {responsaveis.map(r => {
          const alunosVinculados = alunos.filter(a => r.alunoIds.includes(a.id));
          return (
            <div key={r.id} className="bg-card border border-border rounded-lg p-5 hover:bg-accent/30 transition-colors">
              <h3 className="text-sm font-semibold text-foreground">{r.nome}</h3>
              <p className="text-xs text-muted-foreground mt-1">{r.email} • {r.telefone}</p>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Alunos Vinculados</p>
                <div className="flex flex-wrap gap-2">
                  {alunosVinculados.map(a => (
                    <span key={a.id} className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">{a.nome}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
