const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-request-err');
const AuthorizationError = require('../errors/authorization-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

// создать пользователя
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      password: hash,
      email: req.body.email,
      name: req.body.name,
    }))
    .then((newUserDoc) => {
      const newUser = newUserDoc.toObject(); // приводим документ Mongo к обычному объекту
      delete newUser.password; // удаляем пароль из объекта созданного юзера
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Произошла ошибка: ${err.message}`));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже есть'));
      }
      next(err);
    });
};

// авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      // вернём токен в cookie
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        sameSite: 'none',
        // secure: true,
        httpOnly: true,
      })
        .status(200).send({ message: 'Авторизация успешна!' });
      // выслать токен напрямую
      // res.send({ token });
    })
    .catch((err) => {
      next(new AuthorizationError(`Произошла ошибка: ${err.message}`));
    });
};

// посмотреть инфо о себе
const viewProfile = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    }
    next(err);
  });

// обновить профиль
const updateProfile = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  req.body,
  {
    runValidators: true,
    new: true,
  },
)
  .then((newMe) => res.status(200).send(newMe))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Bad Request'));
    }
    next(err);
  });

const logout = (req, res) => {
  res
    .status(200)
    .clearCookie('jwt')
    .send({ message: 'Успешный выход из приложения' });
};

module.exports = {
  createUser,
  login,
  updateProfile,
  viewProfile,
  logout,
};
