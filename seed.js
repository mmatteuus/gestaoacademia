import dotenv from 'dotenv';
import { insertRow } from './index.js';

dotenv.config();

(async () => {
  try {
    const now = new Date().toISOString();
    const sample = {
      id: String(Math.floor(Math.random() * 100000)),
      nome: 'Teste Insercao',
      email: 'teste.insercao@example.com',
      status: 'ativo',
      created_at: now,
    };
    console.log('Inserindo linha de exemplo:', sample);
    await insertRow(sample);
    console.log('Inserção concluída.');
  } catch (err) {
    console.error('Erro ao inserir:', err);
    process.exit(1);
  }
})();
