import * as message from 'src/slot/demo';

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
    command: "result"
  };
  packet.resultCode = 1;
  
  packet.format = CustomFormat.JSON;
  packet.data = `{"NormalGameData":[{"addFreeTimes":0,"allOfKind":0,"cellBox":[1,1,0,0,0,1,0,1,1,0,1,1,1,0,1],"cellTotem":[1,1,13,10,13,1,9,1,1,9,1,1,1,11,1],"endFreeTimes":0,"endLight":4,"fiveOfKind":1,"lineHitAmount":[0,0,3,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,3,3,0,3,0,3,3,0,0,0,0,3,3,0,4,3,3,4,5,0,0,0,3,0,0,3,3,0,3,0,0,3,3,0,0,0,5,0,0,0,0,4,4,3,3,4,4,0,0,0,0,5,4,0,0,0,0,0,0,0,4,0,0,0,0,0,5,3,3,0,4,4,5,0,0,0,4,0,0],"lineHitScore":[0,0,1200,0,0,0,1200,1200,1200,1200,1200,0,0,0,0,0,0,0,0,0,1200,1200,0,1200,0,1200,1200,0,0,0,0,1200,1200,0,1800,1200,1200,1800,3000,0,0,0,1200,0,0,1200,1200,0,1200,0,0,1200,1200,0,0,0,3000,0,0,0,0,1800,1800,1200,1200,1800,1800,0,0,0,0,3000,1800,0,0,0,0,0,0,0,1800,0,0,0,0,0,3000,1200,1200,0,1800,1800,3000,0,0,0,1800,0,0],"lineHitTotem":[0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,1,1,0,1,1,1,1,1,0,0,0,1,0,0,1,1,0,1,0,0,1,1,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,1,0,0],"scatterBonusAmount":0,"scatterFreeAmount":0,"startFreeTimes":0,"startLight":4,"totalLineScore":64800,"wildMtp":1,"winScore":64800},{"addFreeTimes":0,"allOfKind":0,"cellBox":[1,1,0,0,0,1,1,1,1,0,1,1,1,0,1],"cellTotem":[1,1,2,3,4,1,1,1,1,6,1,1,1,9,1],"endFreeTimes":0,"endLight":4,"fiveOfKind":1,"lineHitAmount":[4,0,3,4,0,0,3,3,3,3,3,0,5,0,4,4,5,3,0,0,3,3,0,3,0,3,3,4,0,5,0,3,3,0,4,3,3,4,5,4,5,0,3,0,4,3,3,0,3,4,4,3,3,0,5,0,5,0,3,3,3,4,4,3,3,4,4,0,3,5,4,5,4,0,3,3,3,3,3,0,4,3,3,0,4,0,5,3,3,0,4,4,5,3,0,0,4,0,3],"lineHitScore":[1800,0,1200,1800,0,0,1200,1200,1200,1200,1200,0,3000,0,1800,1800,3000,1200,0,0,1200,1200,0,1200,0,1200,1200,1800,0,3000,0,1200,1200,0,1800,1200,1200,1800,3000,1800,3000,0,1200,0,1800,1200,1200,0,1200,1800,1800,1200,1200,0,3000,0,3000,0,1200,1200,1200,1800,1800,1200,1200,1800,1800,0,1200,3000,1800,3000,1800,0,1200,1200,1200,1200,1200,0,1800,1200,1200,0,1800,0,3000,1200,1200,0,1800,1800,3000,1200,0,0,1800,0,1200],"lineHitTotem":[1,0,1,1,0,0,1,1,1,1,1,0,1,0,1,1,1,1,0,0,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,0,1,0,1],"scatterBonusAmount":0,"scatterFreeAmount":0,"startFreeTimes":0,"startLight":4,"totalLineScore":119400,"wildMtp":1,"winScore":119400},{"addFreeTimes":0,"allOfKind":0,"cellBox":[1,1,1,0,0,1,1,1,1,0,1,1,1,0,1],"cellTotem":[1,1,1,6,10,1,1,1,1,6,1,1,1,10,1],"endFreeTimes":0,"endLight":4,"fiveOfKind":1,"lineHitAmount":[4,3,3,4,5,3,3,3,3,3,3,4,5,4,4,4,5,3,3,3,3,3,3,3,3,3,3,4,4,5,4,3,3,5,4,3,3,4,5,4,5,3,3,5,4,3,3,3,3,4,4,3,3,4,5,4,5,3,3,3,3,4,4,3,3,4,4,3,3,5,4,5,4,3,3,3,3,3,3,4,4,3,3,5,4,4,5,3,3,5,4,4,5,3,3,4,4,3,3],"lineHitScore":[1800,1200,1200,1800,3000,1200,1200,1200,1200,1200,1200,1800,3000,1800,1800,1800,3000,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1800,1800,3000,1800,1200,1200,3000,1800,1200,1200,1800,3000,1800,3000,1200,1200,3000,1800,1200,1200,1200,1200,1800,1800,1200,1200,1800,3000,1800,3000,1200,1200,1200,1200,1800,1800,1200,1200,1800,1800,1200,1200,3000,1800,3000,1800,1200,1200,1200,1200,1200,1200,1800,1800,1200,1200,3000,1800,1800,3000,1200,1200,3000,1800,1800,3000,1200,1200,1800,1800,1200,1200],"lineHitTotem":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"scatterBonusAmount":0,"scatterFreeAmount":0,"startFreeTimes":0,"startLight":4,"totalLineScore":166200,"wildMtp":1,"winScore":166200},{"addFreeTimes":0,"allOfKind":0,"cellBox":[1,1,1,0,0,1,1,1,1,0,1,1,1,0,1],"cellTotem":[1,1,1,4,6,1,1,1,1,5,1,1,1,10,1],"endFreeTimes":0,"endLight":4,"fiveOfKind":1,"lineHitAmount":[4,3,3,4,5,3,3,3,3,3,3,4,5,4,4,4,5,3,3,3,3,3,3,3,3,3,3,4,4,5,4,3,3,5,4,3,3,4,5,4,5,3,3,5,4,3,3,3,3,4,4,3,3,4,5,4,5,3,3,3,3,4,4,3,3,4,4,3,3,5,4,5,4,3,3,3,3,3,3,4,4,3,3,5,4,4,5,3,3,5,4,4,5,3,3,4,4,3,3],"lineHitScore":[1800,1200,1200,1800,3000,1200,1200,1200,1200,1200,1200,1800,3000,1800,1800,1800,3000,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1800,1800,3000,1800,1200,1200,3000,1800,1200,1200,1800,3000,1800,3000,1200,1200,3000,1800,1200,1200,1200,1200,1800,1800,1200,1200,1800,3000,1800,3000,1200,1200,1200,1200,1800,1800,1200,1200,1800,1800,1200,1200,3000,1800,3000,1800,1200,1200,1200,1200,1200,1200,1800,1800,1200,1200,3000,1800,1800,3000,1200,1200,3000,1800,1800,3000,1200,1200,1800,1800,1200,1200],"lineHitTotem":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"scatterBonusAmount":0,"scatterFreeAmount":0,"startFreeTimes":0,"startLight":4,"totalLineScore":166200,"wildMtp":1,"winScore":166200}],"WholeGameData":{"bonusGame":false,"freeGame":false,"gameStatus":0,"jpGame":false,"totalBonusWinScore":0,"totalFreeGameTimes":0,"totalFreeWinScore":0,"totalJPWinScore":0,"totalNormalWinScore":166200,"totalWinScore":166200},"bet":600,"cmdResult":1,"credit":33664535900,"normalGameData":[{"$ref":"$.NormalGameData[0]"},{"$ref":"$.NormalGameData[1]"},{"$ref":"$.NormalGameData[2]"},{"$ref":"$.NormalGameData[3]"}],"wholeGameData":{"$ref":"$.WholeGameData"},"win":166200}`;
  packet.data = utf8Encoder.encode(packet.data);

  let jackpot = {};
  jackpot.format = CustomFormat.JSON;
  jackpot.data = `{"mJpOutIdx":0,"mJpOutScene":"NULL","mJpOutValue":0,"mJpValue":[630448351,568512471,687529628,62409960,70048720,1041400],"resultCode":1}`;
  jackpot.data = utf8Encoder.encode(jackpot.data);
  packet.jackpot = jackpot;


  //----
  logger.info('產生資料');
  console.log(packet);
  return packet;
}

export default {
  init,
  generate
}
