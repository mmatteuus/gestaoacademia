import { ComprovanteDialog } from '@/components/shared/ComprovanteDialog';
import type { VendaDetalhada } from '../produtos.types';
import { buildComprovanteData } from '../produtos.utils';

interface VendaComprovanteDialogProps {
  venda: VendaDetalhada | null;
  onOpenChange: (open: boolean) => void;
}

export function VendaComprovanteDialog({ venda, onOpenChange }: VendaComprovanteDialogProps) {
  const data = venda ? buildComprovanteData(venda) : null;

  return (
    <ComprovanteDialog
      open={Boolean(venda)}
      onOpenChange={onOpenChange}
      title="Comprovante de compra e pagamento"
      subtitle={data?.subtitle || ''}
      fields={data?.fields || []}
      recipientPhone={data?.phone || ''}
      recipientName={data?.recipient || ''}
    />
  );
}
