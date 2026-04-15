import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="text-xs">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
