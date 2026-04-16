import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Share2 } from 'lucide-react';

interface ComprovanteField {
  label: string;
  value: string;
}

interface ComprovanteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  fields: ComprovanteField[];
}

export function ComprovanteDialog({ open, onOpenChange, title, subtitle, fields }: ComprovanteDialogProps) {
  const comprovanteText = useMemo(() => {
    const lines = [title, subtitle, '', ...fields.map((field) => `${field.label}: ${field.value}`)];
    return lines.join('\n');
  }, [fields, subtitle, title]);

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title,
          text: comprovanteText,
        });
        toast.success('Comprovante pronto para envio.');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(comprovanteText);
        toast.success('Comprovante copiado. Cole na conversa com o cliente.');
        return;
      }

      toast.error('Não foi possível compartilhar neste dispositivo.');
    } catch {
      toast.error('O envio do comprovante foi cancelado ou falhou.');
    }
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(comprovanteText);
        toast.success('Comprovante copiado com sucesso.');
        return;
      }
      toast.error('Área de transferência não disponível neste dispositivo.');
    } catch {
      toast.error('Não foi possível copiar o comprovante.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
          <div className="border-b border-border pb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Comprovante</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{subtitle}</p>
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.label} className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 text-xs">
                <span className="text-muted-foreground">{field.label}</span>
                <span className="text-right font-medium text-foreground">{field.value}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={handleShare} className="text-xs">
            <Share2 className="mr-1 h-3.5 w-3.5" />
            Enviar ao cliente
          </Button>
          <Button variant="ghost" onClick={handleCopy} className="text-xs">
            <Copy className="mr-1 h-3.5 w-3.5" />
            Copiar comprovante
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="text-xs">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
