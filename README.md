# dingdongcloud-sms
nodejs library for dingdongcloud.com sms provider in China  
中国dingdongcloud.com短信提供商的nodejs库


[DingDongCloud.com](https://www.dingdongcloud.com)

[DingDongCloud.com wiki](https://www.dingdongcloud.com/wiki/v1/attention/)


Note: SMS content must be UTF-8 encoded  
注意：SMS内容必须为UTF-8编码


##Install - 安装

```shell script
npm i dingdongcloud-sms  
```
OR 
```shell script
yarn add dingdongcloud-sms  
```

##Usage - 运用

```ecmascript 6
import { DingDongCloud } from './index.js';

const dingDongCloudConfig = {
  api_key: '_your_own_api_key_'
};

const ddc = new DingDongCloud(dingDongCloudConfig);

ddc.setSignature('_YOUR_SMS_SIGNATURE_');
ddc.sendNotification({ mobile: '1234567890', content: 'test message' })
  .then((response) => { console.log(response); })
  .catch((err) => { console.error(err.message); });
```
