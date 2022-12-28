/**
 * @File: sendMail.js
 * @Desc: 配置邮件
 */

const nodemailer = require("nodemailer");
const config = require("./config.js");

const sendMail = async (data) => {
	let transporter = nodemailer.createTransport({
		host: "smtp.qq.com",
		port: "465",
		secureConnection: true,
		auth: {
			user: config.USER,
			pass: config.PASS,
		},
	});
	data.from = `"${data.from}" ${config.USER}`;

	await transporter.sendMail(data);
};

module.exports = sendMail;
