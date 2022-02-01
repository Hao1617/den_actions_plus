/**
 * Created by huangqihong on 2022/01/07 23:35:00
 */
const dotEnv = require("dotenv");
dotEnv.config("./env");

const { COOKIE, TOKEN } = require("./utils/config.js");
const message = require("./utils/message");
const jueJinApi = require("./api/juejin")();
const miningApi = require("./api/mining")();
const jwt = require("jsonwebtoken");
const firstData = require("./utils/first");

let juejinUid = "";

if (!(COOKIE && TOKEN)) {
  message("获取不到游戏必须得COOKIE和TOKEN，请检查设置");
} else {
  let gameId = ""; // 发指令必须得gameId
  let deep = 0;
  let todayDiamond = 0;
  let todayLimitDiamond = 0;
  async function getInfo() {
    const time = new Date().getTime();
    console.log(todayDiamond, todayLimitDiamond);
    const userInfo = await miningApi.getUser();
    juejinUid = userInfo.user_id;

    const resInfo = await miningApi.getInfo(juejinUid, time);
    deep = resInfo.gameInfo ? resInfo.gameInfo.deep : 0;
    gameId = resInfo.gameInfo ? resInfo.gameInfo.gameId : 0;
    todayDiamond = resInfo.userInfo.todayDiamond;
    todayLimitDiamond = resInfo.userInfo.todayLimitDiamond;
    return Promise.resolve(resInfo);
  }
  getInfo().then(() => {
    if (todayDiamond < todayLimitDiamond) {
      playGame().then(() => { });
    }
  });

  // 暂停，避免快速请求以及频繁请求
  async function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  /**
   * 循环游戏
   */
  async function playGame() {
    try {
      // 开始
      const startTime = new Date().getTime();
      const startParams = {
        roleId: 3,
      };
      const startData = await miningApi.start(startParams, juejinUid, startTime);
      await sleep(3000);
      console.log("startData", startData);
      gameId = startData.gameId;
      // 发起指令
      const commandTime = +new Date().getTime();
      const commandParams = {
        command: firstData.command,
      };
      const xGameId = getXGameId(gameId);
      const commandData = await miningApi.command(commandParams, juejinUid, commandTime, xGameId);
      deep = commandData.curPos.y;
      await sleep(3000);
      console.log("commandData", commandData);
      // 结束
      const overTime = +new Date().getTime();
      const overParams = {
        isButton: 1,
      };
      const overData = await miningApi.over(overParams, juejinUid, overTime);
      await sleep(3000);
      console.log("overData", overData);
      deep = overData.deep;
      // 更换地图
      const mapTime = +new Date().getTime();
      if (deep < 500) {
        await sleep(3000);
        await miningApi.freshMap({}, juejinUid, mapTime);
      }
      await sleep(3000);
      await getInfo().then(res => {
        if (todayDiamond < todayLimitDiamond) {
          playGame();
        } else {
          async function junJin() {
            try {
              // 先执行签到、抽奖以及沾喜气
              await jueJinApi.checkIn(); // 抽奖一次
              const drawResult = await jueJinApi.drawApi();
              const dipParams = { lottery_history_id: "7052109119238438925" };
              const dipResult = await jueJinApi.dipLucky(dipParams);
              const scoreAll = await jueJinApi.scoreAll();
              message(
                `
                <h1>自动签到通知</h1>
                <p>恭喜抽到：${drawResult.lottery_name}</p>
                <p>获取幸运点：${dipResult.dip_value}</p>
                <p>当前幸运点：${dipResult.total_value}</p>
                <p>今日限制矿石：${res.userInfo.todayLimitDiamond}</p>
                <p>已获取矿石：${res.userInfo.todayDiamond}</p>
                <p>当前积分：<strong>${scoreAll}</strong></p>
                `
              );
            } catch (e) {
              message(`有异常，请手动操作,${e.message}`);
            }
          }
          junJin().then(() => {});
        }
      });
    } catch (e) {
      console.log(e);
      await sleep(3000);
      // 结束
      const overTime = +new Date().getTime();
      const overParams = {
        isButton: 1,
      };
      await miningApi.over(overParams, juejinUid, overTime);
      await sleep(3000);
      await getInfo().then(res => {
        if (todayDiamond < todayLimitDiamond) {
          playGame();
        } else {
          async function junJin() {
            try {
              // 先执行签到、抽奖以及沾喜气
              await jueJinApi.checkIn(); // 抽奖一次
              const drawResult = await jueJinApi.drawApi();
              const dipParams = { lottery_history_id: "7052109119238438925" };
              const dipResult = await jueJinApi.dipLucky(dipParams);
              const scoreAll = await jueJinApi.scoreAll();
              message(
                `
                <h1>自动签到通知</h1>
                <p>恭喜抽到：${drawResult.lottery_name}</p>
                <p>获取幸运点：${dipResult.dip_value}</p>
                <p>当前幸运点：${dipResult.total_value}</p>
                <p>今日限制矿石：${res.userInfo.todayLimitDiamond}</p>
                <p>已获取矿石：${res.userInfo.todayDiamond}</p>
                <p>当前积分：<strong>${scoreAll}</strong></p>
                `
              );
            } catch (e) {
              message(`有异常，请手动操作,${e.message}`);
            }
          }
          junJin().then(() => {});
        }
      });
    }
  }
  function getXGameId(id) {
    const time = +new Date().getTime();
    return jwt.sign(
      {
        gameId: id,
        time: time,
        // eslint-disable-next-line max-len
      },
      "-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n",
      {
        algorithm: "ES256",
        expiresIn: 2592e3,
        header: {
          alg: "ES256",
          typ: "JWT",
        },
      }
    );
  }
}
