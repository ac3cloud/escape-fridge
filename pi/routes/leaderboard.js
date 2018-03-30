const express = require('express');

const api = require('../api/leaderboard');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  api.getLeaderboard()
    .then((leaderboard) => {
      console.error(leaderboard);
      res.render('leaderboard', { leaderboard });
    });
});

module.exports = router;
