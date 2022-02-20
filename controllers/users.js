const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/bad-request-error');

module.exports.getUser = (req, res, next) => {
  const owner = req.user._id;
  User.findOne(owner)
    .then((dataUser) => {
      if (!dataUser) {
        throw new NotFoundError('Такого пользователя не существует');
      } else {
        res.status(200).send(dataUser._id, dataUser.name);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, email }, { new: true, runValidators: true })
    .then((dataUser) => {
      if (!dataUser) {
        throw new NotFoundError('Пользователь с таким ID не найден');
      } else {
        res.status(200).send(dataUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
