export interface SheetRow {
  id: string;
  nome: string;
  email: string;
  status: 'ativo' | 'inativo' | 'pendente';
  created_at: string;
}

export interface InsertRowData {
  id?: string;
  nome: string;
  email: string;
  status?: string;
  created_at?: string;
}
