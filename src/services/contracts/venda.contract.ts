export interface VendaDTO {
  id: string;
  data: string;
  itens: { produtoId: string; nomeProduto: string; quantidade: number; precoUnitario: number }[];
  total: number;
  compradorNome: string;
  formaPagamento: string;
}

export interface CreateVendaDTO {
  itens: { produtoId: string; quantidade: number; precoUnitario: number }[];
  compradorNome: string;
  formaPagamento: string;
}

export interface ItemVendaDTO {
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}
