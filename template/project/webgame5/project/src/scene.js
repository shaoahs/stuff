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
import * as strings from 'language/strings';

/**
 * 事件用
 */
let eventList = null;


/**
 * 初始化事件 (接收大廳傳送的命令用)
 * @returns {Object} 傳回物件事件
 */
export async function init (config) {

  // 初始化
  let baseURL = config.baseURL || '.';
  let langID = config.langID;

  app.gamecard = config.gamecard;
  app.isChild = config.isChild;
  app.game = config.game;
  app.nuts = config.nuts;
  app.setting = config.setting;

  app.baseURL = baseURL;
  app.langID = langID;

  if (!app.scenes) {
    app.scenes = {};
  }

  let nuts = app.nuts;

  if (eventList) {
    return eventList;
  }
  console.log('scene init');

  eventList = {

    /**
     * 建立場景
     * @param conf config
     */
    async create (/* conf */)  {
      let game = app.game;
      let loadingEvent = game.scene.loadingEvent;
      nuts.scene.sceneManager.setBaseURL(baseURL);
      nuts.scene.sceneManager.setEvent(loadingEvent);

      // 建立場景
      let main = await import('scene/main');

      // 開始
      await main.create(game, loadingEvent);

      // 完成
      nuts.scene.sceneManager.setEvent(null);
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
      console.log('scene enter ', conf);

      // todo:game 收到玩家進入遊戲
      // let game = conf.game;

      // 背景讀取資源
      let scene = await import('scene/load');
      scene.create();

      // 開始更新畫面
      app.game.play();
      app.decimal = 2;
      let mainSet = await import('scene/mainSet');
      mainSet.normal();
      app.scenes.main.show();

      // 關閉讀取畫面
      if (app.game.scene.setOverviewVisible) {
        app.game.scene.setOverviewVisible(false);
      }
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

  // 設定多語
  strings.setLanguage(app.langID);

  // 設定資源
  let vendor = await import('src/vendor');
  vendor.setLang(langID);
  vendor.setBaseURL(baseURL);

  return eventList;
}

