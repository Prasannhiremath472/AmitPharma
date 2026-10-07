const mysql = require('mysql2/promise');
const fs = require('fs');

async function importSQL() {
  const conn = await mysql.createConnection({ 
    host: 'localhost', user: 'root', password: '', multipleStatements: true 
  });
  const sql = fs.readFileSync('D:\\AmitPharma\\MediCareStore\\database\\medicarestore.sql', 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
  
  let ok = 0, fail = 0;
  for (const stmt of statements) {
    try { await conn.query(stmt); ok++; }
    catch(e) {
      if (!e.message.includes('already exists') && !e.message.includes('Duplicate')) {
        console.warn('WARN:', e.message.substring(0,80));
        fail++;
      }
    }
  }
  await conn.end();
  console.log('Import done:', ok, 'OK,', fail, 'failed');
}
importSQL().catch(e => console.error('FATAL:', e.message));
