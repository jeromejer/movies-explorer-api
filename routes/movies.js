const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getSaveMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getSaveMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2).max(5000),
    image: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value)) {
        return helper.error('any.invalid');
      }
      return value;
    }),
    trailerLink: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value)) {
        return helper.error('any.invalid');
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value)) {
        return helper.error('any.invalid');
      }
      return value;
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),

  }),
}), createMovie);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
