import { ProdutoForm } from '@/components/forms/ProdutoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Produto } from '@/types';

interface ProdutoFormDialogProps {
  open: boolean;
  produto?: Produto;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Produto>) => Promise<void>;
}

export function ProdutoFormDialog({
  open,
  produto,
  onOpenChange,
  onSubmit,
}: ProdutoFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {produto ? 'Editar produto' : 'Novo produto'}
          </DialogTitle>
        </DialogHeader>
        <ProdutoForm
          produto={produto}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
