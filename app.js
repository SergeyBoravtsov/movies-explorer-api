require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const centralErrorHandler = require('./middlewares/error-handler');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Защита от DDoS-атак (ограничение количества запросов в единицу времени)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(limiter);
app.use(express.json()); // используем встроенный парсер express вместо body-parser
app.use(helmet()); // добавляет ответам заголовки для защиты от некоторых уязвимостей

// Код краш-теста (сервер должен подняться после падения сам, используя pm2)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов

// Роуты, не требующие авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

// Авторизация (здесь проверяем токен, если токен верный -
// записываем его пейлоуд в объект запроса (req.user))
app.use(auth);

// Роуты, требующие авторизации
app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

// обработка ошибок celebrate
app.use(errors());

app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
