const rateLimit = require('express-rate-limit');

// Защита от DDoS-атак (ограничение количества запросов в единицу времени)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
