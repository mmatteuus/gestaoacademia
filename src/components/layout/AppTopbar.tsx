import { useState, useRef, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell, X, Users, BookOpen, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { alunos, turmas, produtos } from '@/services/mocks/data';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/alunos': 'Alunos',
  '/turmas': 'Turmas',
  '/frequencia': 'Frequência',
  '/graduacao': 'Graduação',
  '/ranking': 'Ranking',
  '/campeonatos': 'Campeonatos',
  '/financeiro': 'Financeiro Escolar',
  '/financeiro-gerencial': 'Financeiro Gerencial',
  '/produtos': 'Produtos & Vendas',
  '/aluguel': 'Aluguel',
  '/relatorios': 'Relatórios',
};

export function AppTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Gêmeos Academia';
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const results = query.trim().length >= 2 ? {
    alunos: alunos.filter(a => a.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
    turmas: turmas.filter(t => t.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    produtos: produtos.filter(p => p.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
  } : null;

  const hasResults = results && (results.alunos.length > 0 || results.turmas.length > 0 || results.produtos.length > 0);

  const handleSelect = (path: string) => {
    navigate(path);
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-3 sm:px-4 bg-card/50 backdrop-blur-sm shrink-0 relative z-20">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <h2 className="text-sm font-semibold text-foreground truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile search toggle */}
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden text-muted-foreground" onClick={() => setSearchOpen(!searchOpen)}>
          {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>

        {/* Desktop search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Buscar alunos, turmas, produtos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            className="pl-9 w-72 h-9 text-sm bg-secondary/50 border-border/50 focus:bg-secondary"
          />
          {searchOpen && hasResults && (
            <div className="absolute top-full mt-1 right-0 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
              <SearchResults results={results} onSelect={handleSelect} />
            </div>
          )}
          {searchOpen && query.length >= 2 && !hasResults && (
            <div className="absolute top-full mt-1 right-0 w-80 bg-card border border-border rounded-lg shadow-xl p-4 z-50">
              <p className="text-xs text-muted-foreground text-center">Nenhum resultado para "{query}"</p>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-primary rounded-full text-[9px] text-primary-foreground flex items-center justify-center font-bold">3</span>
        </Button>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border p-3 md:hidden z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Buscar alunos, turmas, produtos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-9 h-10 text-base md:text-sm bg-secondary/50"
              autoFocus
            />
          </div>
          {hasResults && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              <SearchResults results={results} onSelect={handleSelect} />
            </div>
          )}
          {query.length >= 2 && !hasResults && (
            <p className="text-xs text-muted-foreground text-center mt-3">Nenhum resultado para "{query}"</p>
          )}
        </div>
      )}

      {/* Backdrop to close search */}
      {searchOpen && <div className="fixed inset-0 z-[-1]" onClick={() => { setSearchOpen(false); setQuery(''); }} />}
    </header>
  );
}

function SearchResults({ results, onSelect }: { results: { alunos: typeof alunos; turmas: typeof turmas; produtos: typeof produtos }; onSelect: (path: string) => void }) {
  return (
    <div className="divide-y divide-border">
      {results.alunos.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">Alunos</p>
          {results.alunos.map(a => (
            <button key={a.id} onClick={() => onSelect('/alunos')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent/30 transition-colors text-left">
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{a.nome}</span>
              <span className="text-muted-foreground ml-auto text-[10px] shrink-0">{a.categoria}</span>
            </button>
          ))}
        </div>
      )}
      {results.turmas.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">Turmas</p>
          {results.turmas.map(t => (
            <button key={t.id} onClick={() => onSelect('/turmas')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent/30 transition-colors text-left">
              <BookOpen className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{t.nome}</span>
              <span className="text-muted-foreground ml-auto text-[10px] shrink-0">{t.professor}</span>
            </button>
          ))}
        </div>
      )}
      {results.produtos.length > 0 && (
        <div className="p-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">Produtos</p>
          {results.produtos.map(p => (
            <button key={p.id} onClick={() => onSelect('/produtos')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent/30 transition-colors text-left">
              <Package className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{p.nome}</span>
              <span className="text-muted-foreground ml-auto text-[10px] shrink-0">R$ {p.preco.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
