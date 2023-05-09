import app from 'entity/app';

let isCreate = false;
let scene = null;
export async function create () {
  let sceneManager = app.nuts.scene.sceneManager;
  let main = app.scenes.main;
  let game = app.game;

  // 是否需要建立
  if (!isCreate) {
    let loading = app.nuts.ui.loading;

    // 讀取資源檔
    let vendor = await import('src/vendor');

    let res;
    if (app.setting.useAvif) {
      res = await vendor.get('v2info');
    } else {
      res = await vendor.get('v1info');
    }

    let config = {
      game,
      loading,
      infoList: [
        { eventName: 'texture', obj: res}
      ]
    };
    console.log('[info 讀取資源檔] 開始');
    scene = await sceneManager.createScene(config);
    console.log('[info 讀取資源檔] 完成');
    isCreate = true;
    if (scene && scene.textures) {
      if (main.rule) {
        main.rule.reload(scene);
      }
    }
  }
  console.log('等待 0.1 秒');
  await game.idle(0.1);
  console.log('0.1 秒後');
  console.log(scene);
  if (scene && main.rule) {
    main.rule.show();
  }
}


