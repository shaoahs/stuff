import m from 'mithril';
import * as PIXI from 'pixi.js';
import * as spine from 'pixi-spine';

import app from 'entity/app';
import * as nuts from 'nuts';
import * as scene from 'src/scene';

let defaultStyle = {
  position: 'absolute',
  zIndex: 9,
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};

let plugin = [
];

export let Component = {
  oninit (vnode) {
    let attrs = vnode.attrs;
    this.config = attrs.config;
    this.style = attrs.style || defaultStyle;
  },
  oncreate (/*vnode*/) {
  },
  view () {
    let config = this.config;
    let style = this.style;
    return m(nuts.components.game.pixi,
      {
        style,
        config
      }
    );
  }
};

/**
 * 初始化
 * @returns {void}
 */
export async function init () {
  console.log('!!!!!!!!!! init !!!!!!!!!!!!');
  app.nuts = nuts;

  let config = {};
  config.m = m;
  config.PIXI = PIXI;
  config.spine = spine;
  config.Ticker = createjs.Ticker;
  config.plugin = plugin;

  await nuts.init(config);

  // 建立
  config = {};
  config.id = document.body.id || 9999;
  config.event = scene.init();

  let game = nuts.game.run(config);
  game.id = config.id;

  // 通知 lobby 準備好了
  if (game.scene) {
    game.scene.ready();
  }
}

