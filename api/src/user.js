const DynamoDB = require('aws-sdk/clients/dynamodb');

module.exports.create = (event, context, callback) => {
  const docClient = new DynamoDB.DocumentClient();

  const { email, name, company } = JSON.parse(event.body);

  const item = {
    email,
    name,
    company,
  };

  const params = {
    TableName: `${process.env.SERVICE}-${process.env.ENVIRONMENT}-users`,
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
