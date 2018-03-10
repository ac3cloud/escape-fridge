const express = require('express');

const api = require('../api/user');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  const { email } = req.cookies;

  if (!email) {
    res.render('error', { message: 'User not logged in', error: {} });
    return;
  }

  api.getLeaderboardByEmail(email)
    .then((leaderboard) => {
      console.error(leaderboard);
      res.render('challenge', { leaderboard });
    });
});

router.get('/timeup', (req, res /* , next */) => {
  res.render('timeup');
});

module.exports = router;
