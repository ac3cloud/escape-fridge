const express = require('express');
const { body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const api = require('../api/user');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  res.render('index', { params: {} });
});

const validations = [
  body('email').isEmail().withMessage('must be a valid email address').trim()
    .normalizeEmail(),
  body('name').isLength({ min: 5 }).withMessage('Your name is not long enough').trim(),
  sanitize('company').trim(),
];
router.post('/', validations, (req, res /* , next */) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.mapped());
    return res.render('index', { errors: errors.mapped() });
  }

  const params = matchedData(req);
  return api.createUser(params).then((user) => {
    res.render('start', { user });
  });
});

module.exports = router;
