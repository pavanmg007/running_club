const express = require('express');
const { PORT } = require('./config/env');
const authRoutes = require('./routes/auth');
const marathonRoutes = require('./routes/marathons');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/marathons', marathonRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});