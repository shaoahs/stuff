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
  packet.data = `{"data":["25","22","16","16","02","12","07","05","05","16","10","10","03","23","25","25","24","21"],"color":{"lines":9,"score":90},"star":{"cnts":0,"score":0},"totem":{"score":30000}}`;
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
