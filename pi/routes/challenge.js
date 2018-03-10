const express = require('express');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  res.render('challenge', { params: {} });
});

module.exports = router;
