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

// import * as comGame from 'component/standalone';
import * as comGame from 'component/gamePIXI';
let objList = [];

export function add (obj, index = 0) {
  objList[index] = obj;
  m.redraw();
}

export function remove (index = 0) {
  objList[index] = null;
  let last = objList.pop();
  if (index < objList.length) {
    objList[index] = last;
  }
  m.redraw();
}


/**
 * 啟動程式
 * @returns {void}
 */
export async function run () {

  // 設定最大顯示畫面
  let style = {
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '100%',
    height: '100%'
  };

  let Application = {
    view () {
      return m('.',
        {
          style
        },
        objList.map(obj => {
          return m(obj.com, obj.attrs);
        })
      );
    }
  };

  m.mount(document.body, Application);

  // 初始化
  await comGame.init();

}
