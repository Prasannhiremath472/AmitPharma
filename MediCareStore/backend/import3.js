const mysql = require('mysql2/promise');
const fs = require('fs');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost', user: 'root', password: '',
    database: 'medicarestore'
  });

  const raw = fs.readFileSync('D:\\AmitPharma\\MediCareStore\\database\\medicarestore.sql', 'utf8');
  
  // Simple split by semicolon at end of line
  const parts = raw.split(/;\s*\n/);
  
  console.log('Parts:', parts.length);
  
  let ok=0, skip=0, err=0;
  for (let part of parts) {
    part = part.trim();
    if (!part || part.startsWith('--') || part.startsWith('/*')) { skip++; continue; }
    // Skip DB-level
    if (/^(CREATE DATABASE|USE\s+)/i.test(part)) { skip++; continue; }
    
    try {
      await conn.query(part);
      console.log('OK:', part.substring(0,50));
      ok++;
    } catch(e) {
      if (e.message.includes('already exists') || e.message.includes('Duplicate')) {
        skip++;
      } else {
        console.error('ERR:', e.message.substring(0,100));
        err++;
      }
    }
  }
  await conn.end();
  console.log(`\nResult: ${ok} OK, ${skip} skipped, ${err} errors`);
}
run().catch(e => console.error('FATAL:', e.message));
