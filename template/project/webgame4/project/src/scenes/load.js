import app from 'entity/app';

let isCreate = false;
let sceneSounds = null;
let sceneTextures = null;

export async function create () {
  let sceneManager = app.nuts.scene.sceneManager;
  let game = app.game;

  // 是否需要建立
  if (!isCreate) {

    // 讀取資源檔
    let vendor = await import('src/vendor');
    
    let res;
    if (app.setting.useAvif) {
      res = await vendor.get('v2load');
    } else {
      res = await vendor.get('v1load');
    }
    
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
    app.sounds = sceneSounds.sounds;

    config = {
      game,
      infoList: [
        { eventName: 'texture',   obj: res}
      ]
    };

    console.log('[讀取資源] 圖檔');
    sceneTextures = await sceneManager.createScene(config);
    console.log('[讀取資源] 完成');
    console.log(sceneTextures);

    let mainSet = await import('scene/mainSet');
    await mainSet.reload(sceneTextures);
    isCreate = true;
  }

  //----------------------------------------
  // 播放背景音樂
  if(app.sounds) {
    let sound = app.sounds.demo;
    if (sound && sound.music && sound.music.play) {
      sound.music.volume(0.2);
      sound.music.play();
    }
  }
}
