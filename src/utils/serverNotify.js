/**
 * Created by huangqihong on 2022/1/8.
 * 发送邮件
 */

const sendMail = require("./sendMail");
const config = require("./config.js");

// function send({ pushKey, title, desp }) {
//   return new Promise((resolve, reject) => {
//     const option = {
//       url: `https://sctapi.ftqq.com/${pushKey}.send`,
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       params: {
//         title,
//         desp,
//       },
//     };
//     axios(option).then(
//       res => {
//         resolve();
//         console.log("发送成功");
//       },
//       err => {
//         reject(err);
//       }
//     );
//   });
// }

// let msg = "掘金：\n";
module.exports = function bot(message) {
  sendMail({
    form: "掘金",
    to: config.TO,
    subject: config.TEL + "定时任务",
    html: message,
  }).catch(error => {
    console.log(`发送失败 => ${error}`);
  });
  // console.log("mes", message);
  // if (config.SERVERID) {
  //   msg += message + "\n";
  //   send({
  //     pushKey: config.SERVERID, // 企业
  //     title: config.TEL + "定时任务", // title
  //     to: config.TO, // 邮件发给谁
  //     desp: msg, // desp
  //   }).catch(error => {
  //     console.log(`发送失败 => ${error}`);
  //   });
  // }
};
