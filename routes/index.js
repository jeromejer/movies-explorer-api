const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { auth } = require('../middleware/auth');
const NotFoundError = require('../errors/not-found-error');

router.use(authRouter);
router.use(auth);
router.use(userRouter);
router.use(movieRouter);

router.use((req, res, next) => {
  res.send(() => {
    next(new NotFoundError('Запрашиваемая страница не найдена'));
  });
});

module.exports = router;
