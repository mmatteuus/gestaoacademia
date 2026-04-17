import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

let oauth2Client = null;

function initAuth() {
  if (!SPREADSHEET_ID || !CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('ATENÇÃO: Variáveis de ambiente não configuradas!');
    console.error('SPREADSHEET_ID:', SPREADSHEET_ID ? 'OK' : 'FALTANDO');
    console.error('GOOGLE_CLIENT_ID:', CLIENT_ID ? 'OK' : 'FALTANDO');
    console.error('GOOGLE_CLIENT_SECRET:', CLIENT_SECRET ? 'OK' : 'FALTANDO');
    console.error('GOOGLE_REFRESH_TOKEN:', REFRESH_TOKEN ? 'OK' : 'FALTANDO');
    return false;
  }
  
  oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  console.log('Google OAuth inicializado com sucesso');
  return true;
}

initAuth();

// Colunas em snake_case. Arrays e objetos aninhados são serializados como JSON string
// na camada adapter do frontend (ver src/services/adapters/*).
const SHEET_CONFIG = {
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
      'hora_inicio', 'hora_fim', 'valor', 'status', 'observacoes', 'created_at',
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

function getSheets() {
  if (!oauth2Client) {
    throw new Error('Google OAuth não inicializado. Configure as variáveis de ambiente.');
  }
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function listAllSheets() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  return res.data.sheets.map(s => s.properties.title);
}

function colLetter(n) {
  // 1 -> A, 26 -> Z, 27 -> AA
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

async function ensureSheetExists(sheetName, headers) {
  const sheets = getSheets();
  const existingSheets = await listAllSheets();
  const lastCol = colLetter(Math.max(headers.length, 1));

  if (!existingSheets.includes(sheetName)) {
    console.log(`Criando nova aba: ${sheetName}`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: { rowCount: 1000, columnCount: Math.max(headers.length + 4, 20) },
            },
          },
        }],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:${lastCol}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });
    return;
  }

  // Aba já existe: garante que o cabeçalho cobre todas as colunas esperadas.
  const headRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1:ZZ1`,
  });
  const current = (headRes.data.values && headRes.data.values[0]) || [];
  const missing = headers.filter(h => !current.includes(h));
  if (missing.length === 0) return;

  const merged = [...current];
  for (const h of missing) merged.push(h);
  console.log(`Patch de headers em [${sheetName}]: +${missing.join(', ')}`);
  const patchCol = colLetter(merged.length);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1:${patchCol}1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [merged] },
  });
}

function detectSheetType(data) {
  if (data.sheet_type && SHEET_CONFIG[data.sheet_type]) return data.sheet_type;
  // Heurísticas pela presença de colunas bem distintas. O frontend sempre envia
  // sheet_type, então isto só é exercitado por chamadas manuais / legacy.
  if (data.aluno_ids !== undefined && data.cpf !== undefined) return 'Responsaveis';
  if (data.turma_ids !== undefined || data.data_matricula !== undefined || data.plano !== undefined) return 'Alunos';
  if (data.dias_semana !== undefined || data.capacidade !== undefined) return 'Turmas';
  if (data.presencas !== undefined) return 'Aulas';
  if (data.presente !== undefined || data.horario_chegada !== undefined) return 'Frequencia';
  if (data.faixa_de !== undefined || data.aprovado_por !== undefined) return 'Graduacao';
  if (data.aulas_necessarias !== undefined || data.proxima_faixa !== undefined) return 'GraduacoesAlunos';
  if (data.faixa_origem !== undefined || data.aulas_minimas !== undefined) return 'RegrasGraduacao';
  if (data.pontuacao !== undefined || data.posicao !== undefined || data.temporada !== undefined) return 'Ranking';
  if (data.participantes !== undefined || data.custo_inscricao !== undefined) return 'Campeonatos';
  if (data.tipo_medalha !== undefined) return 'Medalhas';
  if (data.data_vencimento !== undefined || data.valor_pago !== undefined) return 'Financeiro';
  if (data.origem !== undefined) return 'Receitas';
  if (data.categoria !== undefined && data.valor !== undefined && data.status === undefined) return 'Despesas';
  if (data.sku !== undefined || data.estoque !== undefined) return 'Produtos';
  if (data.itens !== undefined || data.comprador_nome !== undefined) return 'Vendas';
  if (data.hora_inicio !== undefined || data.espaco !== undefined && data.data_inicio !== undefined) return 'Reservas';
  if (data.contrato_id !== undefined) return 'PagamentosContrato';
  if (data.periodicidade !== undefined) return 'Aluguel';
  if (data.especialidade !== undefined || data.valor_hora !== undefined) return 'Professores';
  return 'Alunos';
}

function rowToObject(headerRow, row, expectedHeaders) {
  const obj = {};
  // começa com as colunas esperadas (garantia de shape), depois sobrescreve com o que veio da planilha
  for (const h of expectedHeaders) obj[h] = '';
  headerRow.forEach((h, i) => { obj[h] = row[i] ?? ''; });
  return obj;
}

async function listRows(type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo inválido: ${type}`);

  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${config.name}!A1:ZZ1000`,
  });
  const values = res.data.values || [];
  if (values.length <= 1) return [];

  const [headerRow, ...rows] = values;
  return rows.map(r => rowToObject(headerRow, r, config.headers));
}

async function getRowById(id, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo inválido: ${type}`);

  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${config.name}!A1:ZZ1000`,
  });
  const values = res.data.values || [];
  if (values.length <= 1) return null;

  const [headerRow, ...rows] = values;
  const idIdx = headerRow.indexOf('id');
  if (idIdx < 0) return null;
  const match = rows.find(r => r[idIdx] === String(id));
  if (!match) return null;
  return rowToObject(headerRow, match, config.headers);
}

async function insertRow(data) {
  const type = detectSheetType(data);
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo não reconhecido para os dados: ${JSON.stringify(data)}`);

  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  if (!data.id) data.id = String(Date.now()) + '_' + Math.random().toString(36).slice(2, 8);
  if (!data.created_at) data.created_at = new Date().toISOString();

  // Lê o cabeçalho atual da planilha (pode ter colunas extras além do config).
  const headRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${config.name}!A1:ZZ1`,
  });
  const headerRow = (headRes.data.values && headRes.data.values[0]) || config.headers;
  const newRow = headerRow.map(h => (data[h] !== undefined && data[h] !== null ? String(data[h]) : ''));

  console.log(`Inserindo em [${config.name}]: ID=${data.id}, tipo=${type}`);

  const lastCol = colLetter(headerRow.length);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${config.name}!A:${lastCol}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [newRow] },
  });
  return { success: true, sheet: config.name, id: data.id };
}

async function updateRow(id, data, type = 'Alunos') {
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo inválido: ${type}`);

  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${config.name}!A1:ZZ1000`,
  });
  const values = res.data.values || [];
  if (values.length <= 1) return false;

  const [headerRow, ...rows] = values;
  const idIdx = headerRow.indexOf('id');
  if (idIdx < 0) return false;
  const rowIndex = rows.findIndex(r => r[idIdx] === String(id));
  if (rowIndex < 0) return false;

  const currentRow = rows[rowIndex];
  const updatedRow = headerRow.map((h, i) => {
    if (h === 'id') return id;
    if (data[h] !== undefined && data[h] !== null) return String(data[h]);
    return currentRow[i] ?? '';
  });

  const lastCol = colLetter(headerRow.length);
  const targetRange = `${config.name}!A${rowIndex + 2}:${lastCol}${rowIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: targetRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [updatedRow] },
  });
  return { success: true, sheet: config.name, id };
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === `file://${entryPath.replace(/\\/g, '/')}`) {
  (async () => {
    console.log('Abas disponíveis:', await listAllSheets());
    console.log('Alunos:', (await listRows('Alunos')).length);
    console.log('Financeiro:', (await listRows('Financeiro')).length);
    console.log('Aulas:', (await listRows('Aulas')).length);
  })();
}

export { oauth2Client, SPREADSHEET_ID, listRows, getRowById, insertRow, updateRow, SHEET_CONFIG, detectSheetType };
