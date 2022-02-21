const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

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

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.send({
      data: {
        email: user.email,
        name: user.name,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      } if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};
