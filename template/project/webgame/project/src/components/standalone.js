import 'pixi';
import m from 'mithril';
import * as Loader from 'resource-loader';
import Stats from 'stats';
import * as nuts from 'nuts';
import app from 'entity/app';
import gamecard from 'template/gamecard';
import * as sceneMain from 'scene/main';
import * as sceneSub from 'scene/sub';
import * as component from 'src/component';


let defaultStyle = {
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};


let plugin = [
  'pixi-spine',
  'pixi-particles'
];


let Component = {
  oninit (/*vnode*/) {
    let config = {
      id: 'aaaa0001',
      width: 1024,
      height: 768,
      resolution: 1,
      antialias: false,
      transparent: true
    };
    this.config = config;
    config.game = nuts.game.run();

  },
  oncreate (/*vnode*/) {
  },
  view (/*vnode*/) {
    let config = this.config;
    return m('.',
      {
        style: defaultStyle
      },
      m(nuts.components.game.pixi, {
        config,
        async ready (game) {
          console.log(game);
          game.play();

          // game.debug = true;
          await sceneMain.create(game);
          await sceneSub.play(game);
        }
      })
    );
  }
};

/**
 * 初始化
 * @returns {void}
 */
async function init () {

  app.baseURL = gamecard.baseURL;

  let config = {};
  config.Loader = Loader;
  config.m = m;

  // 使用 PIXI
  config.PIXI = PIXI;
  config.Stats = Stats;
  config.plugin = plugin;

  // 初始化
  await nuts.init(config);

  component.add({
    com: Component
  });
}

export {
  init,
  Component
};
