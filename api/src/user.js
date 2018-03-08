const DynamoDB = require('aws-sdk/clients/dynamodb');

module.exports.hello = (event, context, callback) => {
  const docClient = new DynamoDB.DocumentClient();

  const { email, name, company } = JSON.parse(event.body);

  const item = {
    email,
    name,
    company,
  };

  const params = {
    TableName: `escape-booth-${process.env.ENVIRONMENT}-celebrities`,
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
    .catch(e => callback(e));
};
