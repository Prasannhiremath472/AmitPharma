const mysql = require('mysql2/promise');
async function reset() {
  // Drop and recreate the database cleanly
  const conn = await mysql.createConnection({host:'localhost', user:'root', password:''});
  await conn.query('DROP DATABASE IF EXISTS medicarestore');
  await conn.query('CREATE DATABASE medicarestore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
  console.log('Database reset clean');
  await conn.end();
}
reset().catch(e => console.error('ERROR:', e.message));
