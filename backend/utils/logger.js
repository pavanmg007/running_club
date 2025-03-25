const winston = require('winston');

// Define log format with timestamp, level, and message
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: 'info', // Default level (can be 'debug', 'warn', 'error', etc.)
  format: logFormat,
  transports: [
    // Log to console (useful for development)
    new winston.transports.Console(),
    // Log to a file (useful for production/debugging)
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// Export logger for use in other modules
module.exports = logger;
