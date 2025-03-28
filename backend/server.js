const express = require('express');
const cors = require('cors');
const { PORT, CORS_ORIGIN, CORS_ORIGIN2 } = require('./config/env');
const authRoutes = require('./routes/auth');
const marathonRoutes = require('./routes/marathon');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(express.json());

const allowedOrigins = [CORS_ORIGIN, CORS_ORIGIN2, 'http://localhost:3000']

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

console.log('Allowed origin:', allowedOrigins);
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/marathon', marathonRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});