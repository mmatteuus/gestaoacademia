import { google } from 'googleapis';

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

const SHEET_CONFIG = {
  Alunos: { name: 'Alunos', headers: ['id', 'nome', 'email', 'telefone', 'status', 'plano', 'data_matricula', 'created_at'] },
  Financeiro: { name: 'Financeiro', headers: ['id', 'aluno_id', 'descricao', 'valor', 'status_pagamento', 'data_vencimento', 'data_pagamento', 'created_at'] },
  Aulas: { name: 'Aulas', headers: ['id', 'aluno_id', 'nome_aula', 'instrutor', 'data_assistida', 'duracao_min', 'observacoes', 'created_at'] },
  Frequencia: { name: 'Frequencia', headers: ['id', 'aluno_id', 'aula_id', 'data', 'presente', 'horario_chegada', 'observacoes', 'created_at'] },
  Ranking: { name: 'Ranking', headers: ['id', 'aluno_id', 'pontuacao', 'categoria', 'posicao', 'data_referencia', 'descricao', 'created_at'] },
  Turmas: { name: 'Turmas', headers: ['id', 'nome_turma', 'instrutor', 'horario_inicio', 'horario_fim', 'dias_semana', 'capacidade_max', 'status', 'created_at'] },
  Graduacao: { name: 'Graduacao', headers: ['id', 'aluno_id', 'faixa_atual', 'data_graduacao', 'grau', 'instrutor_responsavel', 'observacoes', 'created_at'] },
  Campeonatos: { name: 'Campeonatos', headers: ['id', 'nome_evento', 'data_inicio', 'local', 'custo_inscricao', 'status', 'created_at'] },
  Medalhas: { name: 'Medalhas', headers: ['id', 'aluno_id', 'campeonato_id', 'tipo_medalha', 'categoria', 'data_conquista', 'created_at'] },
  Produtos: { name: 'Produtos', headers: ['id', 'nome_produto', 'sku', 'preco_custo', 'preco_venda', 'quantidade_estoque', 'estoque_minimo', 'created_at'] },
  Vendas: { name: 'Vendas', headers: ['id', 'aluno_id', 'produto_id', 'quantidade', 'valor_total', 'data_venda', 'metodo_pagamento', 'created_at'] },
  Aluguel: { name: 'Aluguel', headers: ['id', 'locatario', 'data_inicio', 'data_fim', 'horario', 'valor_aluguel', 'status_pagamento', 'finalidade', 'created_at'] },
  Professores: { name: 'Professores', headers: ['id', 'nome', 'cpf', 'telefone', 'email', 'especialidade', 'valor_hora', 'status', 'created_at'] }
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

async function ensureSheetExists(sheetName, headers) {
  const sheets = getSheets();
  const existingSheets = await listAllSheets();
  
  if (!existingSheets.includes(sheetName)) {
    console.log(`Criando nova aba: ${sheetName}`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: { rowCount: 1000, columnCount: 20 }
            }
          }
        }]
      }
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:Z1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] }
    });
  }
}

function detectSheetType(data) {
  if (data.sheet_type) return data.sheet_type;
  if (data.plano !== undefined || data.data_matricula !== undefined) return 'Alunos';
  if (data.valor !== undefined || data.status_pagamento !== undefined) return 'Financeiro';
  if (data.nome_aula !== undefined || data.duracao_min !== undefined) return 'Aulas';
  if (data.presente !== undefined || data.horario_chegada !== undefined) return 'Frequencia';
  if (data.pontuacao !== undefined || data.posicao !== undefined) return 'Ranking';
  if (data.nome_turma !== undefined || data.dias_semana !== undefined) return 'Turmas';
  if (data.faixa_atual !== undefined || data.grau !== undefined) return 'Graduacao';
  if (data.nome_evento !== undefined || data.custo_inscricao !== undefined) return 'Campeonatos';
  if (data.tipo_medalha !== undefined || data.campeonato_id !== undefined) return 'Medalhas';
  if (data.nome_produto !== undefined || data.sku !== undefined) return 'Produtos';
  if (data.produto_id !== undefined || data.metodo_pagamento !== undefined) return 'Vendas';
  if (data.locatario !== undefined || data.valor_aluguel !== undefined) return 'Aluguel';
  if (data.especialidade !== undefined || data.cpf !== undefined) return 'Professores';
  return 'Alunos';
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
  
  const [header, ...rows] = values;
  return rows.map(row => {
    const obj = {};
    config.headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
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
  
  const [header, ...rows] = values;
  const idIdx = header.indexOf('id');
  const match = rows.find(r => r[idIdx] === String(id));
  
  if (!match) return null;
  const obj = {};
  config.headers.forEach((h, i) => { obj[h] = match[i] || ''; });
  return obj;
}

async function insertRow(data) {
  const type = detectSheetType(data);
  const config = SHEET_CONFIG[type];
  if (!config) throw new Error(`Tipo não reconhecido para os dados: ${JSON.stringify(data)}`);
  
  const sheets = getSheets();
  await ensureSheetExists(config.name, config.headers);
  
  if (!data.id) data.id = String(Date.now()) + '_' + Math.random().toString(36).slice(2, 8);
  if (!data.created_at) data.created_at = new Date().toISOString();

  const newRow = config.headers.map(h => {
    if (h === 'id' && !data.id) return data.id;
    return data[h] !== undefined ? String(data[h]) : '';
  });
  
  console.log(`Inserindo em [${config.name}]: ${JSON.stringify({id: data.id, ...Object.fromEntries(config.headers.slice(1,4).map(h => [h, data[h]])))}`);
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${config.name}!A:Z`,
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
    range: `${config.name}!A1:ZZ1000` 
  });
  const values = res.data.values || [];
  if (values.length <= 1) return false;

  const [header, ...rows] = values;
  const idIdx = header.indexOf('id');
  const rowIndex = rows.findIndex(r => r[idIdx] === String(id));
  if (rowIndex < 0) return false;

  const currentRow = rows[rowIndex];
  const updatedRow = config.headers.map((h, i) => {
    if (h === 'id') return id;
    if (data[h] !== undefined) return String(data[h]);
    return currentRow[i] || '';
  });

  const targetRange = `${config.name}!A${rowIndex + 2}:${String.fromCharCode(65 + config.headers.length - 1)}${rowIndex + 2}`;
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: targetRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [updatedRow] },
  });
  return { success: true, sheet: config.name, id };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  (async () => {
    console.log('Abas disponíveis:', await listAllSheets());
    console.log('Alunos:', (await listRows('Alunos')).length);
    console.log('Financeiro:', (await listRows('Financeiro')).length);
    console.log('Aulas:', (await listRows('Aulas')).length);
  })();
}

export { getAccessToken: () => oauth2Client.getAccessToken(), oauth2Client, SPREADSHEET_ID, listRows, getRowById, insertRow, updateRow, SHEET_CONFIG, detectSheetType };
