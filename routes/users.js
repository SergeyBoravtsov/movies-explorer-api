const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  viewProfile,
} = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.get('/me', viewProfile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateProfile);

router.patch('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
