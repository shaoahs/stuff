/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

import * as nuts from 'nuts';
import * as strings from 'language/strings';
import Main from 'entity/main';

/**
 * 建立場景
 * @param conf {Object} lobby 傳入建立場景設定檔
 */
export function create (conf) {
  let game = conf.game;
  let loadingMgr = nuts.scene.loadingManager;
  let sceneList;

  // 設定多語
  strings.setLanguage(conf.langID);
  console.log(strings.get('loading'));

  // 設定 base URL
  let baseURL = conf.baseURL || '';
  nuts.scene.sceneManager.setBaseURL(baseURL);

  let main = new Main(game);
  Main.setSingleton(main);

  //--設定讀取畫面
  let loading = nuts.ui.loading;
  let resource = [
    baseURL + 'res/loading/Loading_01.png',
    baseURL + 'res/loading/Loading_02.png',
    baseURL + 'res/loading/Loading_03.png',
    baseURL + 'res/loading/Loading_04.png',
    baseURL + 'res/loading/Loading_05.png',
    baseURL + 'res/loading/Loading_06.png',
    baseURL + 'res/loading/Loading_07.png',
    baseURL + 'res/loading/Loading_08.png',
    baseURL + 'res/loading/Loading_09.png',
    baseURL + 'res/loading/Loading_10.png',
    baseURL + 'res/loading/Loading_11.png',
    baseURL + 'res/loading/Loading_12.png'
  ];
  loading.setScene(resource);
  loadingMgr.setDisplayLoading(loading);

  let createFinish = function () {
    main.eventFinish();
    main.addToScene();
  };

  // 設定場景更新方式
  let loadingEvent = conf.loadingEvent;
  if (loadingEvent) {

    // 場景建立完成
    createFinish = function () {
      main.eventFinish();

      // reset
      loadingMgr.setGame(game);
      loadingMgr.setUseLobbyState(false);

      // 通知 lobby 遊戲場景建立完成
      if (loadingEvent.finish) {
        loadingEvent.finish();
      }
    };

    // 通知 lobby 開始建立遊戲場景
    if (loadingEvent.start) {
      loadingEvent.start();
    }
  }

  // 場景清單
  sceneList = [];
  sceneList.push({ scene: main });
  loadingMgr.go(sceneList, createFinish);
}

/**
 * 銷毀場景 (目前沒使用)
 */
export function destroy () {

  // todo: 釋放資源
  // 銷毀音樂音效
  nuts.scene.sceneManager.destroyAllSound();
}

