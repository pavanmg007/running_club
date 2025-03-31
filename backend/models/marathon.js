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

  static async update({ name, date, location, registration_link, is_private, id }) {
    console.log('Update params:', { name, date, location, registration_link, is_private, id });
    if (!id) throw new Error('ID is required');

    // Build the SET clause dynamically based on provided parameters
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (date !== undefined) {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      updates.push(`date = $${paramCount}`);
      values.push(formattedDate);
      paramCount++;
    }
    if (location !== undefined) {
      updates.push(`location = $${paramCount}`);
      values.push(location);
      paramCount++;
    }
    if (registration_link !== undefined) {
      updates.push(`registration_link = $${paramCount}`);
      values.push(registration_link);
      paramCount++;
    }
    if (is_private !== undefined) {
      updates.push(`is_private = $${paramCount}`);
      values.push(!!is_private);
      paramCount++;
    }

    // If no fields to update, return early
    if (updates.length === 0) {
      return await this.findById(id);
    }

    // Add WHERE clause parameter
    values.push(id);

    const query = `
      UPDATE marathons
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    try {
      console.log('Update query:', query);
      console.log('Update values:', values);
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        console.log('No rows updated - possible ID mismatch');
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM marathons WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM marathons WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findMarathonCategories(marathon_id) {
    const query = 'SELECT * FROM categories WHERE marathon_id = $1;';
    const { rows } = await pool.query(query, [marathon_id]);
    return rows;
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

  static async updateCategories(marathonId, categories) {
    // Get existing categories
    const existingCategories = await this.findMarathonCategories(marathonId);
    const existingCategoryIds = existingCategories.map(c => c.id);

    // Identify categories to delete
    const categoriesToDelete = existingCategories.filter(ec => !categories.some(c => c.id === ec.id));
    for (const category of categoriesToDelete) {
      await this.deleteCategory(category.id);
    }

    // Identify categories to update or create
    for (const category of categories) {
      if (category.id) {
        // Update existing category
        await this.updateCategory(category);
      } else {
        // Create new category
        await this.createCategory({ ...category, marathon_id: marathonId });
      }
    }
  }

  static async createCategory({ marathon_id, name, price }) {
    const query = `
        INSERT INTO categories (marathon_id, name, price)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [marathon_id, name, price];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async updateCategory({ id, name, price }) {
    const query = `
        UPDATE categories
        SET name = $1, price = $2
        WHERE id = $3
        RETURNING *;
    `;
    const values = [name, price, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async deleteCategory(id) {
    const query = `
        DELETE FROM categories
        WHERE id = $1;
    `;
    await pool.query(query, [id]);
  }

  static async deleteCategories(marathonId) {
    const query = `
        DELETE FROM categories
        WHERE marathon_id = $1;
    `;
    await pool.query(query, [marathonId]);
  }
}

module.exports = Marathon;