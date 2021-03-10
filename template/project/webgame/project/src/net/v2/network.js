/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import app from 'entity/app';

import fmtGame from 'schema/game';
import * as vendor from 'src/vendor';


vendor.useNetV2();

let actionTypes = null;

/**
 * 網路相關
 *
 */
let currentID = null;
export let cmdList = null;

export function getActionTypes () {
  return actionTypes;
}


/**
 * init
 * @param conf {Object} conf
 */
export async function init (conf) {
  currentID = conf.id;

  if (currentID) {
    console.log('init id : ' + currentID);
    app.game.command.registerGameEvent(event, currentID);
  } else {
    console.log('init error');
    return Promise.reject('init error');
  }

  // protobuf 用
  let config = {
    gid: currentID,
    useObjectToGame: true,  // 是否直接使用
    schema: fmtGame, // json format
    checkName: 'Game.Demo.Z01.CheckAction',
    fields: [
      {
        name: 'data',  // 需要解碼的欄位名稱
        rootName: 'Game.Demo.Z01',  // package name
        typeName: 'ActionType',   // 命令清單代碼
        cmdList: [  // 命令清單
          'BetRequest',
          'ResultResponse',
          'CreateRequest',
          'CreateResponse'
        ]
      },
      {
        name: 'info',  // 需要解碼的欄位名稱
        rootName: 'Game.Demo.Z01.Info',  // package name
        typeName: 'ActionType',   // 命令清單代碼
        cmdList: [  // 命令清單
          'BaseResponse'
        ]
      },
      {
        name: 'jackpot',  // 需要解碼的欄位名稱
        rootName: 'Game.Demo.Z01.Jackpot',  // package name
        typeName: 'ActionType',   // 命令清單代碼
        cmdList: [  // 命令清單
          'BaseResponse'
        ]
      },
      {
        name: 'setting',  // 需要解碼的欄位名稱
        rootName: 'Game.Demo.Z01.Setting',  // package name
        typeName: 'ActionType',   // 命令清單代碼
        cmdList: [  // 命令清單
          'BaseResponse'
        ]
      }
    ]
  };

  if (app.game.command.register) {
    console.log('[註冊封包解碼]');
    actionTypes = await app.game.command.register(config);
    if (actionTypes) {
      console.log('[註冊成功]');
    } else {
      console.log('[註冊失敗]');
    }
    return actionTypes;
  }
}


/**
 * 傳送資料用
 * @param data 資料
 */
export async function send (data) {
  let packet = {
    format: 2,
    funcIndex: 9,
    data
  };
  let result = await app.game.command.send(packet, currentID);

  return result;
}
