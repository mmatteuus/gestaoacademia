import type { PagamentoContratoAluguel, Reserva } from '@/types';

export type PagamentoContratoDetalhado = PagamentoContratoAluguel & {
  recipientPhone?: string;
};

export type ReservaDetalhada = Reserva & {
  locatarioTelefone?: string;
};

export interface ComprovanteAluguelState {
  open: boolean;
  subtitle: string;
  fields: { label: string; value: string }[];
  phone: string;
  recipient: string;
}
