import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PWAUpdateDialogProps {
  open: boolean;
  updating: boolean;
  onDismiss: () => void;
  onUpdate: () => void;
}

export function PWAUpdateDialog({
  open,
  updating,
  onDismiss,
  onUpdate,
}: PWAUpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Nova versão disponível
          </DialogTitle>
          <DialogDescription>
            Uma nova versão do sistema está pronta. Atualize para receber as melhorias e correções mais recentes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={onDismiss} disabled={updating} className="flex-1">
            Mais tarde
          </Button>
          <Button onClick={onUpdate} disabled={updating} className="flex-1">
            {updating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {updating ? 'Atualizando...' : 'Atualizar agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
