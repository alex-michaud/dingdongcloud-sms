import { DingDongCloud } from './index.js';
import env from './env.js';

console.log({ env })

const dingDongCloudConfig = {
  api_key: env.api_version || '_replace_with_your_own_api_key_',
}

const ddc = new DingDongCloud(dingDongCloudConfig);

ddc.setSignature('RedDoor');
ddc.sendNotification({ mobile: '11111111', content: 'test message' })
  .then((response) => { console.log(response); });
