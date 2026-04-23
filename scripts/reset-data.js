// Reset: apaga todos os dados de cada aba e deixa apenas header + 1 linha exemplo.
// Uso: node scripts/reset-data.js
// Requer .env com credenciais OAuth (mesmas que o server.js usa).

import { google } from 'googleapis';
import { env } from '../backend/src/config/env.js';
import { SHEET_CONFIG } from '../backend/src/config/sheet-config.js';

const now = new Date().toISOString();

// 1 exemplo por aba. Campos devem corresponder aos headers em sheet-config.js.
const EXAMPLES = {
  Alunos: {
    id: 'exemplo_aluno_1', nome: 'João Exemplo', email: 'joao@exemplo.com',
    telefone: '11999990001', cpf: '00000000000', data_nascimento: '2000-01-15',
    categoria: 'Adulto', faixa_atual: 'Branca', status: 'ativo', plano: 'Mensal',
    data_matricula: '2026-01-10', responsavel_id: '', turma_ids: 'exemplo_turma_1',
    foto: '', observacoes: 'Linha de exemplo', created_at: now,
  },
  Responsaveis: {
    id: 'exemplo_resp_1', nome: 'Maria Exemplo', email: 'maria@exemplo.com',
    telefone: '11999990002', cpf: '00000000001', aluno_ids: 'exemplo_aluno_1',
    observacoes: 'Linha de exemplo', created_at: now,
  },
  Turmas: {
    id: 'exemplo_turma_1', nome: 'Infantil Manhã', modalidade: 'Jiu-Jitsu',
    professor: 'Prof. Exemplo', horario: '08:00-09:00', dias_semana: 'Seg,Qua',
    capacidade: 20, aluno_ids: 'exemplo_aluno_1', status: 'ativa', created_at: now,
  },
  Aulas: {
    id: 'exemplo_aula_1', turma_id: 'exemplo_turma_1', data: '2026-04-22',
    professor: 'Prof. Exemplo', presencas: 'exemplo_aluno_1',
    observacoes: 'Linha de exemplo', created_at: now,
  },
  Frequencia: {
    id: 'exemplo_freq_1', aluno_id: 'exemplo_aluno_1', turma_id: 'exemplo_turma_1',
    aula_id: 'exemplo_aula_1', data: '2026-04-22', presente: true,
    horario_chegada: '08:00', observacoes: 'Linha de exemplo', created_at: now,
  },
  Graduacao: {
    id: 'exemplo_grad_1', aluno_id: 'exemplo_aluno_1', faixa_de: 'Branca',
    faixa_para: 'Cinza', data: '2026-03-15', aprovado_por: 'Prof. Exemplo',
    observacoes: 'Linha de exemplo', created_at: now,
  },
  GraduacoesAlunos: {
    id: 'exemplo_ga_1', aluno_id: 'exemplo_aluno_1', faixa_atual: 'Branca',
    proxima_faixa: 'Cinza', aulas_realizadas: 12, aulas_necessarias: 40,
    status: 'em_progresso', data_ultima_graduacao: '2026-01-10', created_at: now,
  },
  RegrasGraduacao: {
    id: 'exemplo_regra_1', modalidade: 'Jiu-Jitsu', faixa_origem: 'Branca',
    faixa_destino: 'Cinza', categoria: 'Infantil', aulas_minimas: 40,
    meses_minimos: 6, created_at: now,
  },
  Ranking: {
    id: 'exemplo_rank_1', aluno_id: 'exemplo_aluno_1', nome_aluno: 'João Exemplo',
    categoria: 'Adulto', posicao: 1, posicao_anterior: 1, pontuacao: 100,
    vitorias: 5, medalhas: 2, temporada: '2026', data_referencia: '2026-04-22',
    created_at: now,
  },
  Campeonatos: {
    id: 'exemplo_camp_1', nome: 'Campeonato Exemplo', data: '2026-06-15',
    local: 'Ginásio Exemplo', modalidade: 'Jiu-Jitsu', status: 'agendado',
    participantes: 'exemplo_aluno_1', custo_inscricao: 50, created_at: now,
  },
  Medalhas: {
    id: 'exemplo_med_1', aluno_id: 'exemplo_aluno_1', campeonato_id: 'exemplo_camp_1',
    tipo_medalha: 'ouro', categoria: 'Adulto', data_conquista: '2026-03-01',
    created_at: now,
  },
  Financeiro: {
    id: 'exemplo_fin_1', aluno_id: 'exemplo_aluno_1', nome_aluno: 'João Exemplo',
    tipo: 'mensalidade', descricao: 'Mensalidade Abril', valor: 200, valor_pago: 200,
    data_vencimento: '2026-04-10', data_pagamento: '2026-04-08', status: 'pago',
    forma_pagamento: 'pix', observacoes: 'Linha de exemplo', comprovante_id: '',
    created_at: now,
  },
  Despesas: {
    id: 'exemplo_desp_1', descricao: 'Aluguel do tatame', categoria: 'fixa',
    valor: 1500, data: '2026-04-05', status: 'pago', observacoes: 'Linha de exemplo',
    created_at: now,
  },
  Receitas: {
    id: 'exemplo_rec_1', descricao: 'Mensalidades Abril', categoria: 'mensalidade',
    valor: 2000, data: '2026-04-10', origem: 'alunos', observacoes: 'Linha de exemplo',
    created_at: now,
  },
  Produtos: {
    id: 'exemplo_prod_1', nome: 'Kimono Branco', descricao: 'Kimono trançado A2',
    sku: 'KIM-A2-BRC', preco: 350, preco_custo: 220, estoque: 10,
    estoque_minimo: 2, categoria: 'vestuário', imagem: '', created_at: now,
  },
  Vendas: {
    id: 'exemplo_venda_1', data: '2026-04-20', comprador_nome: 'João Exemplo',
    aluno_id: 'exemplo_aluno_1', itens: 'exemplo_prod_1:1', total: 350,
    forma_pagamento: 'pix', parcelado: false, quantidade_parcelas: 1,
    observacoes: 'Linha de exemplo', comprovante_id: '', created_at: now,
  },
  Reservas: {
    id: 'exemplo_res_1', espaco: 'Sala 1', locatario: 'Cliente Exemplo',
    data_inicio: '2026-05-01', data_fim: '2026-05-01', hora_inicio: '14:00',
    hora_fim: '16:00', valor: 150, status: 'confirmada', conflito: false,
    observacoes: 'Linha de exemplo', created_at: now,
  },
  Aluguel: {
    id: 'exemplo_alu_1', locatario: 'Locatário Exemplo', espaco: 'Sala 2',
    valor: 800, periodicidade: 'mensal', data_inicio: '2026-01-01',
    data_fim: '2026-12-31', status: 'ativo', observacoes: 'Linha de exemplo',
    created_at: now,
  },
  PagamentosContrato: {
    id: 'exemplo_pc_1', contrato_id: 'exemplo_alu_1', data_pagamento: '2026-04-05',
    valor: 800, forma_pagamento: 'pix', referencia: 'Abril/2026',
    observacoes: 'Linha de exemplo', comprovante_id: '', created_at: now,
  },
  Professores: {
    id: 'exemplo_prof_1', nome: 'Prof. Exemplo', cpf: '00000000002',
    telefone: '11999990003', email: 'prof@exemplo.com', especialidade: 'Jiu-Jitsu',
    valor_hora: 80, status: 'ativo', created_at: now,
  },
};

