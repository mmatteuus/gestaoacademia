import { Button } from '@/components/ui/button';

export const rankingCategories = [
  'Todas',
  'Adulto',
  'Juvenil',
  'Infantil',
  'Regras',
] as const;

export type RankingCategory = (typeof rankingCategories)[number];

interface RankingCategoryFilterProps {
  selected: RankingCategory;
  onSelect: (category: RankingCategory) => void;
}

export function RankingCategoryFilter({
  selected,
  onSelect,
}: RankingCategoryFilterProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {rankingCategories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? 'default' : 'secondary'}
          size="sm"
          className="min-h-[36px] shrink-0 text-xs"
          onClick={() => onSelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
