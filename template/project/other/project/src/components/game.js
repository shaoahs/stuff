import m from 'mithril';
import * as Loader from 'resource-loader';
import Stats from 'stats';

import * as nuts from 'nuts';
import app from 'entity/app';
import * as entity from 'src/entity';
import * as scene from 'src/scene';

let style = {
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};
let styleList = [
  {
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '100%',
    height: '100%'
  },
  {
    position: 'absolute',
    left: '50%',
    top: '0%',
    width: '50%',
    height: '100%'
  }
];

let usePIXI = app.usePIXI;


let plugin = [
  'pixi-spine',
  'pixi-particles'
];

let comList = [];
function add (com, index = 0) {
  comList[index] = com;
  m.redraw();
}
function remove (index = 0) {
  comList[index] = null;
  let last = comList.pop();
  if (index < comList.length) {
    comList[index] = last;
  }
  m.redraw();
}

function create (config, index = 0) {
  let component = {
    oninit (/*vnode*/) {
    },
    view () {
      return m(config.component,
        {
          style: styleList[index],
          config
        }
      );
    }
  };
  add(component, index);
}

let Component = {
  entity: null,
  game: null,
  oninit (/*vnode*/) {
  },
  oncreate (/*vnode*/) {
    if (Component.game && Component.game.scene) {
      Component.game.scene.ready();
    }
  },
  view (/*vnode*/) {
    return m('.',
      {
        style
      }, [

        // 遊戲
        comList.map(com => {
          return m(com);
        })
      ]
    );
  }
};

/**
 * 初始化
 * @returns {void}
 */
function init () {

  return new Promise((resolve/*, reject*/)=> {
    let config = {};
    config.Loader = Loader;
    config.m = m;

    // 是否使用 PIXI
    if (usePIXI) {
      config.PIXI = PIXI;
      config.Stats = Stats;
      config.plugin = plugin;
    }

    // 初始化
    nuts.init(config).then(() => {
      let config = {};
      config.id = document.body.id || 9999;
      config.event = scene.init({
        entity
      });

      Component.game = nuts.game.run(config);
      Component.entity = entity;

      resolve(Component);
    });
  });
}

export {
  add,
  remove,
  create,
  init,
  Component
};
