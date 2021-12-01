const router = require('express').Router();
const { validateUpdateProfile } = require('../middlewares/validation');
const {
  updateProfile,
  viewProfile,
} = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.get('/me', viewProfile);

router.patch('/me', validateUpdateProfile, updateProfile);

router.patch('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
