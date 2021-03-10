/* ************************************************************************
 *
 * Copyright:
 *
 * License:
 *
 * Authors:
 *
 ************************************************************************ */
import app from 'entity/app';

let eventList = null;

/**
 * create
 * @return {Object} 傳回命令對照表
 */
export function create (config) {

  if (eventList) {
    return eventList;
  }

  let game = config.game;

  eventList = {

    /**
     * 自動
     */
    clickAuto () {

    },

    /**
     * 一般
     */
    clickNormal () {

    },

    /**
     * 下注
     */
    clickBet () {
      console.log('下注');
    },

    /**
     * 說明
     */
    clickRule () {
      console.log('說明');
    },

    /**
     * 開始
     */
    clickStart () {
      console.log('開始');
      if (!game.debug) {

        //        game.debug = true;
        if (game.stats) {
          let style = game.stats.dom.style;
          style.left = '20px';
          style.top = '20px';
        }
      }
      if (app.game.sysTray) {
        app.game.sysTray.visible = !app.game.sysTray.visible;
      }
    },

    /**
     * 確認
     */
    clickOk () {
      console.log('確認');
    },

    /**
     * 離開
     */
    clickLeave () {
      console.log('離開');

      // todo 取得指定的專案
      let scene = game.scene.getTheOther(app.from);
      if (scene) {

        // todo 暫停與隱藏本身的專案
        game.scene.localEvent.pause();
        game.scene.localEvent.hide();

        // todo 啟動與顯示指定的專案
        scene.localEvent.play({
          from: game.scene.info.id
        });
        scene.localEvent.show();
      }
    }
  };
  return eventList;
}
