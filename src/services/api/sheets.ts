import { http } from './client';

export type SheetType =
  | 'Alunos'
  | 'Responsaveis'
  | 'Financeiro'
  | 'Despesas'
  | 'Receitas'
  | 'Aulas'
  | 'Frequencia'
  | 'GraduacoesAlunos'
  | 'RegrasGraduacao'
  | 'Ranking'
  | 'Turmas'
  | 'Graduacao'
  | 'Campeonatos'
  | 'Medalhas'
  | 'Produtos'
  | 'Vendas'
  | 'Reservas'
  | 'Aluguel'
  | 'PagamentosContrato'
  | 'Professores';

export type SheetRow = Record<string, string>;

export const sheets = {
  list: <T extends SheetRow = SheetRow>(type: SheetType) =>
    http.get<T[]>('/rows', { type }),

  getById: <T extends SheetRow = SheetRow>(type: SheetType, id: string) =>
    http.get<T>(`/rows/${encodeURIComponent(id)}`, { type }),

  create: (type: SheetType, data: Record<string, unknown>) =>
    http.post<{ ok: true }>('/rows', { ...data, sheet_type: type }),

  update: (type: SheetType, id: string, data: Record<string, unknown>) =>
    http.put<{ ok: true }>(`/rows/${encodeURIComponent(id)}`, data, { type }),

  status: () => http.get<{ status: string; sheets: string[] }>('/status'),

  /** Busca várias abas em UMA chamada Sheets (reduz drasticamente uso de quota). */
  batch: <T extends SheetRow = SheetRow>(types: SheetType[]) =>
    http.get<Record<string, T[]>>('/rows/batch', { types: types.join(',') }),
};
