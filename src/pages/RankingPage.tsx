import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ranking } from '@/mocks/data';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const categorias = ['Todas', 'Adulto', 'Juvenil', 'Infantil'];

export default function RankingPage() {
  const [catSel, setCatSel] = useState('Todas');
  const filtered = catSel === 'Todas' ? ranking : ranking.filter(r => r.categoria === catSel);

  return (
    <div className="space-y-6">
      <PageHeader title="Ranking" subtitle="Classificação por temporada e categoria" />

      <div className="flex gap-2 flex-wrap">
        {categorias.map(c => (
          <Button key={c} variant={catSel === c ? 'default' : 'secondary'} size="sm" className="text-xs" onClick={() => setCatSel(c)}>{c}</Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum atleta nesta categoria" description="Selecione outra categoria ou cadastre atletas." />
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const variacao = r.posicaoAnterior - r.posicao;
            return (
              <div
                key={r.alunoId}
                className={cn(
                  "bg-card border border-border rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-accent/30 transition-colors",
                  r.posicao === 1 && "border-primary/30 glow-primary-sm"
                )}
              >
                <div className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0",
                  r.posicao === 1 ? "bg-primary text-primary-foreground" :
                  r.posicao === 2 ? "bg-muted text-foreground" :
                  r.posicao === 3 ? "bg-muted text-foreground" :
                  "bg-muted/50 text-muted-foreground"
                )}>
                  {r.posicao === 1 ? <Trophy className="h-4 w-4" /> : `#${r.posicao}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{r.nomeAluno}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden sm:inline">{r.categoria}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{r.vitorias}V</span>
                    <span>{r.medalhas}M</span>
                    <span className="sm:hidden text-[10px]">{r.categoria}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base sm:text-lg font-bold text-foreground">{r.pontuacao}</div>
                  <div className={cn(
                    "flex items-center justify-end gap-0.5 text-xs",
                    variacao > 0 ? "text-success" : variacao < 0 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {variacao > 0 ? <TrendingUp className="h-3 w-3" /> : variacao < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    <span>{variacao > 0 ? `+${variacao}` : variacao === 0 ? '—' : variacao}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
