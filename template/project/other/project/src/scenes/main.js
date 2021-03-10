import * as nuts from 'nuts';
import Main from 'entity/main';


let sceneManager = nuts.scene.sceneManager;

let isCreate = false;
let scene = null;
export async function create (game, loadingEvent) {

  // 是否需要建立
  if (!isCreate) {
    isCreate = true;

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('main');
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
    console.log('[讀取資源檔] 開始');
    scene = await sceneManager.createScene(config);
    console.log('[讀取資源檔] 完成');
  }
  console.log(scene);
  let main = new Main(scene);
  Main.setSingleton(main);
}


