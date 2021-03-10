import app from 'entity/app';

let isCreate = false;
let scene = null;
export async function create () {
  let sceneManager = app.nuts.scene.sceneManager;
  let lib = await import('entity/main');
  let Main = lib.default;
  let main = Main.getSingleton();
  let center = main.getCenter();
  console.log(center.game);
  console.log(app.game);
  let game = app.game;

  // 是否需要建立
  if (!isCreate) {
    let loading = app.nuts.ui.loading;

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('info');

    let config = {
      game,
      loading,
      infoList: [
        { eventName: 'texture', obj: res}
      ]
    };
    console.log('ZZZZ');
    scene = await sceneManager.createScene(config);
    isCreate = true;
    if (scene && scene.textures) {
      if (center.rule) {
        center.rule.reload(scene);
      }
    }
    console.log('XXXX');

  }
  console.log('等待 0.1 秒');
  await game.idle(0.1);
  console.log('0.1 秒後');
  console.log(scene);
  if (scene && center.rule) {
    center.rule.show();
  }


}


