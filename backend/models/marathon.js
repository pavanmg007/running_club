const pool = require('../config/database');

class Marathon {
  static async create({ name, date, location, registration_link, club_id, is_private = true }) {
    const query = `
      INSERT INTO marathons (name, date, location, registration_link, club_id, is_private)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, date, location, registration_link, club_id, is_private];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM marathons WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAllByClubId(club_id) {
    console.log('findAllByClubId query with club_id:', club_id);
    const query = `
      SELECT m.*, json_agg(json_build_object('id', c.id, 'marathon_id', c.marathon_id, 'name', c.name, 'price', c.price)) as categories
      FROM marathons m
      LEFT JOIN categories c ON m.id = c.marathon_id
      WHERE m.club_id = $1
      GROUP BY m.id;
    `;
    const { rows } = await pool.query(query, [club_id]);
    return rows;
  }

  // New method to find open marathons from other clubs
  static async findOpenMarathons(exclude_club_id) {
    const query = `
      SELECT m.*, json_agg(json_build_object('id', c.id, 'marathon_id', c.marathon_id, 'name', c.name, 'price', c.price)) as categories
      FROM marathons m
      LEFT JOIN categories c ON m.id = c.marathon_id
      WHERE m.is_private = false AND m.club_id != $1
      GROUP BY m.id;
    `;
    const { rows } = await pool.query(query, [exclude_club_id]);
    return rows;
  }
}

module.exports = Marathon;