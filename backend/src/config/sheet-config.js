export const SHEET_CONFIG = {
  Alunos: {
    name: 'Alunos',
    headers: [
      'id', 'nome', 'email', 'telefone', 'cpf', 'data_nascimento',
      'categoria', 'faixa_atual', 'status', 'plano', 'data_matricula',
      'responsavel_id', 'turma_ids', 'foto', 'observacoes', 'created_at',
    ],
  },
  Responsaveis: {
    name: 'Responsaveis',
    headers: ['id', 'nome', 'email', 'telefone', 'cpf', 'aluno_ids', 'observacoes', 'created_at'],
  },
  Turmas: {
    name: 'Turmas',
    headers: [
      'id', 'nome', 'modalidade', 'professor', 'horario',
      'dias_semana', 'capacidade', 'aluno_ids', 'status', 'created_at',
    ],
  },
  Aulas: {
    name: 'Aulas',
    headers: ['id', 'turma_id', 'data', 'professor', 'presencas', 'observacoes', 'created_at'],
  },
  Frequencia: {
    name: 'Frequencia',
    headers: ['id', 'aluno_id', 'turma_id', 'aula_id', 'data', 'presente', 'horario_chegada', 'observacoes', 'created_at'],
  },
  Graduacao: {
    name: 'Graduacao',
    headers: ['id', 'aluno_id', 'faixa_de', 'faixa_para', 'data', 'aprovado_por', 'observacoes', 'created_at'],
  },
  GraduacoesAlunos: {
    name: 'GraduacoesAlunos',
    headers: [
      'id', 'aluno_id', 'faixa_atual', 'proxima_faixa', 'aulas_realizadas',
      'aulas_necessarias', 'status', 'data_ultima_graduacao', 'created_at',
    ],
  },
  RegrasGraduacao: {
    name: 'RegrasGraduacao',
    headers: ['id', 'modalidade', 'faixa_origem', 'faixa_destino', 'categoria', 'aulas_minimas', 'meses_minimos', 'created_at'],
  },
  Ranking: {
    name: 'Ranking',
    headers: [
      'id', 'aluno_id', 'nome_aluno', 'categoria', 'posicao', 'posicao_anterior',
      'pontuacao', 'vitorias', 'medalhas', 'temporada', 'data_referencia', 'created_at',
    ],
  },
  Campeonatos: {
    name: 'Campeonatos',
    headers: ['id', 'nome', 'data', 'local', 'modalidade', 'status', 'participantes', 'custo_inscricao', 'created_at'],
  },
  Medalhas: {
    name: 'Medalhas',
    headers: ['id', 'aluno_id', 'campeonato_id', 'tipo_medalha', 'categoria', 'data_conquista', 'created_at'],
  },
  Financeiro: {
    name: 'Financeiro',
    headers: [
      'id', 'aluno_id', 'nome_aluno', 'tipo', 'descricao', 'valor', 'valor_pago',
      'data_vencimento', 'data_pagamento', 'status', 'forma_pagamento',
      'observacoes', 'comprovante_id', 'created_at',
    ],
  },
  Despesas: {
    name: 'Despesas',
    headers: ['id', 'descricao', 'categoria', 'valor', 'data', 'status', 'observacoes', 'created_at'],
  },
  Receitas: {
    name: 'Receitas',
    headers: ['id', 'descricao', 'categoria', 'valor', 'data', 'origem', 'observacoes', 'created_at'],
  },
  Produtos: {
    name: 'Produtos',
    headers: [
      'id', 'nome', 'descricao', 'sku', 'preco', 'preco_custo', 'estoque',
      'estoque_minimo', 'categoria', 'imagem', 'created_at',
    ],
  },
  Vendas: {
    name: 'Vendas',
    headers: [
      'id', 'data', 'comprador_nome', 'aluno_id', 'itens', 'total',
      'forma_pagamento', 'parcelado', 'quantidade_parcelas',
      'observacoes', 'comprovante_id', 'created_at',
    ],
  },
  Reservas: {
    name: 'Reservas',
    headers: [
      'id', 'espaco', 'locatario', 'data_inicio', 'data_fim',
      'hora_inicio', 'hora_fim', 'valor', 'status', 'conflito', 'observacoes', 'created_at',
    ],
  },
  Aluguel: {
    name: 'Aluguel',
    headers: [
      'id', 'locatario', 'espaco', 'valor', 'periodicidade',
      'data_inicio', 'data_fim', 'status', 'observacoes', 'created_at',
    ],
  },
  PagamentosContrato: {
    name: 'PagamentosContrato',
    headers: [
      'id', 'contrato_id', 'data_pagamento', 'valor', 'forma_pagamento',
      'referencia', 'observacoes', 'comprovante_id', 'created_at',
    ],
  },
  Professores: {
    name: 'Professores',
    headers: ['id', 'nome', 'cpf', 'telefone', 'email', 'especialidade', 'valor_hora', 'status', 'created_at'],
  },
};

export function detectSheetType(data) {
  if (data?.sheet_type && SHEET_CONFIG[data.sheet_type]) return data.sheet_type;
  if (data?.aluno_ids !== undefined && data?.cpf !== undefined) return 'Responsaveis';
  if (data?.turma_ids !== undefined || data?.data_matricula !== undefined || data?.plano !== undefined) return 'Alunos';
  if (data?.dias_semana !== undefined || data?.capacidade !== undefined) return 'Turmas';
  if (data?.presencas !== undefined) return 'Aulas';
  if (data?.presente !== undefined || data?.horario_chegada !== undefined) return 'Frequencia';
  if (data?.faixa_de !== undefined || data?.aprovado_por !== undefined) return 'Graduacao';
  if (data?.aulas_necessarias !== undefined || data?.proxima_faixa !== undefined) return 'GraduacoesAlunos';
  if (data?.faixa_origem !== undefined || data?.aulas_minimas !== undefined) return 'RegrasGraduacao';
  if (data?.pontuacao !== undefined || data?.posicao !== undefined || data?.temporada !== undefined) return 'Ranking';
  if (data?.participantes !== undefined || data?.custo_inscricao !== undefined) return 'Campeonatos';
  if (data?.tipo_medalha !== undefined) return 'Medalhas';
  if (data?.data_vencimento !== undefined || data?.valor_pago !== undefined) return 'Financeiro';
  if (data?.origem !== undefined) return 'Receitas';
  if (data?.categoria !== undefined && data?.valor !== undefined && data?.status === undefined) return 'Despesas';
  if (data?.sku !== undefined || data?.estoque !== undefined) return 'Produtos';
  if (data?.itens !== undefined || data?.comprador_nome !== undefined) return 'Vendas';
  if (data?.hora_inicio !== undefined || (data?.espaco !== undefined && data?.data_inicio !== undefined)) return 'Reservas';
  if (data?.contrato_id !== undefined) return 'PagamentosContrato';
  if (data?.periodicidade !== undefined) return 'Aluguel';
  if (data?.especialidade !== undefined || data?.valor_hora !== undefined) return 'Professores';
  return 'Alunos';
}

export const SHEET_TYPES = Object.keys(SHEET_CONFIG);
