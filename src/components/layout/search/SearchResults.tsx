import { BookOpen, Package, Users } from 'lucide-react';
import type { TopbarSearchResults } from './topbar-search.types';

interface SearchResultsProps {
  results: TopbarSearchResults;
  onSelect: (path: string) => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <div className="divide-y divide-border/60">
      {results.alunos.length > 0 && (
        <section className="p-2" aria-label="Resultados de alunos">
          <p className="mb-1 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Alunos</p>
          {results.alunos.map((aluno) => (
            <button
              key={aluno.id}
              type="button"
              onClick={() => onSelect('/alunos')}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent/30"
            >
              <Users className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate text-foreground">{aluno.nome}</span>
              <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{aluno.categoria}</span>
            </button>
          ))}
        </section>
      )}

      {results.turmas.length > 0 && (
        <section className="p-2" aria-label="Resultados de turmas">
          <p className="mb-1 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Turmas</p>
          {results.turmas.map((turma) => (
            <button
              key={turma.id}
              type="button"
              onClick={() => onSelect('/turmas')}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent/30"
            >
              <BookOpen className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate text-foreground">{turma.nome}</span>
              <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{turma.professor}</span>
            </button>
          ))}
        </section>
      )}

      {results.produtos.length > 0 && (
        <section className="p-2" aria-label="Resultados de produtos">
          <p className="mb-1 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Produtos</p>
          {results.produtos.map((produto) => (
            <button
              key={produto.id}
              type="button"
              onClick={() => onSelect('/produtos')}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent/30"
            >
              <Package className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate text-foreground">{produto.nome}</span>
              <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">{formatCurrency(produto.preco)}</span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
