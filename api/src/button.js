const IotData = require('aws-sdk/clients/iotdata');

const iot = new IotData({ endpoint: process.env.IOT_ENDPOINT });

module.exports.click = (/* event , context, callback */) => {
  // TODO do we care what is in the event?
  // { serialNumber: 'G030JF059367J79T', batteryVoltage: '1780mV', clickType: 'SINGLE' }
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
