const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log('req.path', req.baseUrl);
  if (req.baseUrl === '/api/marathon') {
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        req.user = null;
      }
    } else {
      req.user = null;
    }
    return next();
  }
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Should include { id, role, club_id }
    if (!decoded.club_id) {
      return res.status(400).json({ error: 'Token missing club_id' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};