const express = require('express');
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const api = require('../api/leaderboard');

const router = express.Router();

const validations = [
  body('email').isEmail().withMessage('must be a valid email address').trim()
    .normalizeEmail(),
  body('name').isLength({ min: 5 }).withMessage('Your name is not long enough').trim(),
  body('company').trim(),
];
router.post('/', validations, (req, res /* , next */) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.mapped());
    res.render('index', { params: req.body, errors: errors.mapped() });
    return;
  }

  const params = matchedData(req);

  api.createUser(params).then((user) => {
    if (user.error) {
      res.render('error', { message: 'Error creating User', error: user.error });
    } else {
      res.cookie('email', params.email);
      res.redirect('/users/start');
    }
  });
});

router.get('/start', validations, (req, res /* , next */) => {
  res.render('start');
});

router.post('/start', validations, (req, res /* , next */) => {
  const { email } = req.cookies;
  const challengeId = 1; // TODO stop hard coding this

  if (!email) {
    res.render('error', { message: 'User not logged in', error: {} });
    return;
  }

  const params = {
    email,
    challengeId,
  };

  api.startUser(params).then((data) => {
    if (data.error) {
      res.render('error', { message: 'Error starting User', error: data.error });
    } else {
      res.redirect('/challenge');
    }
  });
});


module.exports = router;
