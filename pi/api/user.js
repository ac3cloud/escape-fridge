const request = require('superagent');

exports.createUser = (params) => {
  console.error('CREATING USER');

  const user = {
    email: params.email,
    name: params.name,
    company: params.company,
  };

  return request.post(`${process.env.API_URL}/user`)
    .set('Content-Type', 'application/json')
    .send(user)
    .then(res => res.body);
};

exports.startUser = (params) => {
  console.error('STARTING USER');

  const user = {
    email: params.email,
    challengeId: params.challengeId,
  };

  return request.post(`${process.env.API_URL}/leaderboard`)
    .set('Content-Type', 'application/json')
    .send(user)
    .then(res => res.body);
};

exports.stopUser = (params) => {
  console.error('STOPPING USER');

  const user = {
    email: params.email,
  };

  return request.put(`${process.env.API_URL}/leaderboard`)
    .set('Content-Type', 'application/json')
    .send(user)
    .then(res => res.body);
};

exports.getLeaderboardByEmail = (email) => {
  console.error('GET LEADERBOARD');

  const user = {
    email,
  };

  return request.get(`${process.env.API_URL}/leaderboard`)
    .set('Content-Type', 'application/json')
    .query(user)
    .then(res => res.body);
};
