require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
  JWT_SECRET = 'super-secret-key',
} = process.env;

module.exports = {
  PORT,
  MONGO_URL,
  JWT_SECRET,
};
