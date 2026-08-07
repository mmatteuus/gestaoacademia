export interface TopbarAlunoResult {
  id: string;
  nome: string;
  categoria: string;
}

export interface TopbarTurmaResult {
  id: string;
  nome: string;
  professor: string;
}

export interface TopbarProdutoResult {
  id: string;
  nome: string;
  preco: number;
}

export interface TopbarSearchResults {
  alunos: TopbarAlunoResult[];
  turmas: TopbarTurmaResult[];
  produtos: TopbarProdutoResult[];
}
