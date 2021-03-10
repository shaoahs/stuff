/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */
//import * as strings from 'language/strings';
import * as nuts from 'nuts';
import app from 'entity/app';


/**
 * 物件初始化
 * @param {Object} that
 */
export function normal (that) {

  let ui = nuts.ui;
  const NUM = ui.Number.NUM;

  //  let center = that.getCenter();
  //  let textures = center.textures.demo;


  //--初始化對照表
  let set =  {

    // 籌碼堆子物件 數字物件用
    setCash (obj) {
      obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
      obj.fixVal = app.decimal;
      obj.custom.fixVal = app.decimal;
      obj.setValue(4321);
    },

    // 動畫物件用
    play (obj) {
      obj.play();
    }
  };

  let config = {
    set: set
  };
  that.init(config);
}
