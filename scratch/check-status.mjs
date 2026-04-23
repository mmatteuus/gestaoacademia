import fetch from 'node-fetch';

async function check() {
  try {
    console.log('Fetching status...');
    const resStatus = await fetch('http://localhost:3000/status');
    console.log('Status code:', resStatus.status);
    const dataStatus = await resStatus.json();
    console.log('Status Data:', dataStatus);

    console.log('\nFetching Alunos...');
    const resRows = await fetch('http://localhost:3000/rows?type=Alunos');
    console.log('Rows status code:', resRows.status);
    const dataRows = await resRows.json();
    console.log('Rows count:', Array.isArray(dataRows) ? dataRows.length : 'N/A');
    if (!resRows.ok) console.log('Rows Error:', dataRows);

    console.log('\nFetching Batch (Alunos,Turmas)...');
    const resBatch = await fetch('http://localhost:3000/rows/batch?types=Alunos,Turmas');
    console.log('Batch status code:', resBatch.status);
    const dataBatch = await resBatch.json();
    console.log('Batch types returned:', Object.keys(dataBatch));
    if (!resBatch.ok) console.log('Batch Error:', dataBatch);
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
