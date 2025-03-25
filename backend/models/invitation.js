const pool = require('../config/database');

class Invitation {
  static async create({ code, email, club_id }) {
    const query = `
      INSERT INTO invitations (code, email, club_id, used)
      VALUES ($1, $2, $3, false)
      RETURNING *;
    `;
    const values = [code, email, club_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByCode(code) {
    const query = 'SELECT * FROM invitations WHERE code = $1;';
    const { rows } = await pool.query(query, [code]);
    return rows[0];
  }

  static async markAsUsed(code) {
    const query = 'UPDATE invitations SET used = true WHERE code = $1 RETURNING *;';
    const { rows } = await pool.query(query, [code]);
    return rows[0];
  }

  static async exists(code) {
    const query = 'SELECT EXISTS (SELECT 1 FROM invitations WHERE code = $1);';
    const { rows } = await pool.query(query, [code]);
    return rows[0].exists;
  }

  static async hasUnusedByEmail(email, club_id) {
    const query = 'SELECT EXISTS (SELECT 1 FROM invitations WHERE email = $1 AND club_id = $2 AND used = false);';
    const { rows } = await pool.query(query, [email, club_id]);
    return rows[0].exists;
  }

  // New method for bulk creation
  static async bulkCreate(invitations) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const results = [];
      for (const { code, email, club_id } of invitations) {
        const query = `
          INSERT INTO invitations (code, email, club_id, used)
          VALUES ($1, $2, $3, false)
          RETURNING *;
        `;
        const values = [code, email, club_id];
        const { rows } = await client.query(query, values);
        results.push(rows[0]);
      }
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Invitation;