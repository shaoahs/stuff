/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import * as nuts from 'nuts';

/**
 * 讀取子場景用
 *
 */
let attribute = {
  addToScene: true,

  /**
   * is busy
   */
  isBusy: false,

  /**
   * sceneList
   */
  sceneList: null,

  /**
   * finish
   */
  finish: null
};

/**
 * 建立完成
 */
function finish () {

  if (attribute.addToScene) {
    attribute.sceneList.forEach(scene => {
      scene.scene.eventFinish();
      scene.scene.addToScene();
    });
  }
  attribute.isBusy = false;
  if (attribute.finish) {
    attribute.finish();
  }
}

/**
 * 建立場景
 * @param config {Object} 設定檔
 * @return {Boolean} 是否開始建立場景
 */
export function create (config) {

  let loadingMgr = nuts.scene.loadingManager;

  if (attribute.isBusy || !config) {
    return false;
  }

  if (!Array.isArray(config.sceneList)) {
    return false;
  }

  attribute.sceneList = config.sceneList;
  attribute.finish = config.finish;
  attribute.isBusy = true;
  if (typeof config.addToScene === 'boolean') {
    attribute.addToScene = config.addToScene;
  }

  // 是否釋放資源
  if (config.isDestroyScene) {
    attribute.sceneList.forEach(scene => {
      scene.scene.destroyScene();
    });
  }

  loadingMgr.setUseLobbyState(false);
  loadingMgr.go(attribute.sceneList, finish);
  return true;
}
