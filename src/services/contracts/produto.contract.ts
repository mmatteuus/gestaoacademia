export interface ProdutoDTO {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoria: string;
  imagem?: string;
}

export interface CreateProdutoDTO {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoria: string;
}

export interface UpdateProdutoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
  estoqueMinimo?: number;
  categoria?: string;
}
