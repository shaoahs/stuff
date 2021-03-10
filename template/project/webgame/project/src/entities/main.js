/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */
import app from 'entity/app';

/**
 * 主場景
 */

const SCENE_NAME = 'main';
let singleton = null;

export default class Scene extends app.nuts.scene.Base {

  static  getSingleton () {
    return singleton;
  }
  static setSingleton (scene) {
    if (!singleton) {
      singleton = scene;
    }
  }

  /**
   * 建立物件
   * @param game {Object} game
   */
  constructor (scene) {
    let root = (function (scene) {
      let center = {};
      center.game = scene.game;
      center.layer = scene.game.layer.main;
      center.currentUpdate = null;
      center.sounds = null;
      center.objs = scene.objs;
      center.textures = scene.textures;
      center.spines = scene.spines;
      center.entity = scene.entity;

      let entity = center.entity;
      console.log(entity);

      /************************************************************************/
      /**
       * 事件設定
       *
       */
      let event = {};

      /************************************************************************/
      /**
       * 更新畫面用
       * @param offsetTime {Number} 時間偏移量, 每一個 frame 所花費的時間
       */
      event.update = (offsetTime) => {
        if (center.currentUpdate !== null) {
          center.currentUpdate(offsetTime);
        }

      };


      center.event = event;
      center.update = event.update;

      //--
      return {
        center
      };
    }(scene));

    super(SCENE_NAME);
    let self = this;
    self.setGame(scene.game);
    self.setRoot(root);
  }

  //---------------------------------------------
  /**
   * 更新畫面用
   * @param offsetTime {Number} 時間偏移量, 每一個 frame 所花費的時間
   */
  /*
    refresh(offsetTime) {
      //    console.log(this.getName() + ' ' + offsetTime);
    }
  */

  /**
   * 場景建立完成
   */
  /*
  eventFinish () {
  }
*/
  /**
   * 處理原始資料
   */
  /*
    eventRawData(rawdata){
    }
  */
  /**
   * 處理音樂音效
   */
  /*
    eventSound (sounds){
    }
  */
  /**
   * 處理材質
   */
  /*
    eventTexture (textures){
    }
  */
  /**
   * 處理動畫
   */
  /*
    eventSpine(spines) {
    }
  */
  /**
   * 處理物件
   */
  /*
    eventObject(objs){
    }
  */

  /**
   * 場景管理
   */
  /*
    addToScene() {
      let layer = this.getLayer();
      super.addToScene();
      var basicText = new PIXI.Text('Basic text in pixi');
      basicText.x = 30;
      basicText.y = 90;
      layer.addChild(basicText);
    }
  */
  /**
   * 場景管理
   */
  /*
    removeFromScene(){
    }
  */
  /**
   * 場景管理
   */
  /*
    destroyScene(){
      super.destroyScene();
    }
  */
  /**
   * 更新資源
   */
  async reload (scene) {
    console.log('!!!!!!!! 開始處理 reload !!!!!!!!!');
    let self = this;
    let center = self.getCenter();
    let game = center.game;
    let ent = center.entity;

    // 指定要更新的資源
    let newTextures = scene.textures.ui;
    let textures = center.textures;
    textures.demo.ring = scene.textures.demo.ring;

    let dest = textures.demo.button;
    let src = scene.textures.demo.button;

    dest.auto      = src.auto;
    dest.autoLight = src.autoLight;
    dest.bet       = src.bet;
    dest.leave     = src.leave;

    let obj = null;
    obj = ent.gui;
    obj.reload();

    obj = ent.ring;
    obj.reload();

    await game.idle(1.0);
    obj = ent.cash;
    obj.x = 30;
    obj.y = 50;
    obj.custom.rect.width = 360;
    obj.custom.rect.height = 100;
    obj.custom.offset = 72;
    obj.setTextures('numBW');

    await game.idle(1.0);
    obj = ent.coin;
    obj.texture = newTextures.pageInfoText.a;
    console.log('!!!!!!!! 完成處理 reload !!!!!!!!!');
  }

  /**
   * 場景管理
   * @param finish {Object} 場景建立完成後執行的任務
   */
  async createScene (finish) {

    // 讀取資源檔方式之一
    let vendor = await import('src/vendor');
    let res = await vendor.get('main');

    // 讀取資源檔方式之一
    // let resource = await import('src/res/main');
    // let res = await resource.get();

    if (res) {
      console.log(res);

      // 設定資訊
      let config = {
        infoList: [
          { eventName: 'texture', obj: res},
          { eventName: 'spine',   obj: res},
          { eventName: 'object',  obj: res}
        ],
        isObject: true
      };
      super.createScene(finish, config);
    } else {
      console.error('resource map is undefined');
    }
  }
}
