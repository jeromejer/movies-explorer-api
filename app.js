const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/error-handler');
require('dotenv').config();
const router = require('./routes/index');
const limiter = require('./middleware/limiter');

const { PORT = 3000, DB_ADRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();
app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://jeromejer.nomoredomains.work', // api
    'https://jeromejer.nomoredomains.work', // api
    'http://jeromejer-movies.nomoredomains.work', // frontend
    'https://jeromejer-movies.nomoredomains.work', // frontend
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(requestLogger);

app.use(router);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
