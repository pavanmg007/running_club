const Participation = require('../models/participation');
const Marathon = require('../models/marathon');
const Category = require('../models/category');
const pool = require('../config/database');

exports.participate = async (req, res) => {
  const marathon_id = req.params.id;
  const { category_id } = req.body;
  const user_id = req.user.id;
  const user_club_id = req.user.club_id;

  if (!category_id) return res.status(400).json({ error: 'Category ID is required' });

  try {
    const marathon = await Marathon.findById(marathon_id);
    if (!marathon) {
      return res.status(404).json({ error: `Marathon with ID ${marathon_id} not found` });
    }

    // Check privacy and club membership
    if (marathon.is_private && marathon.club_id !== user_club_id) {
      return res.status(403).json({ error: 'This marathon is private and restricted to its club members' });
    }

    const categories = await Category.findByMarathonId(marathon_id);
    const validCategory = categories.find(cat => cat.id === parseInt(category_id));
    if (!validCategory) {
      return res.status(404).json({ error: `Category with ID ${category_id} not found for marathon ${marathon_id}` });
    }

    const existing = await pool.query(
      'SELECT 1 FROM participations WHERE marathon_id = $1 AND user_id = $2',
      [marathon_id, user_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Participation is already marked for this marathon' });
    }

    const participation = await Participation.create({ marathon_id, user_id, category_id });
    res.status(201).json({
      id: participation.id,
      marathon_id,
      marathon_name: marathon.name,
      category_id,
      category_name: validCategory.name,
      user_id,
      registered_at: participation.registered_at
    });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid marathon_id or category_id' });
    }
    if (error.code === '23505' && error.constraint === 'unique_user_marathon') {
      return res.status(409).json({ error: 'Participation is already marked for this marathon' });
    }
    console.error('Error creating participation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};