require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const centralErrorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_URL } = require('./config');

const app = express();

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(cors());
app.use(limiter);
app.use(express.json()); // используем встроенный парсер express вместо body-parser
app.use(helmet());
app.use(cookieParser());

app.use(router);

app.use(errorLogger);

// обработка ошибок celebrate
app.use(errors());

app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
