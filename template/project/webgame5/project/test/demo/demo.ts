import test from 'test/output';

import protobuf from 'protobufjs';
import fmtGame from 'schema/game';

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

let Game = null;

// let cmdList = [
//   test.jp.create,
//   test.jp.lost,
//   test.jp.lost,
//   test.jp.win,
//   test.jp.lost,
//   test.jp.win,
// ];

let cmdList = [
  test.jp.create,
  test.jp.lost,
  test.jp.win,
  test.jp.win,
  test.jp.lost,
  test.jp.win,
];


function init(config) {
  console.log('[demo] init');
  let root = protobuf.Root.fromJSON(fmtGame);

  let group = config.group;
  group = group.replace(group[0], group[0].toUpperCase());

  let name = config.name;
  name = name.replace(name[0], name[0].toUpperCase());

  console.log(group);
  console.log(name);

  Game = root.Game[group][name];

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
