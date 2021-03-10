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

  let videoSourceIndex = 0;

  let videoSourceList = [
    'wss://pc-8174.streamingvds.com/',
    'wss://pc-8374.streamingvds.com/',
    'wss://pc-8474.streamingvds.com/',
    'wss://pc-8274.streamingvds.com/'
  ];

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
    setBet (obj) {
      let sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
      let streaming = new app.game.Streaming(PIXI);

      // let colorMatrix = new PIXI.filters.ColorMatrixFilter();


      // let point = new PIXI.Point(0.25, 0.5);

      obj.setClick(async (/*o*/) => {

        let sound = center?.sounds?.demo;
        sound?.countDown?.play();

        let url = videoSourceList[videoSourceIndex];
        videoSourceIndex++;
        if (videoSourceIndex >= videoSourceList.length) {
          videoSourceIndex = 0;
        }

        sprite.filters = null;
        app.game.layer.overlay.removeChild(sprite);

        let options = {
          videoBufferSize: 512 * 1024,
          fps: 60
        };
        let texture = await streaming.play(url, options);
        console.log(texture);

        /*
            const uniforms = {
              textureY: texture,
              textureCb: texture,
              textureCr: texture
            };
            const geometry = new PIXI.Geometry()
              .addAttribute('vertex',
                [ -100, -50, // x, y
                  100, -50, // x, y
                  0.0, 100.0 ], // x, y
                2); // the size of the attribute


            // .addAttribute('aUvs', // the attribute name
            //     [0, 0, // u, v
            //         1, 0, // u, v
            //         1, 1,
            //         0, 1], // u, v
            //     2) // the size of the attribute
            // .addIndex([0, 1, 2, 0, 2, 3]);

            //let filter = new PIXI.Filter(SHADER.VERTEX_IDENTITY, SHADER.FRAGMENT_YCRCB_TO_RGBA, uniforms);
            let shader = PIXI.Shader.from(SHADER.VERTEX_IDENTITY, SHADER.FRAGMENT_YCRCB_TO_RGBA, uniforms);

            const triangle = new PIXI.Mesh(geometry, shader);
            triangle.position.set(400, 300);
            triangle.scale.set(1);
            app.game.layer.overlay.addChild(triangle);
    */

        let videoScreen = streaming.videoScreen;
        let w = videoScreen.width / 4;
        let h = videoScreen.height / 4;

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let x = i * w;
            let y = j * h;
            let frame = new PIXI.Rectangle(x, y, w, h);
            let te = new PIXI.Texture(texture.baseTexture, frame);
            let child = new PIXI.Sprite(te);
            child.texture = te;
            child.x = 5 + i * (w + 5);
            child.y = 5 + j * (h + 5);
            app.game.layer.overlay.addChild(child);
            createjs.Tween.get(child, { loop: true })
              .to({ x: 400 }, 4000, createjs.Ease.getPowInOut(4))
              .to({ alpha: 0, y: 175 }, 2000, createjs.Ease.getPowInOut(2))
              .to({ alpha: 0, y: 225 }, 400)
              .to({ alpha: 1, y: 200 }, 1000, createjs.Ease.getPowInOut(2))
              .to({ x: 100 }, 500, createjs.Ease.getPowInOut(2));
          }
        }


        // nuts.updateManager.add({
        //   update (offsetTime) {
        //     frame.x += 1;
        //     if (frame.x > 200) {
        //       frame.x = 0;
        //     }
        //     sprite.texture.updateUvs();
        //   }
        // });

        sprite.texture = texture;
        sprite.x = 0;
        sprite.y = 768 / 2;
        sprite.anchor.x = 0;
        sprite.anchor.y = 0.0;
        sprite.alpha = 1.0;

        // const filter = new PIXI.Filter(null, null, { myUniform: 0.5 });
        // sprite.filters = [ filter ];

        // sprite.scale.x = 0.5;
        // sprite.scale.y = 0.5;
        app.game.layer.overlay.addChild(sprite);
      });
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
