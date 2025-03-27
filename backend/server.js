const express = require('express');
const cors = require('cors');
const { PORT, CORS_ORIGIN } = require('./config/env');
const authRoutes = require('./routes/auth');
const marathonRoutes = require('./routes/marathons');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(express.json());

const allowedOrigin = CORS_ORIGIN || 'http://localhost:3000';
console.log('Allowed origin:', allowedOrigin);
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/marathons', marathonRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});