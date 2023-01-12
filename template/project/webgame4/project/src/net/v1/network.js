/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import app from 'entity/app';
import * as command from 'net/command';
import * as event from 'net/event';
import * as vendor from 'src/vendor';


vendor.useNetV1();

/**
 * 網路相關
 */
let currentID = null;
export let cmdList = null;


/**
 * init
 * @param conf {Object} conf
 */
export async function init (conf) {
  currentID = conf.id;

  //--註冊網路事件
  cmdList = command.init();

  if (currentID) {
    console.log('init id : ' + currentID);
    app.game.command.registerGameEvent(event, currentID);
  } else {
    console.log('init error');
    return Promise.reject('init error');
  }

  return command;
}

export function getCommand () {
  return command;
}

/**
 * send command
 * @param cmd {String} command id
 * @param dataObj {Object} data object
 */
export async function sendCommand (cmd, dataObj) {
  let packet = {
    format: 0,
    funcIndex: 9,
    command: cmd,
    data: JSON.stringify(dataObj)
  };

  let result = await app.game.command.send(packet, currentID);
  return result;
}

