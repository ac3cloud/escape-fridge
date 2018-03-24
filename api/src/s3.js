const IotData = require('aws-sdk/clients/iotdata');
// const S3 = require('aws-sdk/clients/s3');

const iot = new IotData({ endpoint: process.env.IOT_ENDPOINT });

const SMILE_THRESHOLD = 60;

module.exports.faceDetect = (event /* , context, callback */) => {
  console.error(event);

  // TODO: Run Facedetect on bucket image
  const faceSomething = {
    smile: 90,
  };

  if (faceSomething.smile > SMILE_THRESHOLD) {
    const state = {
      state: {
        desired: {
          fridge: {
            state: 'unlocked',
          },
        },
      },
    };

    const params = {
      payload: JSON.stringify(state),
      thingName: process.env.THING_NAME,
    };
    iot.updateThingShadow(params).promise();
  }

  // TODO: Return above and publish a failure to the pi
};
