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


/**
 * 物件初始化
 * @param {Object} that
 */
export function normal (that) {

  let ui = app.nuts.ui;
  const NUM = ui.Number.NUM;

  let center = that.getCenter();

  // let textures = center.textures.demo;
  let ruleVisible = false;
  class Rule {
    constructor (obj, layer) {
      this.group = obj;
      this.layer = layer;
    }
    show () {
      this.layer.addChild(this.group);
    }
    hide () {
      this.layer.removeChild(this.group);
    }
    reload (scene) {
      let self = this;
      console.log(scene);

      center.game.textures.ui = scene.textures.ui;
      self.group.reload();
    }
  }

  //--初始化對照表
  let set =  {
    async setInfo (obj) {
      async function create () {
        console.log('[初始化說明場景]');
        let scene = await import('scene/info');
        console.log('[開始建立說明場景]');
        await scene.create();
        console.log('[完成建立說明場景]');
      }
      obj.setClick((/*o*/) => {
        ruleVisible = !ruleVisible;
        if (ruleVisible) {
          create();
        } else {
          center.rule.hide();
        }
      });
    },

    async setPlay (obj) {
      async function play () {

        // 傳送網路命令
        let cmd = await  import('net/command/bet');
        await cmd.send(1000);
      }

      obj.setClick((/*o*/) => {
        play();
      });
    },

    async setLeave (obj) {
      async function leave () {
        let sound = center.sounds.demo;
        if (sound && sound.music && sound.music.play) {
          sound.music.stop();
        }
        let scene = await import('scene/sub');
        scene.reset();

        await app.game.idle(0.01);
        let config = {
          game: '{%= name %}',
          group: '{%= group %}',
          id: '{%= name %}',
          tablekey: 'abcd1234'
        };
        app.game.scene.reload(config);
      }

      obj.setClick((/*o*/) => {
        leave();
      });
    },

    // 設定下注
    setBet (/* obj */) {
    },
    
    // 設定動畫
    setAnim (obj) {
      console.log('!!!!!!!!! setAnim !!!!!!!!!!');
      console.log(obj);
      obj.play();
    },

    // 設定數字
    setNum (obj) {
      obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
      obj.fixVal = 2;
      obj.setValue(654321);
    },

    // 設定 spine
    setSpine (obj) {
      obj.play();
    },
    createRule (obj) {
      console.log('[create rule]');
      console.log(obj);

      center.rule = new Rule(obj, center.game.layer.foreground);
    },
    autoonPageNumber (obj) {
      obj.fixVal = center.decimal;
      obj.setAnchor({
        x: 0.0,
        y: 0.0
      });
      obj.setAlign(NUM.HORI_ALIGN.RIGHT, NUM.VERTI_ALIGN.TOP);
      obj.setValue(999999.00);
    }
  };

  let config = {
    set
  };
  that.init(config);
}
