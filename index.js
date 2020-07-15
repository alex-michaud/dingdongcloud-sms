import https from 'https';

const errorDefinitions = {
  "-1":	"User account name and password do not match",
  "0": "User SMS failed to send",
  "1":	"User SMS is successfully sent, or data query is successful",
  "2":	"Insufficient user balance",
  "3":	"User deduction failed",
  "4":	"Phone number is empty",
  "5":	"Content Pack Prohibited Words",
  "6":	"The user has no relevant permissions, please contact the administrator for activation (generally, the marketing permission is activated)",
  "7":	"ip is not bound, please add ip whitelist in the background",
  "8":	"Too many submissions of the same number",
  "9":	"The signature is empty and must be accompanied by a signature in the format []",
  "10":	"Wrong marketing content (please add'unsubscribe back to T'as the end)",
  "11":	"The signature is not reviewed, please contact customer service",
  "12":	"The maxSize value is incorrect (please ensure it is between 1-1024)",
  "13":	"You have not created a valid template, please create a verification code template in the background, and ensure that it has been approved",
  "14":	"The content of the voice verification code can only be 4-6 digits",
  "15":	"The number contains a wrong number, please confirm and submit",
  "16":	"The template does not contain [#ertification code#]",
  "17":	"The signature already exists, please do not add it again",
  "18":	"SMS content is empty",
  "19":	"You have not created a valid template, please create a notification template in the background and ensure that it has been approved",
  "20":	"Traffic packet ID is empty",
  "21":	"Traffic packet type and mobile phone number do not match",
  "22":	"Traffic packet selection is wrong",
  "23":	"The content fails to match the template, starting from \"%s\". The reasons for the failure may be: 1. Inconsistent Chinese and English symbols; 2. Missing punctuation marks; 3. More or less spaces; 4. Typos (you and you) 5. The contents are not specific values.",
  "24":	"Batch submission successful",
  "25":	"Bulk sending content and numbers do not correspond",
  "26":	"The time format sent at the wrong time is incorrect, and it should be submitted in the form of'yyyy-MM-dd HH:mm:ss', for example, '2012-01-01 11:12:11'",
  "27":	"Content parsing error",
  "28":	"The number of batch sending numbers exceeds the limit",
  "29":	"Bulk sending JSON format is incorrect",
  "30":	"Send duplicate numbers in bulk",
  "90":	"Parameter error",
  "91":	"Please perform corporate information authentication or contact customer service",
  "99":	"Internal exception"
}

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

      const req = https.request(options, (res) => {
        // console.log(`statusCode: ${res.statusCode}`)
        let chunks = '';

        res.on('data', (chunk) => {
          chunks += chunk;
        })

        res.on('end', () => {
          const response = JSON.parse(chunks);
          /*
          Note :
            DingDongCloud API always return the http code 200 even if there is an error.
            We have to look into the response object to see if we have an error code
           */
          if (parseInt(response.code) === 1) {
            resolve(response);
          }
          else {
            reject(new DingDongCloudError(response));
          }
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

class DingDongCloudError extends Error {
  constructor(obj) {
    super(obj.msg);
    this.name = 'DingDongCloudError';
    this.code = obj.code || null;
    this.result = obj.result || null;
    this.message_en = (this.code !== null) ? errorDefinitions[this.code] : ''
  }
}

export { DingDongCloud };
