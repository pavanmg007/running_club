const { Pool } = require('pg');
const { DATABASE_URL } = require('./env');
const fs = require('fs');
const caCert = fs.readFileSync('./ca.pem').toString();
console.log('DATABASE_URL', DATABASE_URL);
console.log('caCert', caCert);
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
});

module.exports = pool;
