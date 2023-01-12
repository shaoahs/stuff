/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

import app from 'entity/app';

import * as strings from 'language/strings';

import * as sceneMain from 'scene/main';

/**
 * 建立場景
 * @param conf {Object} lobby 傳入建立場景設定檔
 */
export async function create (conf) {
  let game = conf.game;

  // let isChild = conf.isChild;
  // let sceneList;

  // 設定多語
  strings.setLanguage(conf.langID);
  console.log('zzzz: ' + strings.get('loading'));

  // 設定 base URL
  let baseURL = conf.baseURL || '';
  let nuts = app.nuts;

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

  nuts.scene.sceneManager.setBaseURL(baseURL);
  nuts.scene.sceneManager.setEvent(conf.loadingEvent);

  // 建立場景
  await sceneMain.create(game, conf.loadingEvent);

  nuts.scene.sceneManager.setEvent(null);
}

/**
 * 銷毀場景 (目前沒使用)
 */
export async function destroy () {

  // todo: 釋放資源
  // 銷毀音樂音效
  let nuts = app.nuts;
  nuts.scene.sceneManager.destroyAllSound();
}

