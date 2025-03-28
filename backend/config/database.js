const { Pool } = require('pg');
const { DATABASE_URL } = require('./env');
const caCert = fs.readFileSync('./ca.pem').toString(); // Replace './ca.pem' with the actual path to your downloaded certificate

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
});

module.exports = pool;
