import { z } from 'zod';
import { insertRow } from '../repositories/sheets.repository.js';
import { logger } from '../lib/logger.js';

/**
 * Endpoint público para cadastro de aluno via formulário compartilhado.
 * Aceita SEM API key (rota expressamente pública).
 *
 * Cria SEMPRE como `pre-cadastro`. Admin precisa promover via UI depois.
 */
const cadastroSchema = z.object({
  nome: z.string().min(2).max(120),
  email: z.string().email().max(120).optional().or(z.literal('')),
  telefone: z.string().min(8).max(40),
  cpf: z.string().min(8).max(20).optional().or(z.literal('')),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  categoria: z.enum(['Adulto', 'Juvenil', 'Infantil']).optional().or(z.literal('')),
  faixa_atual: z.string().max(40).optional().or(z.literal('')),
  observacoes: z.string().max(500).optional().or(z.literal('')),
});

export async function publicCadastroAlunoController(req, res) {
  const parsed = cadastroSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: 'validation_error',
      message: 'Dados inválidos no formulário.',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;
  const id = `precad_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    await insertRow({
      sheet_type: 'Alunos',
      id,
      nome: data.nome.trim(),
      email: (data.email || '').trim(),
      telefone: data.telefone.trim(),
      cpf: (data.cpf || '').trim(),
      data_nascimento: data.data_nascimento || '',
      categoria: data.categoria || '',
      faixa_atual: data.faixa_atual || 'Branca',
      status: 'pre-cadastro',
      plano: '',
      data_matricula: new Date().toISOString().slice(0, 10),
      turma_ids: '',
      observacoes: `[Pré-cadastro via formulário público] ${data.observacoes || ''}`.trim(),
    });

    logger.info({ context: 'public_aluno_cadastro_created', id });
    return res.status(201).json({ ok: true, id, message: 'Cadastro recebido com sucesso!' });
  } catch (err) {
    logger.error({ context: 'public_aluno_cadastro_failed', message: err?.message });
    return res.status(500).json({ ok: false, error: 'operation_failed', message: 'Não foi possível salvar.' });
  }
}
