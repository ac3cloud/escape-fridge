/* eslint-disable no-param-reassign */

const express = require('express');
const moment = require('moment');

const api = require('../api/leaderboard');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  api.getLeaderboard()
    .then((leaderboard) => {
      let counter = 1;


      leaderboard.forEach((entry) => {
        entry.diff = (entry.endTime ? entry.endTime : Date.now()) - entry.startTime;
        entry.time = moment.utc(entry.diff).format('mm:ss');
      });

      leaderboard.sort((a, b) => a.diff - b.diff);

      leaderboard.forEach((entry) => {
        entry.rank = counter;

        if (entry.diff > 10 * 60 * 1000) {
          entry.class = 'table-danger';
        }

        if (entry.rank === 1) {
          entry.class = 'table-success';
        }

        if (!entry.endTime && entry.diff < 10 * 60 * 1000) {
          entry.time += ' (Now Playing)';
          entry.class = 'table-primary';
        }

        counter += 1;
      });

      res.render('leaderboard', { leaderboard });
    });
});

module.exports = router;
