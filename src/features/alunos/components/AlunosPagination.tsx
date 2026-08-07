import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlunosPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AlunosPagination({ page, totalPages, onPageChange }: AlunosPaginationProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-8"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-muted-foreground">
        Página {page} de {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-8"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
