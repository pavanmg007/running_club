const pool = require('../config/database');

class Category {
  static async create({ marathon_id, name, price }) {
    const query = `
      INSERT INTO categories (marathon_id, name, price)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [marathon_id, name, price];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByMarathonId(marathon_id) {
    const query = 'SELECT * FROM categories WHERE marathon_id = $1;';
    const { rows } = await pool.query(query, [marathon_id]);
    return rows;
  }
}

module.exports = Category;