function buildAuth() {
  const oauth2 = new google.auth.OAuth2(env.googleClientId, env.googleClientSecret);
  oauth2.setCredentials({ refresh_token: env.googleRefreshToken });
  return oauth2;
}

async function resetSheet(sheets, sheetName, headers, example) {
  const range = `${sheetName}!A:ZZ`;
  await sheets.spreadsheets.values.clear({
    spreadsheetId: env.spreadsheetId,
    range,
  });
  const row = headers.map((h) => {
    const v = example[h];
    if (v === undefined || v === null) return '';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    return String(v);
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [headers, row] },
  });
  return row.length;
}

async function main() {
  const auth = buildAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const entries = Object.entries(SHEET_CONFIG);
  console.log(`Iniciando reset de ${entries.length} abas...`);
  for (const [key, cfg] of entries) {
    const example = EXAMPLES[key];
    if (!example) {
      console.log(`  - ${cfg.name}: SEM exemplo definido, pulando`);
      continue;
    }
    try {
      const cols = await resetSheet(sheets, cfg.name, cfg.headers, example);
      console.log(`  ✓ ${cfg.name} reset (${cols} colunas, 1 exemplo)`);
      // Pequeno delay para respeitar quota Sheets (60 writes/min/user).
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error(`  ✗ ${cfg.name} FALHOU:`, err?.message || err);
    }
  }
  console.log('Concluído.');
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
