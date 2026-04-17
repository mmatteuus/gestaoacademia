import { z } from 'zod';

export const alunoSchema = z.object({
  nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  telefone: z.string().trim().min(10, 'Telefone inválido').max(20),
  cpf: z.string().trim().min(11, 'CPF inválido').max(18),
  dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
  faixaAtual: z.string().min(1, 'Faixa obrigatória'),
  status: z.enum(['pre-cadastro', 'ativo', 'trancado', 'inadimplente', 'inativo']),
  // null means no responsible selected.
  responsavelId: z.string().trim().min(1).nullable(),
  turmaIds: z.array(z.string()).default([]),
  observacoes: z.string().max(500).optional(),
});

export type AlunoSchema = typeof alunoSchema;
