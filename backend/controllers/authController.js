const User = require('../models/user');
const Invitation = require('../models/invitation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.signup = async (req, res) => {
  const { name, email, password, code } = req.body;

  const invitation = await Invitation.findByCode(code);
  if (!invitation || invitation.used || invitation.email !== email) {
    return res.status(400).json({ error: 'Invalid or used invitation code' });
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, club_id: invitation.club_id });
  await Invitation.markAsUsed(code);

  const token = jwt.sign({ id: user.id, role: user.role, club_id: user.club_id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token, user: { id: user.id, name, email, role: user.role, club_id: user.club_id } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, club_id: user.club_id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, name: user.name, email, role: user.role, club_id: user.club_id } });
};