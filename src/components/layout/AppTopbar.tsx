import { useMemo, useRef, useState, useEffect } from 'react';
import { Search, X, Users, BookOpen, Package, Sun, Moon, LogOut, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlunos, useProdutos, useTurmas } from '@/services/queries';
import { useTheme } from 'next-themes';
import { useAuth } from '@/features/auth/AuthContext';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/alunos': 'Alunos',
  '/turmas': 'Turmas',
  '/frequencia': 'Frequência',
  '/graduacao': 'Graduação',
  '/ranking': 'Ranking',
  '/campeonatos': 'Campeonatos',
  '/financeiro': 'Financeiro',
  '/financeiro-gerencial': 'Financeiro Gerencial',
  '/produtos': 'Produtos & Vendas',
  '/aluguel': 'Aluguel',
  '/relatorios': 'Relatórios',
};

export function AppTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Gemeos Academia';
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldQuery = searchOpen && query.trim().length >= 2;
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const alunosQ = useAlunos({ enabled: shouldQuery });
  const turmasQ = useTurmas({ enabled: shouldQuery });
  const produtosQ = useProdutos({ enabled: shouldQuery });

  const alunosList = useMemo(() => alunosQ.list.data ?? [], [alunosQ.list.data]);
  const turmasList = useMemo(() => turmasQ.list.data ?? [], [turmasQ.list.data]);
  const produtosList = useMemo(() => produtosQ.list.data ?? [], [produtosQ.list.data]);
  const isSearching = shouldQuery && (alunosQ.list.isLoading || turmasQ.list.isLoading || produtosQ.list.isLoading);
  const hasSearchError = shouldQuery && (alunosQ.list.isError || turmasQ.list.isError || produtosQ.list.isError);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const results = useMemo(() => {
    if (query.trim().length < 2) return null;
    const normalizedQuery = query.toLowerCase();
    return {
      alunos: alunosList.filter((item) => item.nome.toLowerCase().includes(normalizedQuery)).slice(0, 4),
      turmas: turmasList.filter((item) => item.nome.toLowerCase().includes(normalizedQuery)).slice(0, 3),
      produtos: produtosList.filter((item) => item.nome.toLowerCase().includes(normalizedQuery)).slice(0, 3),
    };
  }, [alunosList, turmasList, produtosList, query]);

  const hasResults = !!results && (results.alunos.length > 0 || results.turmas.length > 0 || results.produtos.length > 0);

  const handleSelect = (path: string) => {
    navigate(path);
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="h-14 sm:h-16 border-b border-border/80 flex items-center justify-between px-3 sm:px-4 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shrink-0 sticky top-0 z-20 border-tech">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">Gêmeos Academia</p>
          <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="h-10 w-10 md:hidden text-muted-foreground" onClick={() => setSearchOpen(!searchOpen)}>
          {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Buscar alunos, turmas, produtos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            className="pl-9 w-72 h-9 text-sm bg-secondary/50 border-border/50 focus:bg-secondary"
          />
          {searchOpen && query.length >= 2 && (
            <div className="absolute top-full mt-1 right-0 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
              <SearchPanel
                query={query}
                isSearching={isSearching}
                hasSearchError={hasSearchError}
                hasResults={hasResults}
                results={results}
                onSelect={handleSelect}
              />
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? 'Tema claro ativo. Alternar para escuro' : 'Tema escuro ativo. Alternar para claro'}
        >
          {mounted && theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={logout}
          aria-label="Sair"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {searchOpen && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-card p-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Buscar alunos, turmas, produtos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9 text-sm bg-secondary/50 border-border/50"
            />
          </div>
          {query.length >= 2 && (
            <div className="mt-2 rounded-lg border border-border bg-card overflow-hidden">
              <SearchPanel
                query={query}
                isSearching={isSearching}
                hasSearchError={hasSearchError}
                hasResults={hasResults}
                results={results}
                onSelect={handleSelect}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function SearchPanel({
  query,
  isSearching,
  hasSearchError,
  hasResults,
  results,
  onSelect,
}: {
  query: string;
  isSearching: boolean;
  hasSearchError: boolean;
  hasResults: boolean;
  results: {
    alunos: { id: string; nome: string; categoria: string }[];
    turmas: { id: string; nome: string; professor: string }[];
    produtos: { id: string; nome: string; preco: number }[];
  } | null;
  onSelect: (path: string) => void;
}) {
  if (isSearching) {
    return <p className="text-xs text-muted-foreground text-center p-4">Buscando...</p>;
  }
  if (hasSearchError) {
    return <p className="text-xs text-destructive text-center p-4">Falha ao buscar. Tente novamente.</p>;
  }
  if (hasResults && results) {
    return <SearchResults results={results} onSelect={onSelect} />;
  }
  return <p className="text-xs text-muted-foreground text-center p-4">Nenhum resultado para "{query}"</p>;
}

function SearchResults({
  results,
  onSelect,
}: {
  results: {
    alunos: { id: string; nome: string; categoria: string }[];
    turmas: { id: string; nome: string; professor: string }[];
    produtos: { id: string; nome: string; preco: number }[];
  };
  onSelect: (path: string) => void;
}) {
  return (
    <div className="divide-y divide-border/60">
      {results.alunos.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">Alunos</p>
          {results.alunos.map((aluno) => (
            <button key={aluno.id} onClick={() => onSelect('/alunos')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent/30 transition-colors text-left">
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{aluno.nome}</span>
              <span className="text-muted-foreground ml-auto text-[10px] shrink-0">{aluno.categoria}</span>
            </button>
          ))}
        </div>
      )}
      {results.turmas.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">Turmas</p>
          {results.turmas.map((turma) => (
            <button key={turma.id} onClick={() => onSelect('/turmas')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent/30 transition-colors text-left">
              <BookOpen className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{turma.nome}</span>
              <span className="text-muted-foreground ml-auto text-[10px] shrink-0">{turma.professor}</span>
            </button>
          ))}
        </div>
      )}
      {results.produtos.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">Produtos</p>
          {results.produtos.map((produto) => (
            <button key={produto.id} onClick={() => onSelect('/produtos')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent/30 transition-colors text-left">
              <Package className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{produto.nome}</span>
              <span className="text-muted-foreground ml-auto text-[10px] shrink-0">R$ {produto.preco.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
