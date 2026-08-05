import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlunos, useProdutos, useTurmas } from '@/services/queries';
import type { TopbarSearchResults } from './topbar-search.types';

export function useTopbarSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  const shouldQuery = open && normalizedQuery.length >= 2;

  const alunosQuery = useAlunos({ enabled: shouldQuery });
  const turmasQuery = useTurmas({ enabled: shouldQuery });
  const produtosQuery = useProdutos({ enabled: shouldQuery });

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      const target = mobile ? mobileInputRef.current : desktopInputRef.current;
      target?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  const results = useMemo<TopbarSearchResults | null>(() => {
    if (normalizedQuery.length < 2) return null;

    const alunos = (alunosQuery.list.data ?? [])
      .filter((item) => item.nome.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
      .slice(0, 4);
    const turmas = (turmasQuery.list.data ?? [])
      .filter((item) => item.nome.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
      .slice(0, 3);
    const produtos = (produtosQuery.list.data ?? [])
      .filter((item) => item.nome.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
      .slice(0, 3);

    return { alunos, turmas, produtos };
  }, [alunosQuery.list.data, normalizedQuery, produtosQuery.list.data, turmasQuery.list.data]);

  const isSearching =
    shouldQuery &&
    (alunosQuery.list.isLoading || turmasQuery.list.isLoading || produtosQuery.list.isLoading);
  const hasSearchError =
    shouldQuery &&
    (alunosQuery.list.isError || turmasQuery.list.isError || produtosQuery.list.isError);
  const hasResults = Boolean(
    results && (results.alunos.length || results.turmas.length || results.produtos.length),
  );

  const selectResult = (path: string) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  return {
    open,
    query,
    results,
    isSearching,
    hasSearchError,
    hasResults,
    desktopInputRef,
    mobileInputRef,
    setOpen,
    setQuery,
    selectResult,
  };
}
