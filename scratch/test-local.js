import fetch from 'node-fetch';

async function test() {
  console.log('Testing /status...');
  try {
    const res = await fetch('http://localhost:3000/status', { timeout: 5000 });
    const data = await res.json();
    console.log('Status response:', data);
  } catch (err) {
    console.error('Status failed:', err.message);
  }

  console.log('\nTesting /rows?type=Alunos...');
  try {
    const res = await fetch('http://localhost:3000/rows?type=Alunos', { timeout: 10000 });
    if (res.status === 200) {
      const data = await res.json();
      console.log('Alunos count:', Array.isArray(data) ? data.length : 'not an array');
    } else {
      console.error('Alunos failed with status:', res.status);
      const text = await res.text();
      console.error('Response:', text);
    }
  } catch (err) {
    console.error('Alunos failed:', err.message);
  }
}

test();
