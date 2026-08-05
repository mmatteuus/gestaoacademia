import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchPanel } from './SearchPanel';
import { useTopbarSearch } from './useTopbarSearch';

export function TopbarSearch() {
  const search = useTopbarSearch();
  const showPanel = search.query.trim().length >= 2;

  const panel = showPanel ? (
    <SearchPanel
      query={search.query}
      isSearching={search.isSearching}
      hasSearchError={search.hasSearchError}
      hasResults={search.hasResults}
      results={search.results}
      onSelect={search.selectResult}
    />
  ) : null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-muted-foreground md:hidden"
        onClick={() => search.setOpen(!search.open)}
        aria-label={search.open ? 'Fechar busca' : 'Abrir busca'}
        aria-expanded={search.open}
      >
        {search.open ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </Button>

      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={search.desktopInputRef}
          placeholder="Buscar alunos, turmas, produtos..."
          value={search.query}
          onChange={(event) => search.setQuery(event.target.value)}
          onFocus={() => search.setOpen(true)}
          className="h-9 w-72 border-border/50 bg-secondary/50 pl-9 text-sm focus:bg-secondary"
        />
        {search.open && panel && (
          <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
            {panel}
          </div>
        )}
      </div>

      {search.open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-card p-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={search.mobileInputRef}
              placeholder="Buscar alunos, turmas, produtos..."
              value={search.query}
              onChange={(event) => search.setQuery(event.target.value)}
              className="h-9 border-border/50 bg-secondary/50 pl-9 text-sm"
            />
          </div>
          {panel && (
            <div className="mt-2 overflow-hidden rounded-lg border border-border bg-card">
              {panel}
            </div>
          )}
        </div>
      )}
    </>
  );
}
