import * as nuts from 'nuts';
import Main from 'entity/main';

let sceneManager = nuts.scene.sceneManager;

let isCreate = false;

export async function create (/*game*/) {
  let main = Main.getSingleton();
  let center = main.getCenter();
  let game = center.game;

  console.log('[讀取資源]等待 2 秒');
  await game.idle(2.0);
  console.log('[讀取資源]2 秒後');

  // 是否需要建立
  if (isCreate) {
    return;
  }

  isCreate = true;

  // 讀取資源檔
  let vendor = await import('src/vendor');
  let res = await vendor.get('load');

  let config = {
    game,
    infoList: [
      { eventName: 'sound',   obj: res}
    ]
  };

  let scene = null;
  console.log('[讀取資源] 音效');
  scene = await sceneManager.createScene(config);
  console.log('[讀取資源] 完成');
  console.log(scene);

  // 設定音效物件
  center.sounds = scene.sounds;

  // 播放背景音樂
  let sound = scene.sounds.demo;
  if (sound && sound.music && sound.music.play) {
    sound.music.play();
  }

  //----------------------------------------

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
  await main.reload(scene);

  //----------------------------------------------
  console.log('[更新結束]等待 1 秒');
  await game.idle(1.0);
  console.log('[更新結束]1 秒後');
}
