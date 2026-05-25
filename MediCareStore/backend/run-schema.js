/**
 * Database schema importer for MediCare Store
 */
const mysql = require('mysql2/promise');
const fs = require('fs');

async function runSchema() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medicarestore',
    multipleStatements: false
  });

  const sql = fs.readFileSync('D:\\AmitPharma\\MediCareStore\\database\\medicarestore.sql', 'utf8');

  // Split on semicolons
  const rawParts = sql.split(';');

  let ok = 0, skipped = 0, failed = 0;

  for (let part of rawParts) {
    // Strip leading/trailing whitespace
    let stmt = part.trim();

    // Strip leading comment lines (-- ...) to find actual SQL keyword
    stmt = stmt.replace(/^(--[^\n]*\n\s*)*/g, '').trim();

    // Skip empty or pure-comment blocks
    if (!stmt || stmt.startsWith('--') || stmt.length < 3) {
      skipped++;
      continue;
    }

    try {
      await conn.query(stmt);
      const preview = stmt.replace(/\s+/g, ' ').substring(0, 65);
      console.log(`  ✓ ${preview}`);
      ok++;
    } catch (e) {
      if (
        e.message.includes('already exists') ||
        e.message.includes('Duplicate entry') ||
        e.code === 'ER_DUP_ENTRY'
      ) {
        const preview = stmt.replace(/\s+/g, ' ').substring(0, 50);
        console.log(`  ~ skip (exists): ${preview}`);
        skipped++;
      } else {
        console.error(`  ✗ ERROR: ${e.message.substring(0, 120)}`);
        failed++;
      }
    }
  }

  await conn.end();
  console.log(`\n=== Done: ${ok} executed | ${skipped} skipped | ${failed} failed ===`);
}

runSchema().catch(e => console.error('FATAL:', e.message));
