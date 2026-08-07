import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CampeonatoFormField, CampeonatoFormValues } from '../types/campeonatos.types';

interface NovoCampeonatoDialogProps {
  open: boolean;
  values: CampeonatoFormValues;
  onOpenChange: (open: boolean) => void;
  onChange: (field: CampeonatoFormField, value: string) => void;
  onSubmit: () => void;
}

const inputClassName =
  'h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base text-foreground md:text-sm';

export function NovoCampeonatoDialog({
  open,
  values,
  onOpenChange,
  onChange,
  onSubmit,
}: NovoCampeonatoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Novo Campeonato</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label htmlFor="campeonato-nome" className="mb-1 block text-xs text-muted-foreground">
              Nome do evento *
            </label>
            <input
              id="campeonato-nome"
              type="text"
              value={values.nome}
              onChange={(event) => onChange('nome', event.target.value)}
              className={inputClassName}
              placeholder="Ex. Copa de Jiu-Jitsu"
            />
          </div>

          <div>
            <label htmlFor="campeonato-data" className="mb-1 block text-xs text-muted-foreground">
              Data *
            </label>
            <input
              id="campeonato-data"
              type="date"
              value={values.data}
              onChange={(event) => onChange('data', event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="campeonato-local" className="mb-1 block text-xs text-muted-foreground">
              Local
            </label>
            <input
              id="campeonato-local"
              type="text"
              value={values.local}
              onChange={(event) => onChange('local', event.target.value)}
              className={inputClassName}
              placeholder="Ex. Ginásio Municipal"
            />
          </div>

          <div>
            <label htmlFor="campeonato-modalidade" className="mb-1 block text-xs text-muted-foreground">
              Modalidade
            </label>
            <input
              id="campeonato-modalidade"
              type="text"
              value={values.modalidade}
              onChange={(event) => onChange('modalidade', event.target.value)}
              className={inputClassName}
              placeholder="Ex. Jiu-Jitsu"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>Agendar evento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
