const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

router.get('/', getMovies);

router.delete('/:id', validateDeleteMovie, deleteMovie);

router.post('/', validateCreateMovie, createMovie);

module.exports = router;
