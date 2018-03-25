const IotData = require('aws-sdk/clients/iotdata');
const Rekognition = require('aws-sdk/clients/rekognition');

const iot = new IotData({ endpoint: process.env.IOT_ENDPOINT });
const rekognition = new Rekognition();

const SMILE_THRESHOLD = 60;

const sendData = (data) => {
  const payloadJSON = {
    cmd: 'face-data',
    data: data.FaceDetails[0],
  };
  const payload = JSON.stringify(payloadJSON);

  const params = {
    topic: 'pi',
    payload,
  };

  return iot.publish(params).promise()
    .then(() => data);
};

const sendResult = (data) => {
  const payloadJSON = {
    cmd: 'result',
    isSmiling: data,
  };
  const payload = JSON.stringify(payloadJSON);

  const params = {
    topic: 'pi',
    payload,
  };

  return iot.publish(params).promise()
    .then(() => data);
};

const detectFace = (bucket, key) => {
  const params = {
    Attributes: ['ALL'],
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
  };

  return rekognition.detectFaces(params).promise();
};

const setFridge = (fridgeState) => {
  const state = {
    state: {
      desired: {
        fridge: {
          state: fridgeState,
        },
      },
    },
  };

  const params = {
    payload: JSON.stringify(state),
    thingName: process.env.THING_NAME,
  };

  return iot.updateThingShadow(params).promise();
};

const checkThreshold = (data) => {
  const smile = data.FaceDetails[0].Smile;

  const isSmiling = smile.Value && smile.Confidence > SMILE_THRESHOLD;

  if (isSmiling) {
    setFridge('unlocked');
  }

  sendResult(isSmiling ? 'success' : 'failure');
};

module.exports.processImage = (event /* , context, callback */) => {
  const { key } = event.Records[0].s3.object;
  const bucket = event.Records[0].s3.bucket.name;

  detectFace(bucket, key)
    .then(data => sendData(data))
    .then(data => checkThreshold(data));
};
