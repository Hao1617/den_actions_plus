/**
 * @File: serverNotify.js
 * @Desc: 发送信息
 */

const sendMail = require("./sendMail");
const config = require("./config.js");

module.exports = function bot(message) {
	sendMail({
		from: "掘金",
		to: config.TO,
		subject: config.TEL + "定时任务",
		html: message,
	}).catch((error) => {
		console.log(`发送失败 => ${error}`);
	});
};
