// import { DingDongCloud } from './index.js';
const { DingDongCloud } = require('./index');
// import env from './env.js';
const env = require('./env.js');

const dingDongCloudConfig = {
  api_key: env.api_key || '_replace_with_your_own_api_key_',
}

const ddc = new DingDongCloud(dingDongCloudConfig);

ddc.getAccountInfo()
  .then((response) => { console.log({ response })})
  .catch((err) => { console.error(err.message); })

ddc.setSignature('_SIGNATURE_');
ddc.sendNotification({ mobile: env.mobile_test_number, content: 'test message' })
  .then((response) => { console.log(response); })
  .catch((err) => {
    console.error(err.message, err.code, err.message_en);
  });
