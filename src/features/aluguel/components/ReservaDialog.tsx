import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locatario: string;
  locatarioTelefone: string;
  espaco: string;
  dataInicio: string;
  horaInicio: string;
  horaFim: string;
  valor: string;
  onLocatarioChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onEspacoChange: (value: string) => void;
  onDataChange: (value: string) => void;
  onHoraInicioChange: (value: string) => void;
  onHoraFimChange: (value: string) => void;
  onValorChange: (value: string) => void;
  onSave: () => void;
}

export function ReservaDialog(props: Props) {
  const inputClass = 'h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-base text-foreground md:text-sm';
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader><DialogTitle>Nova reserva</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
          <Field label="Locatário / Cliente *" wide><input value={props.locatario} onChange={(e) => props.onLocatarioChange(e.target.value)} className={inputClass} /></Field>
          <Field label="Telefone do cliente" wide><div className="relative"><Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={props.locatarioTelefone} onChange={(e) => props.onTelefoneChange(e.target.value)} className={`${inputClass} pl-9`} /></div></Field>
          <Field label="Espaço *" wide><select value={props.espaco} onChange={(e) => props.onEspacoChange(e.target.value)} className={inputClass}><option>Tatame Principal</option><option>Área de Musculação</option><option>Sala Multiuso</option></select></Field>
          <Field label="Data *" wide><input type="date" value={props.dataInicio} onChange={(e) => props.onDataChange(e.target.value)} className={inputClass} /></Field>
          <Field label="Hora início *"><input type="time" value={props.horaInicio} onChange={(e) => props.onHoraInicioChange(e.target.value)} className={inputClass} /></Field>
          <Field label="Hora fim *"><input type="time" value={props.horaFim} onChange={(e) => props.onHoraFimChange(e.target.value)} className={inputClass} /></Field>
          <Field label="Valor aluguel (R$) *" wide><input type="number" min="0" step="0.01" value={props.valor} onChange={(e) => props.onValorChange(e.target.value)} className={inputClass} /></Field>
        </div>
        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row"><Button variant="ghost" onClick={() => props.onOpenChange(false)}>Cancelar</Button><Button onClick={props.onSave}>Confirmar reserva</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <div className={wide ? 'sm:col-span-2' : ''}><label className="mb-1 block text-xs text-muted-foreground">{label}</label>{children}</div>;
}
