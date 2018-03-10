const express = require('express');
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

const api = require('../api/user');

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
    return res.render('index', { errors: errors.mapped() });
  }

  const params = matchedData(req);
  console.error(res);
  console.error(params);

  return api.createUser(params).then((user) => {
    console.error(user);
    if (user.error) {
      res.render('error', { message: 'Error creating User', error: user.error });
    } else {
      res.render('start', { email: params.email });
    }
  });
});

module.exports = router;
