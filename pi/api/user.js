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
    .then(result => console.error(result))
    .catch(error => console.error(`ERROR ${error}`));
};

exports.findUser = (userName) => {
  console.error(userName);
};
