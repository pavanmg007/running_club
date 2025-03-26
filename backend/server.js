const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const authRoutes = require('./routes/auth');
const marathonRoutes = require('./routes/marathons');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(express.json());
// Enable CORS for frontend origin
app.use(cors({
  origin: 'https://https://frontend-polished-thunder-9282.fly.dev', // Allow only this origin
  credentials: true, // If you plan to use cookies (optional)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers
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