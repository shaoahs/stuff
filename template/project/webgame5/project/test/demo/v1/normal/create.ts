import * as message from 'demo/demo';

let logger = null;
let CustomFormat = null;
function init(config) {
  logger = config.logger;
  CustomFormat = config.CustomFormat;
}

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate(input) {
  let Game = message.Game;
  let utf8Encoder = new TextEncoder();

  let packet = {
    command: "create"
  };
  packet.resultCode = 1;
  
  packet.format = CustomFormat.JSON;
  packet.data = `{"data":["00","22","21","27","27","11","27","10","25","07","24","24","23","03","16","18","14","27"],"color":{"lines":0,"score":0},"star":{"cnts":1,"score":0},"totem":{"score":10000}}`;
  packet.data = utf8Encoder.encode(packet.data);

  //----
  logger.info('產生資料');
  console.log(packet);

  return packet;
}

export default {
  init,
  generate
}
