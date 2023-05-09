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
    command: "bet"
  };
  packet.resultCode = 1;

  packet.format = CustomFormat.JSON;
  packet.data = `{"data":["11","28","05","11","18","04","20","02","13","25","10","21","06","15","18","24","06","20"],"color":{"lines":6,"score":60},"star":{"cnts":3,"score":10},"totem":{"score":20000}}`;
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
