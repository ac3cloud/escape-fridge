const DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient = new DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const { email, name, company } = JSON.parse(event.body);

  const item = {
    email,
    name,
    company,
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
          body: JSON.stringify({ error: { code: 'user', msg: 'Email already exists' } }),
        };

        return callback(null, response);
      }

      return callback(e);
    });
};

module.exports.start = (event, context, callback) => {
  const { email, challengeId } = JSON.parse(event.body);
  const now = Date.now();

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-leaderboard`,
    Key: { email },
    ConditionExpression: 'attribute_not_exists(startTime)',
    ExpressionAttributeValues: {
      ':challengeId': challengeId,
      ':startTime': now,
    },
    UpdateExpression: 'set startTime = :startTime, challengeId = :challengeId',
  };

  docClient.update(params).promise()
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
          body: JSON.stringify({ error: { code: 'user', msg: 'Email already started in leaderboard' } }),
        };

        return callback(null, response);
      }

      return callback(e);
    });
};

module.exports.stop = (event, context, callback) => {
  const { email } = JSON.parse(event.body);
  const now = Date.now();

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-leaderboard`,
    Key: { email },
    ConditionExpression: 'attribute_not_exists(endTime)',
    ExpressionAttributeValues: {
      ':endTime': now,
    },
    UpdateExpression: 'set endTime = :endTime',
  };

  docClient.update(params).promise()
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
          body: JSON.stringify({ error: { code: 'user', msg: 'Email already ended in leaderboard' } }),
        };

        return callback(null, response);
      }

      return callback(e);
    });
};

module.exports.get = (event, context, callback) => {
  let email;
  let startat;

  if (event.queryStringParameters) {
    ({ email } = event.queryStringParameters);
    ({ startat } = event.queryStringParameters);
  }

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-leaderboard`,
  };

  if (email) {
    params.FilterExpression = 'email = :email';
    params.ExpressionAttributeValues = { ':email': email };
  }

  if (startat) {
    params.FilterExpression = 'startTime > :startTime';
    params.ExpressionAttributeValues = { ':startTime': parseInt(startat) };
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
