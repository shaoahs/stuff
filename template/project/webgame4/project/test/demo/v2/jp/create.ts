import * as message from 'demo/demo';

let logger = null;
let CustomFormat = null;
function init(config) {
  logger = config.logger;
  CustomFormat = config.CustomFormat;
}

// function decode(packet) {
//   let obj = null;
//   let Game = message.Game;
//   if(packet.format === CustomFormat.PROTOBUF) {
//     let check = Game.CheckAction.decode(packet.data);
//     if(check.actionType === Game.ActionType.BET) {
//       let value = Game.BetRequest.decode(packet.data);
//       obj = Game.BetRequest.toObject(value, {
//         defaults: true,
//         arrays: false,
//         objects: false,
//         oneofs: false
//       });
//     }
//   }

//   logger.info('輸入');
//   console.log(obj);
//   return obj;
// }

/**
 * 產生結果
 * @param input 輸入資訊
 */
function generate(input) {
  let packet = {};
  let Game = message.Game;

//  decode(input);

  try {
    // 建立遊戲
    let data = {
      actionType: Game.ActionType.CREATE_RESPONSE,
      betCoin: 0,
      betForm: [300,500,1000,1500,2500,5000,10000,25000,50000,100000],
      betFormAmount: 10,
      cmdResult: 0,
      credit: message.randInt(100, 10000000)
    };
    logger.info('建立遊戲');
    console.log(data);

    let Response = Game.CreateResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.format = CustomFormat.PROTOBUF;
    packet.data = buf;
  } catch (err) {
    console.error(err);
  }

  try {
    // 遊戲資訊
    let Command = Game.Info;
    let data = {
      actionType: Command.ActionType.NORMAL,
      aPIVersion: '1',
      chanceVersion: '2',
      libVersion: '3',
      packageVersion: '4',
      slotServerVersion: '5'
    };
    logger.info('遊戲資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.info = {
      format: CustomFormat.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }

  try {
    // 遊戲設定
    let Command = Game.Setting;
    let data = {
      actionType: Command.ActionType.NORMAL,
      betForm: [500,1000,2000,2500,5000,10000,12500,25000,50000,100000,125000,250000,500000],
      betFormIndex: 4,
      decimalPosition: 5,
      enableJP: false,
      isDemo: false,
      lastBet: 5000,
      lineAmount: 0
    };
    logger.info('遊戲設定');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.setting = {
      format: CustomFormat.PROTOBUF,
      data: buf
    };
  } catch (err) {
    console.error(err);
  }

  try {
    // JP 資訊
    let Command = Game.Jackpot;
    let data = {
      actionType: Command.ActionType.NORMAL,
      mJpOutIdx: message.randInt(0, 30),
      mJpOutValue: message.randInt(2, 8),
      mJpValue: [15652692963,2294455271,83607676,13329065,5014439,1430232,1797476],
      resultCode: 1
    };
    logger.info('JP 資訊');
    console.log(data);

    let Response = Command.BaseResponse;
    let value = Response.create(data);
    let buf = Response.encode(value).finish();

    // 設定 data 欄位格式
    packet.jackpot = {
      format: CustomFormat.PROTOBUF,
      data: buf
    };  
  } catch (err) {
    console.error(err);
  }

  return packet;
}

export default {
  init,
  generate
}
