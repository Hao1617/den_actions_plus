/**
 * Created by huangqihong on 2022/1/8.
 * 发送邮件
 */

const sendMail = require("./sendMail");
const config = require("./config.js");

module.exports = function bot(message) {
  console.log(config.TO);
  sendMail({
    form: "掘金",
    to: config.TO,
    subject: config.TEL + "定时任务",
    html: message,
  }).catch(error => {
    console.log(`发送失败 => ${error}`);
  });
};
