/**
 * @File: juejin.js
 * @Desc: 签到\抽奖\沾喜气\查询积分
 */

const request = require("../utils/request");
const { COOKIE } = require("../utils/config.js");

module.exports = function () {
	return {
		/**
		 * 签到
		 */
		checkIn: function () {
			return request({
				url: "https://api.juejin.cn/growth_api/v1/check_in",
				method: "post",
				headers: {
					cookie: COOKIE,
				},
			});
		},
		/**
		 * 抽奖
		 */
		drawApi: function () {
			return request({
				url: "https://api.juejin.cn/growth_api/v1/lottery/draw",
				method: "post",
				headers: {
					cookie: COOKIE,
				},
			});
		},
		/**
		 * 沾喜气
		 */
		dipLucky: function (params) {
			return request({
				url: "https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?aid=2608",
				method: "post",
				data: params,
				headers: {
					cookie: COOKIE,
				},
			});
		},
		/**
		 * 查询积分
		 */
		scoreAll: function () {
			return request({
				url: "https://api.juejin.cn/growth_api/v1/get_cur_point",
				method: "get",
				headers: {
					cookie: COOKIE,
				},
			});
		},
	};
};
