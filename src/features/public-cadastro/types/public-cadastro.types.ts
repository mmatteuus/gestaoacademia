export interface PublicCadastroFormValues {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  categoria: string;
  faixa_atual: string;
  observacoes: string;
}

export type PublicCadastroField = keyof PublicCadastroFormValues;
