const mysql = require('mysql2/promise');
const fs = require('fs');

async function importSQL() {
  // Connect to the database directly
  const conn = await mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'medicarestore',
    multipleStatements: true 
  });
  
  let sql = fs.readFileSync('D:\\AmitPharma\\MediCareStore\\database\\medicarestore.sql', 'utf8');
  
  // Remove the CREATE DATABASE and USE statements since we are already connected
  sql = sql.replace(/CREATE DATABASE[^;]+;/gi, '');
  sql = sql.replace(/USE[^;]+;/gi, '');
  
  try {
    await conn.query(sql);
    console.log('SUCCESS: All tables imported');
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  await conn.end();
}
importSQL().catch(e => console.error('FATAL:', e.message));
