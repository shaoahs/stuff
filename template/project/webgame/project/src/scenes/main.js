import app from 'entity/app';

let isBusy = false;
let scene = null;

export function getScene () {
  return scene;
}


export async function create (game, loadingEvent) {

  let sceneManager = app.nuts.scene.sceneManager;

  if (isBusy) {
    return;
  }
  isBusy = true;

  // 是否需要建立
  if (!scene) {

    // 讀取資源檔
    let vendor = await import('src/vendor');
    
    let res;
    if (app.setting.useAvif) {
      res = await vendor.get('v2main');
    } else {
      res = await vendor.get('v1main');
    }
    console.log(res);

    let config = {
      game,
      loadingEvent,
      infoList: [
        { eventName: 'texture', obj: res},
        { eventName: 'spine', obj: res},
        { eventName: 'object',  obj: res}
      ]
    };

    console.log('[main 讀取資源檔] 開始');
    scene = await sceneManager.createScene(config);
    console.log('[main 讀取資源檔] 完成');
    console.log(scene);
  } else {
    game.play();

    // 重新設定
    scene.game = game;

    // 顯示讀取畫面
    if (loadingEvent) {
      await game.idle(0.01);
      loadingEvent.start();

      await game.idle(0.01);

      let value = {
        currentProgress: 100,
        totalProgress: 100
      };
      loadingEvent.sceneResLoading(value);

      await game.idle(0.01);
      loadingEvent.finish();
    }
  }

  game.textures = scene.textures;
  app.scenes.main = scene;
  isBusy = false;
  return scene;
}
