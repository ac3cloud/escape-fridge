
//  ____        _   _                 ____ _ _      _
// | __ ) _   _| |_| |_ ___  _ __    / ___| (_) ___| | __
// |  _ \| | | | __| __/ _ \| '_ \  | |   | | |/ __| |/ /
// | |_) | |_| | |_| || (_) | | | | | |___| | | (__|   <
// |____/ \__,_|\__|\__\___/|_| |_|  \____|_|_|\___|_|\_\

// This file contains the Lambda function which should be executed when the IoT button is clicked

const IotData = require('aws-sdk/clients/iotdata');

const iot = new IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.click = (/* event , context, callback */) => {
  const payloadJSON = {
    cmd: 'take-photo',
  };
  const payload = JSON.stringify(payloadJSON);

  const params = {
    topic: 'pi',
    payload,
  };

  iot.publish(params).promise();
};
