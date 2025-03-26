const pool = require('../config/database');
const Marathon = require('../models/marathon');
const Category = require('../models/category');

exports.getAllMarathons = async (req, res) => {
  try {
    const club_id = req.user?.club_id;
    if (club_id) {
      const clubMarathons = await Marathon.findAllByClubId(club_id);
      const openMarathons = await Marathon.findOpenMarathons(club_id);
      const allMarathons = [...clubMarathons, ...openMarathons];
      res.json(allMarathons);
    } else {
      const query = `
        SELECT m.*, json_agg(json_build_object('id', c.id, 'marathon_id', c.marathon_id, 'name', c.name, 'price', c.price)) as categories
        FROM marathons m
        LEFT JOIN categories c ON m.id = c.marathon_id
        WHERE m.is_private = false
        GROUP BY m.id;
      `;
      const { rows } = await pool.query(query);
      res.json(rows);
    }
  } catch (error) {
    console.error('Error fetching marathons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMarathonById = async (req, res) => {
  const marathonId = req.params.id;
  try {
    const marathon = await Marathon.findById(marathonId);
    if (!marathon) {
      return res.status(404).json({ error: `Marathon with ID ${marathonId} not found` });
    }
    const marathonCategories = await Marathon.findMarathonCategories(marathonId);
    if (marathonCategories.length > 0) {
      marathon.categories = marathonCategories;
    }
    res.json(marathon);
  }
  catch (error) {
    console.error('Error fetching marathon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createMarathon = async (req, res) => {
  const { name, date, location, registration_link, categories, is_private } = req.body;
  const club_id = req.user.club_id;

  if (!club_id) {
    return res.status(400).json({ error: 'Club ID is required but missing from user token' });
  }

  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required' });
  }

  try {
    const marathon = await Marathon.create({ name, date, location, registration_link, club_id, is_private });
    if (categories && categories.length > 0) {
      const categoryQuery = `
        INSERT INTO categories (marathon_id, name, price)
        VALUES ${categories.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(',')}
        RETURNING *;
      `;
      const categoryValues = [marathon.id, ...categories.flatMap(c => [c.name, c.price])];
      await pool.query(categoryQuery, categoryValues);
    }
    res.status(201).json(marathon);
  } catch (error) {
    console.error('Error creating marathon:', error);
    if (error.code === '23502' && error.column === 'club_id') {
      return res.status(400).json({ error: 'Club ID cannot be null' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMarathonParticipants = async (req, res) => {
  const marathonId = req.params.id;
  const userClubId = req.user?.club_id;

  if (!userClubId) {
    return res.status(403).json({ error: 'Authentication required to view participants' });
  }

  // Fetch marathon details to check privacy and club
  const marathon = await Marathon.findById(marathonId);
  if (!marathon) {
    return res.status(404).json({ error: `Marathon with ID ${marathonId} not found` });
  }

  // Restrict access for private marathons
  if (marathon.is_private && marathon.club_id !== userClubId) {
    return res.status(403).json({ error: 'This marathon is private; only club members can view participants' });
  }
  
  const query = `
    SELECT m.id as "marathonId", m.name, u.id as "userId", u.name as "userName", c.id as "categoryId", c.name as category
    FROM participations p
    JOIN users u ON p.user_id = u.id
    JOIN categories c ON p.category_id = c.id
    JOIN marathons m ON p.marathon_id = m.id
    WHERE p.marathon_id = $1;
  `;
  try {
    const { rows } = await pool.query(query, [marathonId]);
    if (rows.length === 0) {
      return res.json({ marathonId, name: (await Marathon.findById(marathonId)).name, allParticipants: [], participantsByCategory: {} });
    }
    const participantsByCategory = rows.reduce((acc, row) => {
      acc[row.category] = acc[row.category] || [];
      acc[row.category].push({ userId: row.userId, name: row.userName });
      return acc;
    }, {});
    res.json({
      marathonId: parseInt(marathonId),
      name: rows[0].name,
      allParticipants: rows.map(row => ({
        userId: row.userId,
        name: row.userName,
        categoryId: row.categoryId,
        category: row.category,
      })),
      participantsByCategory
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};