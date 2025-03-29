const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, club_id, role = 'member' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (name, email, password, club_id, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, club_id;
    `;
    const values = [name, email, hashedPassword, club_id, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAllUsers() {
    const query = 'SELECT * FROM users;';
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = User;