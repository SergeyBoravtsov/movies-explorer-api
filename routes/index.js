const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { logout } = require('../controllers/users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignup, validateSignin } = require('../middlewares/validation');

// Код краш-теста (сервер должен подняться после падения сам, используя pm2)
// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// Роуты, не требующие авторизации
router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

// Роуты, требующие авторизации
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.post('/signout', auth, logout);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
