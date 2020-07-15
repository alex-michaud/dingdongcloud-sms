import { DingDongCloud } from './index.js';
import env from './env.js';

const dingDongCloudConfig = {
  api_key: env.api_key || '_replace_with_your_own_api_key_',
}

console.log({ dingDongCloudConfig });

const ddc = new DingDongCloud(dingDongCloudConfig);

ddc.setSignature('_SIGNATURE_');
ddc.sendNotification({ mobile: '1111111111', content: 'test message' })
  .then((response) => { console.log(response); })
  .catch((err) => {
    console.error(err.message, err.code, err.message_en);
  });
