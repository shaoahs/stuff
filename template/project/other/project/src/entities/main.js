/* ************************************************************************
 
 Copyright:
 
 License:
 
 Authors:
 
 ************************************************************************ */
import * as nuts from 'nuts';
import app from 'entity/app';
import * as mainSet from 'entity/mainSet';

/**
 * 主場景
 */

const SCENE_NAME = 'main';
let singleton = null;

export default class Scene extends nuts.scene.Base {
  
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
  constructor (game) {
    let root = (function (game) {
      let entity = {};
      let center = {};
      
      center.entity = entity;
      center.game = game;
      center.layer = game.layer.main;
      center.currentUpdate = null;
      center.sounds = null;
      center.objs = null;
      center.textures = null;
      
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
      
      center.leaveTime = 1.0;
      event.updateLeave = (offsetTime) => {
        center.leaveTime -= offsetTime;
        if (center.leaveTime <= 0.0) {
          let obj = entity.out;
          if (obj) {
            
            // 設定動畫事件
            let spine = obj.getSpine('transition');
            let state = spine.state;
            if (state.clearListeners) {
              state.clearListeners();
              state.addListener({
                complete (trackIndex) {
                  console.log('track ' + trackIndex + ' completed ');
                  center.layer.removeChild(obj);
                  
                  // todo 取得指定的專案
                  let scene = center.game.scene.getTheOther(app.from);
                  if (scene) {
                    
                    // todo 暫停與隱藏本身的專案
                    center.game.scene.localEvent.pause();
                    center.game.scene.localEvent.hide();
                    
                    // todo 啟動與顯示指定的專案
                    scene.localEvent.play({
                      from: center.game.scene.info.id
                    });
                    scene.localEvent.show();
                  }
                },
                start (trackIndex) {
                  console.log('開始播放動畫 at ' + trackIndex);
                  center.layer.removeChild(entity.demo);
                },
                end (trackIndex) {
                  console.log('動畫結束 at ' + trackIndex);
                }
              });
            }
            center.layer.addChild(obj);
            obj.play();
            
          }
          center.currentUpdate = null;
        }
      };
      
      
      center.event = event;
      center.update = event.update;
      
      //--
      return {
        center: center
      };
    }(game));
    
    super(SCENE_NAME);
    let self = this;
    self.setGame(game);
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
   * 播放遊戲動畫
   * @param conf
   */
  play (conf) {
    console.log('--------------------- game.play ---------------------');
    let center = this.getCenter();
    let entity = center && center.entity;
    let layer = center.layer;
    
    let obj = entity.in;
    if (obj) {
      
      // 設定動畫事件
      let spine = obj.getSpine('transition');
      let state = spine.state;
      if (state.clearListeners) {
        state.clearListeners();
        state.addListener({
          complete (trackIndex) {
            console.log('track ' + trackIndex + ' completed ');
            layer.addChild(entity.demo);
            layer.removeChild(obj);
            
            center.leaveTime = 1.0;
            center.currentUpdate = center.event.updateLeave;
            console.log(center.currentUpdate);
          },
          start (trackIndex) {
            console.log('開始播放動畫 at ' + trackIndex);
          },
          end (trackIndex) {
            console.log('動畫結束 at ' + trackIndex);
          }
        });
      }
      layer.addChild(obj);
      obj.play();
    }
    if (conf && conf.jackpot) {
      let jackpot = conf.jackpot;
      if (jackpot) {
        let demo = entity.demo;
        let group;
        let valueList = jackpot.mJpValue;
        
        // 帳戶餘額
        group = demo.balance;
        group.cash.setValue(654321);
        
        // JP
        let jpNameList = [
          'jp1',
          'jp2',
          'jp3',
          'jp4',
          'jp5',
          'jp6'
        ];
        if (typeof valueList === 'number') {
          jpNameList.forEach((name, index) => {
            let group = demo[name];
            group.cash.setValue(valueList[index]);
          });
        }
        
        // 剩餘次數
        group = demo.times;
        group.cash.setValue(9);
        
        // 贏取
        group = demo.win;
        group.cash.setValue(987654321);
      }
    }
  }
  
  /**
   * 處理原始資料
   */
  /*
   eventRawData(rawdata){
   }
   */
  /**
   * 處理音樂音效
   * @param sounds {Object} 取得音樂音效物件
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
   * 場景管理
   * @param finish {Object} 場景建立完成後執行的任務
   */
  async createScene (finish) {
    let self = this;

    let vendor = await import('src/vendor');
    let res = await vendor.get('main');
    
    self.setInitMap(mainSet.normal);
    
    if (res) {
      console.log(res);
      
      // 設定資訊
      let config = {
        infoList: [
          { eventName: 'texture', obj: res},
          { eventName: 'spine',   obj: res},
          { eventName: 'sound',   obj: res},
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
