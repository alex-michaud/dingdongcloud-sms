# dingdongcloud-sms
**nodejs** library for dingdongcloud.com sms provider in China  
中国dingdongcloud.com短信提供商的**nodejs**库


[DingDongCloud.com](https://www.dingdongcloud.com)

[DingDongCloud.com wiki](https://www.dingdongcloud.com/wiki/v1/attention/)


Note: SMS content must be UTF-8 encoded  
注意：SMS内容必须为UTF-8编码


## Install - 安装

```shell script
npm i dingdongcloud-sms  
```
OR 
```shell script
yarn add dingdongcloud-sms  
```

## Usage - 运用

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


## Successful response example - 成功回应范例

```JSON
{
  "code": 1,
  "msg": "成功",
  "result": "18689"
}
```

## Error response example - 错误响应示例

If the request in unsuccessful, we throw a custom "DingDongCloud" error.  
如果请求未成功，我们将引发一个自定义的“ DingDongCloud”错误。

```
{
  "code": -1,
  "message": "用户名密码或apikey不正确",
  "message_en": "User account name and password do not match",
  "result": null,
  "name": "DingDongCloudError"
}
```
