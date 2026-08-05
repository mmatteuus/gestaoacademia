import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlunosPaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function AlunosPagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: AlunosPaginationProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="secondary" size="sm" className="h-8" onClick={onPrevious} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-muted-foreground">Página {page} de {totalPages}</span>
      <Button variant="secondary" size="sm" className="h-8" onClick={onNext} disabled={page >= totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
