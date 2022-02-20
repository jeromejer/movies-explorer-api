const Movies = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden');

// Получить все сохраненные фильмы
module.exports.getSaveMovies = (req, res, next) => {
  const owner = req.user._id;

  Movies.find({ owner })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Фильмы не найдены');
      }
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

// Добавление фильма
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movies.create({ owner, ...req.body })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movies.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Этот фильм принадлежит другому пользователю');
      } else {
        Movies.findByIdAndRemove(movieId)
          .then((data) => {
            res.status(200).send({ data });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Пользователя с таким ID не существует'));
      } else {
        next(err);
      }
    });
};
