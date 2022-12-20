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
 * 更新資源
 */
export async function reload (scene) {
  console.log('!!!!!!!! 開始處理 reload !!!!!!!!!');

  let main = app.scenes.main;
  let game = main.game;
  let ent = main.entity;

  // 指定要更新的資源
  let textures    = main.textures;

  textures.demo.ring = scene.textures.demo.ring;

  let dest = textures.demo.button;
  let src  = scene.textures.demo.button;

  dest.auto      = src.auto;
  dest.autoLight = src.autoLight;
  dest.bet       = src.bet;
  dest.leave     = src.leave;

  let obj = null;
  obj = ent.gui;
  if (obj) {
    obj.reload();
  }

  obj = ent.ring;
  if (obj) {
    obj.reload();
  }

  obj = ent.cash;
  if (obj) {
    await game.idle(1.0);
    obj.x = 30;
    obj.y = 50;
    obj.custom.rect.width = 360;
    obj.custom.rect.height = 100;
    obj.custom.offset = 72;
    obj.setTextures('numBW');
  }

  console.log('!!!!!!!! 完成處理 reload !!!!!!!!!');
}


/**
 * 物件初始化
 * @param {Object} options
 */
export function normal (/* options */) {

  let nuts = app.nuts;
  let ui = nuts.ui;
  const NUM = ui.Number.NUM;

  let main = app.scenes.main;

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

      main.game.textures.ui = scene.textures.ui;
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
          if (main.rule) {
            main.rule.hide();
          }
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
        let sound = app.sounds.demo;
        if (sound && sound.music && sound.music.play) {
          sound.music.stop();
        }
        let scene = await import('scene/sub');
        scene.reset();
        main.hide();

        await app.game.idle(0.01);
        let config = {
          game: 'z01',
          group: 'demo',
          id: 'z01',
          tablekey: 'abcd1234'
        };
        app.game.scene.reload(config);
      }

      obj.setClick((/*o*/) => {
        leave();
      });
    },

    // 投注額
    setBet (obj) {
      obj.setClick((/*o*/) => {
        console.log('[投注額]');
      });
    },

    // 自動
    setAuto (obj) {
      obj.setClick((/*o*/) => {
        console.log('[自動]');
      });
    },

    // 設定動畫
    setAnim (obj) {
      console.log('設定動畫');
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
      console.log('[建立說明頁面]');
      console.log(obj);

      main.rule = new Rule(obj, main.game.layer.foreground);
    },

    autoonPageNumber (obj) {
      obj.fixVal = app.decimal;
      obj.setAnchor({
        x: 0.0,
        y: 0.0
      });
      obj.setAlign(NUM.HORI_ALIGN.RIGHT, NUM.VERTI_ALIGN.TOP);
      obj.setValue(999999.00);
    }
  };

  let config = {
    set,
    scene: main,
    game: app.game
  };

  nuts.scene.set(config);
}
