const mysql = require('mysql2/promise');
async function check() {
  const conn = await mysql.createConnection({host:'localhost',user:'root',password:'',database:'medicarestore'});
  const [rows] = await conn.query('SHOW TABLES');
  console.log('Tables in medicarestore:');
  rows.forEach(r => console.log(' -', Object.values(r)[0]));
  
  // Check user count
  const [users] = await conn.query('SELECT COUNT(*) as cnt FROM users');
  console.log('\nUsers:', users[0].cnt);
  const [cats] = await conn.query('SELECT COUNT(*) as cnt FROM categories');
  console.log('Categories:', cats[0].cnt);
  const [prods] = await conn.query('SELECT COUNT(*) as cnt FROM products');
  console.log('Products:', prods[0].cnt);
  await conn.end();
}
check().catch(e => console.error('ERROR:', e.message));
