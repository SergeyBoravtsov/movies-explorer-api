const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Поле image должно содержать валидную ссылку');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Поле trailer должно содержать валидную ссылку');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }
      return helpers.message('Поле thumbnail должно содержать валидную ссылку');
    }),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateProfile,
  validateCreateMovie,
  validateDeleteMovie,
};
