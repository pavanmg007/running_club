const User = require('../models/user');
const Invitation = require('../models/invitation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const pool = require('../config/database');

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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry
  await pool.query(
    'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, token, expiresAt]
  );

  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${resetLink}\nIt expires in 1 hour.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, new_password } = req.body;

  const reset = await pool.query(
    'SELECT * FROM password_resets WHERE token = $1 AND used = false AND expires_at > NOW()',
    [token]
  );
  if (reset.rows.length === 0) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const userId = reset.rows[0].user_id;
  const hashedPassword = await bcrypt.hash(new_password, 10);
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
  await pool.query('UPDATE password_resets SET used = true WHERE token = $1', [token]);

  res.json({ message: 'Password reset successful' });
};

exports.updatePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!await bcrypt.compare(current_password, user.password)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

  res.json({ message: 'Password updated successfully' });
};