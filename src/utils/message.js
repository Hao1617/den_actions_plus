/**
 * @File: message.js
 * @Desc: 配置消息
 */

const serverNotify = require("./serverNotify.js");

module.exports = function message(msg) {
	console.log(msg);
	serverNotify(msg);
};
