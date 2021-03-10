import protobuf from 'protobufjs';
import json from 'schema/slot/demo/game';
import test from 'src/test';

/**
 * 產生指定範圍的整數的亂數
 * @param begin 起始數字
 * @param end   結束數字
 */

function randInt(begin,  end) {
  let value = parseInt(Math.random()*1000000000);
  value = begin + (value % (end-begin+1));
  return value;
}

let root = protobuf.Root.fromJSON(json);
let Game = root.Game.Slot.Sample;

let cmdList = [
  test.demoJP.create,
  test.demoJP.lost,
  test.demoJP.lost,
  test.demoJP.win,
  test.demoJP.lost,
  test.demoJP.win,
];


// let cmdList = [
//   test.jsonDemoJP.create,
//   test.jsonDemoJP.lost,
//   test.jsonDemoJP.win,
//   test.jsonDemoJP.win,
//   test.jsonDemoJP.lost,
//   test.jsonDemoJP.win,
// ];


function init(config) {
  for (const key in test) {
    const obj = test[key];
    let names = Object.getOwnPropertyNames(obj);
    names.forEach(name => {
      let cmd = obj[name];
      if(cmd?.init) {
        cmd.init(config);
      }
    });
  }
}

function get(ws) {
  let cmd = null;
  let info = ws.info;
  if(info.cmdIndex < cmdList.length) {
    cmd = cmdList[info.cmdIndex];
    info.cmdIndex += 1;
  }
  return cmd;
}

export {
  randInt,
  init,
  get,
  Game
};
