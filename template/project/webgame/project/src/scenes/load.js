import app from 'entity/app';

let isCreate = false;
let sceneSounds = null;
let scene = null;

export async function create (game) {
  let sceneManager = app.nuts.scene.sceneManager;
  let lib = await import('entity/main');
  let Main = lib.default;
  let main = Main.getSingleton();
  let center = main.getCenter();

  // 是否需要建立
  if (!isCreate) {

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('load');

    let config = {
      game,
      infoList: [
        { eventName: 'sound',   obj: res}
      ]
    };

    console.log('[讀取資源] 音效');
    sceneSounds = await sceneManager.createScene(config);
    console.log('[讀取資源] 完成');
    console.log(sceneSounds);

    // 設定音效物件
    center.sounds = sceneSounds.sounds;

    config = {
      game,
      infoList: [
        { eventName: 'texture',   obj: res}
      ]
    };

    console.log('[讀取資源] 圖檔');
    scene = await sceneManager.createScene(config);
    console.log('[讀取資源] 完成');
    console.log(scene);
    isCreate = true;

    await main.reload(scene);
  }

  //----------------------------------------
  // 播放背景音樂
  let sound = center.sounds.demo;
  if (sound && sound.music && sound.music.play) {
    sound.music.volume(0.2);
    sound.music.play();
  }
}
