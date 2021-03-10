/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */

import app from 'entity/app';
import * as comGame from 'component/gamePIXI';
import * as component from 'src/component';
import * as entity from 'src/entity';

/**
 * 事件用
 */
let eventList = null;


/**
 * 初始化事件 (接收大廳傳送的命令用)
 * @returns {Object} 傳回物件事件
 */
export function init () {
  console.log('scene init');
  if (eventList) {
    return eventList;
  }

  // 遊戲管理用
  let gameRoot = null;
  let gamecard = null;

  eventList = {

    /**
     * 建立場景
     * @param conf config
     */
    async create (conf)  {
      let game = conf.game;
      let loadingEvent = null;
      if (game.scene) {
        loadingEvent = game.scene.loadingEvent;
        gamecard = game.scene.gamecard;
        gameRoot = game;
        app.game = game;
        app.gamecard = gamecard;
      }

      // 初始化
      app.langID = conf.langID;
      app.baseURL = conf.baseURL || '';
      app.isChild = conf.isChild;

      let vendor = await import('src/vendor');
      vendor.setLang(app.langID);
      vendor.setBaseURL(app.baseURL);

      if (conf.console) {
        console.info = conf.console.info;
      }

      // todo:game 收到建立遊戲事件
      let pixiConfig = gamecard.pixiConfig;
      pixiConfig.game = gameRoot;
      app.pixiConfig = pixiConfig;

      // 指定遊戲引擎初始化完成後, 需要執行的工作
      // (開始讀取遊戲資料,然後建立遊戲場景)
      pixiConfig.ready = (game) => {
        entity.create({
          game: game,
          langID: conf.langID,
          isChild: conf.isChild,
          baseURL: conf.baseURL,
          loadingEvent: loadingEvent
        });
      };

      component.add({
        com: comGame.Component,
        attrs: {
          config: pixiConfig
        }
      });
    },

    /**
     * 開始更新畫面
     */
    play (conf) {
      console.log(conf.game.scene.info.id + ' scene play: from ' + conf.from);
      app.from = conf.from;

    },

    /**
     * 暫停更新畫面
     */
    pause (conf) {
      console.log(conf.game.scene.info.id + ' scene pause : from ' + conf.from);

    },

    /**
     * 進入場景
     */
    async enter (conf) {
      console.log('scene enter ');

      // todo:game 收到玩家進入遊戲
      let game = conf.game;

      // 背景讀取資源
      let scene = await import('scene/load');
      scene.create();

      // 初始化網路
      let net = await import('net/network');
      await net.init(conf);

      /// 傳送網路命令
      let cmd = await import('net/command/create');
      cmd.send();

      game.disconnect = () => {
        console.log('!!!! game.disconnect !!!!');
      };

    },

    /**
     * 離開場景
     */
    async leave (conf) {
      console.log('scene leave');
      let scene = conf.game.scene;
      if (scene && scene.localEvent) {
        scene.localEvent.pause(conf);
        scene.localEvent.hide();
      }
    },

    /**
     * 操作中
     */
    focus () {
      console.log('scene focus');
    },

    /**
     * 未操作
     */
    blur () {
      console.log('scene blur');
    },

    /**
     * 鎖定畫面比例
     * @param state {boolean} 是否鎖定畫面比例
     */
    lock (state) {
      console.log('lock :' + state);
    },

    /**
     * 全螢幕事件
     * @param state
     */
    fullscreen (state) {
      console.log(state);
    },

    /**
     * 尺寸改變事件
     * @param state
     */
    resize (state) {
      console.log(state);
    },

    /**
     * 音樂事件
     * @param state
     */
    music (state) {
      console.info('音樂事件 : ' + state.isMute);
    },

    /**
     *  音效事件
     * @param state
     */
    sound (state) {
      console.info('音效事件 : ' + state.isMute);
    }
  };

  return eventList;
}

window.addEventListener('beforeunload', (event) => {
  console.log('beforeunload' + JSON.stringify(event));
});
window.addEventListener('unload', (/*event*/) => {
  console.log('unload');
  app.nuts.scene.sceneManager.destroyAllSound();
});
