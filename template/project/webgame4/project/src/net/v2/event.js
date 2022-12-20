/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
/**
 * receive game data
 * @param data {Object} 接收網路資料（舊版）
 */
export function recvGameData (/*data*/) {
  // console.log('[網路]收到資料 (不使用)');

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
