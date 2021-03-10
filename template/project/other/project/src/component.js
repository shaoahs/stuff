/* ************************************************************************
 *
 *   Copyright:
 *
 *   License:
 *
 *   Authors:
 *
 ************************************************************************ */

import m from 'mithril';

import * as game from 'component/game';

/**
 * 啟動程式
 * @returns {void}
 */
export function run () {

  // 設定最大顯示畫面
  let style = {
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '100%',
    height: '100%'
  };

  let Application = {
    main: {
      view () {
        return m('.bg-white red', 'init');
      }
    },

    view () {
      return m('.',
        {
          style
        },
        m(Application.main),
      );
    }
  };
  m.mount(document.body, Application);

  // 初始化
  game.init().then(component => {
    if (component) {
      Application.main = component;
      m.redraw();
    }
  });
}
