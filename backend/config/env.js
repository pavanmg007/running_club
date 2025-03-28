require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CORS_ORIGIN2: process.env.CORS_ORIGIN2,
  NODE_ENV: process.env.NODE_ENV,
};