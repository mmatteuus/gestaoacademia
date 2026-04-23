import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:3000';
const API_KEY = process.env.API_KEY;

async function testBatch() {
  console.log('Testing batch endpoint...');
  try {
    const res = await axios.get(`${API_URL}/rows/batch`, {
      params: { types: 'Alunos,Financeiro,Aulas' },
      headers: API_KEY ? { 'X-API-Key': API_KEY } : {}
    });
    console.log('Status:', res.status);
    console.log('Keys in response:', Object.keys(res.data));
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data || err.message);
  }
}

testBatch();
