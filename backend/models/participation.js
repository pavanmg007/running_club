const pool = require('../config/database');

class Participation {
  static async create({ marathon_id, user_id, category_id }) {
    const query = `
      INSERT INTO participations (marathon_id, user_id, category_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [marathon_id, user_id, category_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(marathon_id, user_id) {
    const query = `
      DELETE FROM participations
      WHERE marathon_id = $1 AND user_id = $2
      RETURNING *;
    `;
    const values = [marathon_id, user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByMarathonId(marathon_id) {
    const query = `
      SELECT p.*, u.name AS user_name, c.name AS category_name
      FROM participations p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.marathon_id = $1;
    `;
    const { rows } = await pool.query(query, [marathon_id]);
    return rows;
  }
}

module.exports = Participation;