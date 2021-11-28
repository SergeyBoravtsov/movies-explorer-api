const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies || movies.length === 0) {
        throw new NotFoundError('Сохранённых фильмов не найдено');
      }
      res.status(200).send(movies);
    })
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.body.movieId })
    .then((movie) => {
      if (movie) {
        throw new ForbiddenError('Этот фильм уже добавлен в сохранённые');
      }
      return Movie.create({
        ...req.body,
        owner: req.user._id,
      });
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('У вас нет прав на удаление фильма');
      }

      movie.remove()
        .then(() => {
          res.send({ message: 'Фильм успешно удалён' });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
