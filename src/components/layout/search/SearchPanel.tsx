import type { TopbarSearchResults } from './topbar-search.types';
import { SearchResults } from './SearchResults';

interface SearchPanelProps {
  query: string;
  isSearching: boolean;
  hasSearchError: boolean;
  hasResults: boolean;
  results: TopbarSearchResults | null;
  onSelect: (path: string) => void;
}

export function SearchPanel({
  query,
  isSearching,
  hasSearchError,
  hasResults,
  results,
  onSelect,
}: SearchPanelProps) {
  if (isSearching) {
    return <p className="p-4 text-center text-xs text-muted-foreground">Buscando...</p>;
  }

  if (hasSearchError) {
    return <p className="p-4 text-center text-xs text-destructive">Falha ao buscar. Tente novamente.</p>;
  }

  if (hasResults && results) {
    return <SearchResults results={results} onSelect={onSelect} />;
  }

  return (
    <p className="p-4 text-center text-xs text-muted-foreground">
      Nenhum resultado para “{query}”
    </p>
  );
}
