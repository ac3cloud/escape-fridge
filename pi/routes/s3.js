const express = require('express');
const S3 = require('aws-sdk/clients/s3');
const uuidv4 = require('uuid/v4');

const router = express.Router();
const s3 = new S3();

router.post('/', (req, res /* , next */) => {
  const uuid = uuidv4();

  const params = {
    Bucket: `${process.env.SERVICE}-${process.env.NODE_ENV}-faces`,
    Key: uuid,
    ContentType: 'image/png',
    Expires: 300,
  };

  const url = s3.getSignedUrl('putObject', params);

  res.json({
    uuid,
    url,
  });
});

module.exports = router;
