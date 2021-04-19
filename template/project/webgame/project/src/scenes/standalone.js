import app from 'entity/app';

let isCreate = false;
let scene = null;
export async function create (game) {

  let ui = app.nuts.ui;
  let sceneManager = app.nuts.scene.sceneManager;

  let loading = ui.loading;

  let lib = await import('entity/main');
  let Main = lib.default;

  // 是否需要建立
  if (!isCreate) {

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('main');
    console.log(res);

    let config = {
      game,
      loading,
      infoList: [
        { eventName: 'texture', obj: res},
        { eventName: 'spine', obj: res},
        { eventName: 'object',  obj: res}
      ]
    };
    console.log('[讀取資源檔] 開始');
    scene = await sceneManager.createScene(config);

    // isCreate = true;
    console.log('[讀取資源檔] 完成');

    console.log(scene);
    let main = new Main(scene);
    Main.setSingleton(main);

  } else {
    game.play();

    // 重新設定
    scene.game = game;
    let main = Main.getSingleton();
    main.removeFromScene();
    main.setGame(game);
    let center = main.getCenter();
    center.game = game;
    center.layer = game.layer.main;
  }
  game.textures = scene.textures;
}
