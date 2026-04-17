import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const allSheets = {
  'Alunos': ['id', 'nome', 'email', 'telefone', 'status', 'plano', 'data_matricula', 'created_at'],
  'Financeiro': ['id', 'aluno_id', 'descricao', 'valor', 'status_pagamento', 'data_vencimento', 'data_pagamento', 'created_at'],
  'Aulas': ['id', 'aluno_id', 'nome_aula', 'instrutor', 'data_assistida', 'duracao_min', 'observacoes', 'created_at'],
  'Frequencia': ['id', 'aluno_id', 'aula_id', 'data', 'presente', 'horario_chegada', 'observacoes', 'created_at'],
  'Ranking': ['id', 'aluno_id', 'pontuacao', 'categoria', 'posicao', 'data_referencia', 'descricao', 'created_at'],
  'Turmas': ['id', 'nome_turma', 'instrutor', 'horario_inicio', 'horario_fim', 'dias_semana', 'capacidade_max', 'status', 'created_at'],
  'Graduacao': ['id', 'aluno_id', 'faixa_atual', 'data_graduacao', 'grau', 'instrutor_responsavel', 'observacoes', 'created_at'],
  'Campeonatos': ['id', 'nome_evento', 'data_inicio', 'local', 'custo_inscricao', 'status', 'created_at'],
  'Medalhas': ['id', 'aluno_id', 'campeonato_id', 'tipo_medalha', 'categoria', 'data_conquista', 'created_at'],
  'Produtos': ['id', 'nome_produto', 'sku', 'preco_custo', 'preco_venda', 'quantidade_estoque', 'estoque_minimo', 'created_at'],
  'Vendas': ['id', 'aluno_id', 'produto_id', 'quantidade', 'valor_total', 'data_venda', 'metodo_pagamento', 'created_at'],
  'Aluguel': ['id', 'locatario', 'data_inicio', 'data_fim', 'horario', 'valor_aluguel', 'status_pagamento', 'finalidade', 'created_at'],
  'Professores': ['id', 'nome', 'cpf', 'telefone', 'email', 'especialidade', 'valor_hora', 'status', 'created_at']
};

(async () => {
  console.log('Verificando e criando abas no Google Sheets...\n');
  
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = res.data.sheets.map(s => s.properties.title);
  console.log('Abas existentes:', existing.join(', '));
  
  for (const [name, headers] of Object.entries(allSheets)) {
    if (!existing.includes(name)) {
      console.log(`Criando aba: ${name}`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: name,
                gridProperties: { rowCount: 1000, columnCount: 20 }
              }
            }
          }]
        }
      });
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${name}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] }
      });
      
      console.log(`  ✅ ${name} criada com ${headers.length} colunas`);
    } else {
      console.log(`  ✓ ${name} já existe`);
    }
  }
  
  console.log('\n✨ Todas as abas criadas com sucesso!');
  console.log('Abas disponíveis:', Object.keys(allSheets).join(', '));
})().catch(e => console.error('Erro:', e.message));