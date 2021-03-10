/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */

import * as nuts from 'nuts';
import app from 'entity/app';
import * as eventKeys from 'event/keys';
import * as eventDemo from 'event/demo';

import * as comGame from 'component/game';
import Main from 'entity/main';

/**
 * 事件用
 */
let eventList = null;

/**
 * 初始化事件 (接收大廳傳送的命令用)
 * @returns {Object} 傳回物件事件
 */
export function init (config) {
  console.log('scene init');
  if (eventList) {
    return eventList;
  }
  let gameRoot = null;
  let entity = config.entity;
  let usePIXI = app.usePIXI;
  let gamecard = null;

  eventList = {

    /*
     * 建立場景
     */
    create (conf)  {
      let game = conf.game;
      let loadingEvent = null;
      if (game.scene) {
        loadingEvent = game.scene.loadingEvent;
        gamecard = game.scene.gamecard;
        gameRoot = game;
        app.game = game;
        app.gamecard = gamecard;
      }
  
      app.langID = conf.langID;
      app.baseURL = conf.baseURL;
      app.isChild = conf.isChild;
      if (conf.console) {
        console.info = conf.console.info;
      }

      // todo:game 收到建立遊戲事件
      if (usePIXI && entity && entity.create) {
        let pixiConfig = app.pixiConfig;
        let loadingMgr = nuts.scene.loadingManager;
        if (gamecard && !app.pixiConfig) {
          pixiConfig = gamecard.pixiConfig;
          app.pixiConfig = pixiConfig;
        }
        if (game.scene) {
          pixiConfig.game = game;
          loadingMgr.setGame(game);
          loadingMgr.setUseLobbyState(true);
        } else {
          pixiConfig.game = null;
        }

        // 指定遊戲引擎初始化完成後, 需要執行的工作
        // (開始讀取遊戲資料,然後建立遊戲場景)
        pixiConfig.ready = (game) => {
          console.log('=====================');
          console.log(game);
          entity.create({
            game: game,
            langID: conf.langID,
            isChild: conf.isChild,
            baseURL: conf.baseURL,
            loadingEvent: loadingEvent
          });
        };
  
        pixiConfig.component = nuts.components.game.pixi;
        comGame.create(pixiConfig);
      }
    },

    /*
     * 開始更新畫面
     */
    play (conf) {
      console.log(conf.game.scene.info.id + ' scene play : from ' + conf.from);

      app.from = conf.from;

      // todo:game 收到開始更新遊戲畫面事件
      let event;
      event = eventDemo.create({
        game: gameRoot
      });
      eventKeys.init({
        game: gameRoot,
        event
      });

      let main = Main.getSingleton();
      if (main) {
        main.addToScene();
        let sound = main.getSound('demo');
        if (sound && sound.music && sound.music.play) {
          sound.music.play();
        }
        main.play(conf);
      }
    },

    /*
     * 暫停更新畫面
     */
    pause (conf) {

      console.log(conf.game.scene.info.id + ' scene pause : from ' + conf.from);

      // todo:game 收到暫停更新遊戲畫面事件
      let main = Main.getSingleton();
      if (main) {
        let sound = main.getSound('demo');
        if (sound && sound.music && sound.music.stop) {
          sound.music.stop();
        }
      }
    },

    /*
     * 進入場景
     */
    enter (conf) {
      console.log('scene enter ');
      console.log(conf);
      let main = Main.getSingleton();
      if (main) {
        main.addToScene();
      }
      let scene = conf.game.scene;
      if (scene && scene.localEvent) {
        scene.localEvent.play(conf);
        scene.localEvent.show();
      }

    },

    /*
     * 離開場景
     */
    leave (conf) {
      console.log('scene leave ');
      console.log(conf);
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
  eventKeys.release();
  nuts.scene.sceneManager.destroyAllSound();
});
