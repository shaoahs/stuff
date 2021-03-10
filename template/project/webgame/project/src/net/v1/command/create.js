import app from 'entity/app';

/**
 * 建立遊戲 (舊版)
 */
let Command = {
  async handle (obj) {

    console.log('[收到] create :' + JSON.stringify(obj));

    app.game.play();

    app.decimal = 2;
    let lib = await import('entity/main');
    let Main = lib.default;
    let main = Main.getSingleton();
    if (main) {
      let mainSet = await import('entity/mainSet');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(app.game);
      main.setInitMap(mainSet.normal);
      main.eventFinish();
      main.addToScene();
    }

    if (app.game.scene.setOverviewVisible) {
      app.game.scene.setOverviewVisible(false);
    }
  }
};

export default Command;


/**
 * 建立遊戲 (新版)
 */
export async function send () {
  let net = await import('net/network');

  // 傳送
  let netCmd = net.getCommand();
  const CMD = netCmd.CMD;
  let dataObj = {};

  console.log('[傳送] 建立遊戲');
  let result = await net.sendCommand(CMD.CREATE, dataObj);

  // 判斷是否是舊版
  if ((typeof result === 'number') || (typeof result === 'boolean')) {
    return;
  }

  console.log('[收到] 建立遊戲');
  console.log(result);

  app.decimal = 2;
  let lib = await import('entity/main');
  let Main = lib.default;
  let main = Main.getSingleton();
  if (main) {
    let mainSet = await import('entity/mainSet');
    main.setInitMap(mainSet.normal);
    main.eventFinish();
    main.addToScene();
  }
  app.game.play();
}
