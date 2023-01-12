/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
// import * as net from 'net/network';
// import * as command from 'net/command';
// import broadcast from 'net/command/broadcast';


/**
 * receive game data
 * @param data {Object} 接收網路資料（遊戲用）
 */
export async function recvGameData (data) {
  let net = await import('net/network');
  let command = await import('net/command');

  let obj = null;
  let cmdList = net.cmdList;
  const CMD = command.CMD;
  let commandName;

  // 處理 data 欄位
  if (data.data) {
    commandName = data.command;
    obj = JSON.parse(data.data);

    // 處理命令
    let cmd = cmdList[commandName];
    if (cmd) {
      if (cmd.handle) {
        cmd.handle(obj, data);
      }
    }
  }

  // 是否有 JP 命令
  if (data.jackpot) {
    obj = JSON.parse(data.jackpot);
    let cmd = cmdList[CMD.JACKPOT];
    if (cmd.handle) {
      cmd.handle(obj);
    }
  }

}

/**
 * 接收廣播訊息
 * @param data {Object} 廣播內容
 */
export async function recvBroadcast (data) {
  let cmd = JSON.parse(data);
  let broadcast = await import('net/command/broadcast');
  broadcast.handle(cmd);
}
