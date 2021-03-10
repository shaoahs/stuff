import protobuf from 'protobufjs';
import json from 'schema/server';

import * as demo from 'src/slot/demo';

//import * as abcd from 'src/slot/abcd';

let logger = null;
let root = protobuf.Root.fromJSON(json);
let Server = root.Game.Server;

// 命令格式
let CustomFormat = Server.CustomFormat;
console.log(CustomFormat);

let GameRequest = Server.GameRequest;
let GameResponse = Server.GameResponse;

function init(obj) {
  logger = obj;
  demo.init({
    logger,
    CustomFormat
  });
}

function request(buf, ws) {
  let value = GameRequest.decode(buf);
  let obj = GameRequest.toObject(value, {
    defaults: true,
    arrays: false,
    objects: false,
    oneofs: false
  });
  return obj;
}

function response(obj, ws) {
  let buf = null;
  let cmd  = demo.get(ws);

  if(cmd) {
    // 產生資料
    let object = cmd.generate(obj);
    object.funcIndex = parseInt(obj.funcIndex) || 0;

    // 檢查資料
    let err = GameResponse.verify(object);
    if(err) {
      console.error(err);
    } else {
      let value = GameResponse.create(object);
      buf = GameResponse.encode(value).finish();
    }
  }
  return buf;
}

export default {
  init,
  request,
  response
};
