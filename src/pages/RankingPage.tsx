import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  RankingCategoryFilter,
  type RankingCategory,
} from '@/features/insights/components/RankingCategoryFilter';
import { RankingDetailsDialog } from '@/features/insights/components/RankingDetailsDialog';
import { RankingList } from '@/features/insights/components/RankingList';
import { RankingRules } from '@/features/insights/components/RankingRules';
import { useInsightsData } from '@/features/insights/InsightsDataProvider';
import type { RankingEntry } from '@/types';

export default function RankingPage() {
  const { ranking } = useInsightsData();
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>('Todas');
  const [selectedEntry, setSelectedEntry] = useState<RankingEntry | null>(null);

  const filteredRanking = useMemo(() => {
    if (selectedCategory === 'Todas' || selectedCategory === 'Regras') {
      return ranking;
    }

    return ranking.filter((entry) => entry.categoria === selectedCategory);
  }, [ranking, selectedCategory]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ranking"
        subtitle="Classificação por temporada e categoria"
      />

      <RankingCategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {selectedCategory === 'Regras' ? (
        <RankingRules />
      ) : filteredRanking.length > 0 ? (
        <RankingList entries={filteredRanking} onSelect={setSelectedEntry} />
      ) : (
        <EmptyState
          title="Nenhum atleta nesta categoria"
          description="Selecione outra categoria ou cadastre atletas."
        />
      )}

      <RankingDetailsDialog
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
