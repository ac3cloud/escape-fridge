// const request = require('superagent');

exports.createUser = (params) => {
  // TODO validate params and return error

  // request.post('/user')
  //   .set('Content-Type', 'application/json')
  //   .send('{"name":"tj","pet":"tobi"}')
  //   .then(callback)
  console.error('CREATING USER');

  return new Promise((resolve) => {
    const user = {
      id: 0,
      email: params.email,
      name: params.name,
      company: params.company,
    };

    resolve(user);
  });
};

exports.findUser = (userName) => {
  console.error(userName);
};
