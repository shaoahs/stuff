// import 'pixi';

import m from 'mithril';
import * as nuts from 'nuts';
import app from 'entity/app';
import gamecard from 'template/gamecard';
import * as component from 'src/component';
import * as strings from 'language/strings';


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
          game.play();
          app.game = game;

          // game.debug = true;

          let main = await import('scene/main');
          let scene = await main.create(game);

          let mainSet = await import('scene/mainSet');
          mainSet.normal();
          scene.show();

          // 背景讀取資源
          await game.idle(0.01);
          let load = await import('scene/load');
          load.create();

          await game.idle(5.0);

          let sub = await import('scene/sub');
          await sub.play(game);
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

  app.langID = strings.ID.EN_US;
  app.baseURL = gamecard.baseURL;
  app.nuts = nuts;

  if (!app.scenes) {
    app.scenes = {};
  }

  // 設定 base URL
  let baseURL = app.baseURL;
  let langID = app.langID;

  // 設定多語
  strings.setLanguage(langID);

  //--設定讀取畫面
  let loading = nuts.ui.loading;
  let resource = [
    baseURL + 'res/loading/Loading_01.png',
    baseURL + 'res/loading/Loading_02.png',
    baseURL + 'res/loading/Loading_03.png',
    baseURL + 'res/loading/Loading_04.png',
    baseURL + 'res/loading/Loading_05.png',
    baseURL + 'res/loading/Loading_06.png',
    baseURL + 'res/loading/Loading_07.png',
    baseURL + 'res/loading/Loading_08.png',
    baseURL + 'res/loading/Loading_09.png',
    baseURL + 'res/loading/Loading_10.png',
    baseURL + 'res/loading/Loading_11.png',
    baseURL + 'res/loading/Loading_12.png'
  ];
  loading.setScene(resource);
  nuts.scene.sceneManager.setBaseURL(baseURL);

  let vendor = await import('src/vendor');
  vendor.setLang(langID);
  vendor.setBaseURL(baseURL);

  let Loader = await import('resource-loader');
  let config = {};
  config.Loader = Loader;
  config.m = m;

  // 使用 PIXI
  config.PIXI = PIXI;
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
