import updateBalance from 'net/command/broadcast/updateBalance';

export const CMD = {
  UPDATE_BALANCE: 'updateBalance'
};
let Command = {
  handle (data) {
    console.log('[client:broadcast] ' + data);
    if (data && data.proto && data.json) {
      let json = JSON.parse(data.json);
      switch (data.proto) {

        // 更新玩家資料
        case CMD.UPDATE_BALANCE:
          updateBalance.handle(json);
          break;
      }
    }
  }
};

export default Command;
