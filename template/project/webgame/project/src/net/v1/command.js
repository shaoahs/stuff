/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import create from 'net/command/create';
import bet from 'net/command/bet';
import result from 'net/command/result';
import jackpot from 'net/command/jackpot';

/**
 * 處理收到的網路命令
 *
 */
export const CMD = {
  CREATE: 'create',
  BET: 'bet',
  RESULT: 'result',
  JACKPOT: 'jackpot'
};

let isInit = false;
let cmdList = null;

/**
 * 初始化命令列表
 * @return {Object} 傳回命令清單
 */
export function init () {
  if (isInit) {
    return cmdList;
  }

  isInit = true;
  let list = {};

  /**
   * 建立
   */
  list[CMD.CREATE] = create;

  /**
   * 下注相關
   */
  list[CMD.BET] = bet;
  list[CMD.RESULT] = result;

  /**
   * 更新 jp 資料
   */
  list[CMD.JACKPOT] = jackpot;

  cmdList = list;

  // 儲存命令清單
  create.cmdList = cmdList;
  bet.cmdList = cmdList;
  result.cmdList = cmdList;
  jackpot.cmdList = cmdList;

  create.CMD = CMD;
  bet.CMD = CMD;
  result.CMD = CMD;
  jackpot.CMD = CMD;

  return list;
}
