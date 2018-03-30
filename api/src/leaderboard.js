const DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient = new DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const { email, challengeId } = JSON.parse(event.body);
  const now = Date.now();

  const item = {
    email,
    challengeId,
    start: now,
  };

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-leaderboard`,
    Item: item,
    ConditionExpression: 'attribute_not_exists(email)',
  };

  docClient.put(params).promise()
    .then(() => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({}),
      };

      callback(null, response);
    })
    .catch((e) => {
      if (e.code === 'ConditionalCheckFailedException') {
        const response = {
          statusCode: 200,
          body: JSON.stringify({ error: { code: 'user', msg: 'Email already exists in leaderboard' } }),
        };

        return callback(null, response);
      }

      return callback(e);
    });
};

module.exports.update = (event, context, callback) => {
  const { email } = JSON.parse(event.body);
  const now = Date.now();

  const item = {
    end: now,
  };

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-leaderboard`,
    Key: { HashKey: email },
    Item: item,
    ConditionExpression: 'attribute_not_exists(end)',
    ExpressionAttributeValues: {
      ':end': now,
    },
    UpdateExpression: 'set #end = :end',
  };

  docClient.put(params).promise()
    .then(() => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({}),
      };

      callback(null, response);
    })
    .catch((e) => {
      if (e.code === 'ConditionalCheckFailedException') {
        const response = {
          statusCode: 200,
          body: JSON.stringify({ error: { code: 'user', msg: 'Email already exists in leaderboard' } }),
        };

        return callback(null, response);
      }

      return callback(e);
    });
};

module.exports.get = (event, context, callback) => {
  let email;

  if (event.queryStringParameters) {
    ({ email } = event.queryStringParameters);
  }

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-leaderboard`,
  };

  if (email) {
    params.FilterExpression = 'email = :email';
    params.ExpressionAttributeValues = { ':email': email };
  }

  docClient.scan(params).promise()
    .then((result) => {
      console.error(result);
      const items = email ? result.Items[0] : result.Items;
      const response = {
        statusCode: 200,
        body: JSON.stringify(items),
      };

      callback(null, response);
    });
};
