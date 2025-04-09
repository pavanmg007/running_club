const pool = require('../config/database');
const Marathon = require('../models/marathon');
const Participation = require('../models/participation');
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
    if (categories && categories.length > 0) {
      if (categories.some(c => !c.name || !c.price)) {
        return res.status(400).json({ error: 'Category name and price are required' });
      }
      const validCategoryNames = ['3K Run', '5K Run', '7K Run', '10K Run', '15K Run', '25K Run', 'Half Marathon', 'Full Marathon'];
      if (categories.some(c => !validCategoryNames.includes(c.name))) {
        return res.status(400).json({ error: 'Invalid category name', validCategoryNames: validCategoryNames });
      }
      const checkCategoryDuplicates = new Set(categories.map(c => c.name));
      if (checkCategoryDuplicates.size !== categories.length) {
        return res.status(400).json({ error: 'Category names must be unique' });
      }
      const marathon = await Marathon.create({ name, date, location, registration_link, club_id, is_private });
      const categoryQuery = `
        INSERT INTO categories (marathon_id, name, price)
        VALUES ${categories.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(',')}
        RETURNING *;
      `;
      const categoryValues = [marathon.id, ...categories.flatMap(c => [c.name, c.price])];
      const { rows } = await pool.query(categoryQuery, categoryValues);
      marathon.categories = rows;
      res.status(201).json(marathon);
    } else {
      const marathon = await Marathon.create({ name, date, location, registration_link, club_id, is_private });
      res.status(201).json(marathon);
    }
  } catch (error) {
    console.error('Error creating marathon:', error);
    if (error.code === '23502' && error.column === 'club_id') {
      return res.status(400).json({ error: 'Club ID cannot be null' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMarathon = async (req, res) => {
  console.log('Update marathon request:', req.body, req.params);
  const marathonId = req.params.id;
  const { name, date, location, registration_link, categories, is_private } = req.body;
  const club_id = req.user.club_id;
  try {
    const marathon = await Marathon.findById(marathonId);
    if (!marathon) {
      return res.status(404).json({ error: `Marathon with ID ${marathonId} not found` });
    }
    if (marathon.club_id !== club_id) {
      return res.status(403).json({ error: 'You do not have permission to update this marathon' });
    }
    console.log('Updating marathon:', name, date, location, registration_link, is_private, marathonId);
    const updatedMarathon = await Marathon.update({ name, date, location, registration_link, is_private, id: marathonId });
    // Handle category updates
    if (categories && categories.length > 0) {
      // Validate category data
      if (categories.some(c => !c.name || !c.price)) {
        return res.status(400).json({ error: 'Category name and price are required' });
      }
      const validCategoryNames = ['3K Run', '5K Run', '7K Run', '10K Run', '15K Run', '25K Run', 'Half Marathon', 'Full Marathon'];
      if (categories.some(c => !validCategoryNames.includes(c.name))) {
        return res.status(400).json({ error: 'Invalid category name', validCategoryNames: validCategoryNames });
      }
      const checkCategoryDuplicates = new Set(categories.map(c => c.name));
      if (checkCategoryDuplicates.size !== categories.length) {
        return res.status(400).json({ error: 'Category names must be unique' });
      }

      // Update categories
      await Marathon.updateCategories(marathonId, categories);
    } else {
      // If no categories are provided, delete all existing categories
      await Marathon.deleteCategories(marathonId);
    }

    // Fetch updated marathon with categories
    const updatedMarathonWithCategories = await Marathon.findById(marathonId);
    updatedMarathonWithCategories.categories = await Marathon.findMarathonCategories(marathonId);

    res.status(200).json(updatedMarathonWithCategories);
  } catch (error) {
    console.error('Error updating marathon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.deleteMarathon = async (req, res) => {
  const marathonId = req.params.id;
  const club_id = req.user.club_id;
  try {
    const marathon = await Marathon.findById(marathonId);
    if (!marathon) {
      return res.status(404).json({ error: `Marathon with ID ${marathonId} not found` });
    }
    if (marathon.club_id !== club_id) {
      return res.status(403).json({ error: 'You do not have permission to delete this marathon' });
    }
    // check for existing participations
    const participations = await Participation.getAll(marathonId);
    if (participations.length > 0) {
      const deleteParticipations = await Participation.deleteAll(marathonId);
      if (!deleteParticipations) {
        return res.status(500).json({ error: 'Error deleting participations' });
      }
    }
    // check for existing categories
    const categories = await Category.findByMarathonId(marathonId);
    if (categories.length > 0) {
      const deleteCategories = await Category.deleteAll(marathonId);
      if (!deleteCategories) {
        return res.status(500).json({ error: 'Error deleting categories' });
      }
    }
    // delete marathon
    const deleteMarathon = await Marathon.delete(marathonId);
    if (!deleteMarathon) {
      return res.status(500).json({ error: 'Marathon does not exist or could not be deleted' });
    }
    res.status(200).json({ message: 'Marathon deleted successfully' });
  } catch (error) {
    console.error('Error deleting marathon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

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

exports.getAllMarathonParticipants = async (req, res) => {
  const userClubId = req.user?.club_id;
  if (!userClubId) {
    return res.status(403).json({ error: 'Authentication required to view participants' });
  }
  try {
    const query = `
      SELECT m.id as "marathonId", m.name, u.id as "userId", u.name as "userName", c.id as "categoryId", c.name as category
      FROM participations p
      JOIN users u ON p.user_id = u.id
      JOIN categories c ON p.category_id = c.id
      JOIN marathons m ON p.marathon_id = m.id
      WHERE m.club_id = $1;
    `;
    const { rows } = await pool.query(query, [userClubId]);
    if (rows.length === 0) {
      return res.json({ allParticipants: [] });
    }
    let result = [];
    rows.forEach(row => {
      let marathon = result.find(m => m.name === row.name);
      if (!marathon) {
        marathon = {
          name: row.name,
          categories: []
        };
        result.push(marathon);
      }
      let category = marathon.categories.find(c => c.category === row.category);
      if (!category) {
        category = {
          category: row.category,
          participants: []
        };
        marathon.categories.push(category);
      }
      category.participants.push({
        userName: row.userName
      });
    })
    res.json(result);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};