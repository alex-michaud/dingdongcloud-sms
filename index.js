
import https from 'https';

class DingDongCloud {

  constructor(config) {
    if (!config.api_key) {
      throw Error('"api_key" is required');
    }

    this.apikey = config.api_key;
    this.apiversion = config.api_version || 'v2';

    this.signature = config.signature || null;

    if (this.apiversion === 'v1') {
      // 获取user信息url (get user info)
      this.url_get_user = `/${this.apiversion}/sms/userinfo`;

      // 发送验证码url (Send verification code)
      this.url_send_sms_yzm = `/${this.apiversion}/sms/sendyzm`;

      // 发送语音验证码url  (Voice verifiation code)
      this.url_send_sms_yyyzm = `/${this.apiversion}/sms/sendyyyzm`;

      // 发送通知url (send notification)
      this.url_send_notification = `/${this.apiversion}/sms/sendtz`;

      // 发送营销url (Marketing)
      this.url_send_sms_yx = `/${this.apiversion}/sms/sendyx`;
    }
    else {
      this.url_send_notification = `/${this.apiversion}/sms/notice/send.json`;
    }

    this.sms_host = 'api.dingdongcloud.com';
  }

  /**
   *
   * @param path
   * @param post_data
   * @returns {*}
   * @private
   */
  _post = ({ path, post_data }) => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(post_data)

      const options = {
        hostname: this.sms_host,
        port: 443,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }

      // console.log(options)
      const req = https.request(options, (res) => {
        // console.log(`statusCode: ${res.statusCode}`)
        let chunks = '';

        res.on('data', (chunk) => {
          chunks += chunk;
        })

        res.on('end', () => {
          // console.log('Body: ', JSON.parse(chunks));
          resolve(JSON.parse(chunks));
        });
      })

      req.on('error', (err) => {
        // console.error(err.message)
        reject(err);
      })

      // console.log({ data })
      req.write(data)
      req.end();
    })
  };

  /**
   *
   * @param path
   * @param mobile
   * @param content
   * @param signature
   * @returns {*}
   * @private
   */
  _send_sms = ({ path, mobile, content, signature }) => {

    const sign = signature || this.signature;

    // 这是需要提交的数据
    const post_data = {
      'apikey': this.apikey,
      'mobile':mobile,
      'content': `【${sign}】${content}`
    };

    return this._post({ path, post_data });
  };

  /**
   *
   * @param signature
   */
  setSignature = (signature) => {
    this.signature = signature;
  }

  /**
   *
   * @param mobile
   * @param content
   * @param signature
   * @returns {*}
   */
  sendNotification = ({ mobile, content, signature }) => {
    return this._send_sms({ path: this.url_send_notification, mobile, content, signature });
  };

}

export { DingDongCloud };
