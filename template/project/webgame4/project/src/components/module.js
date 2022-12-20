import m from 'mithril';

import Form from 'component/form';
import Overview from 'component/overview';


export const TYPE_OVERVIEW = 1;
export const TYPE_FORM = 2;
export const TYPE_DEMO = 3;

let visible = false;
let objList = [];

let Component = {
  style: {
    zIndex: 99,
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '100%',
    height: '50%'
  },
  view () {
    return m('.',
      {
        style: Component.style
      },
      [
        objList.map(obj => {
          return obj ? m(obj.com, obj.attrs) : null;
        })
      ]
    );
  }
};

/**
 * 增加物件
 * @param set 設定物件
 */
function add (set) {
  let index = set.index;
  let type = set.type;

  let obj = {
    com: null,
    attrs: set.attrs || null
  };

  switch (type) {
    case TYPE_DEMO:
      obj.com = {
        view () {
          return m('.bg-green red', 'draw module');
        }
      };
      break;

    case TYPE_FORM:
      obj.com = {
        view (vnode) {
          return m(Form, vnode.attrs);
        }
      };
      break;
    case TYPE_OVERVIEW:
      obj.com = {
        view (vnode) {
          return m(Overview, vnode.attrs);
        }
      };
      break;
    default:
      obj.com = {
        view () {
          return m('.bg-white green', 'unknown type use default');
        }
      };
  }
  objList[index] = obj;
  m.redraw();
}

/**
 * 移除物件
 * @param index 索引
 */
function remove (index) {
  objList[index] = null;
  m.redraw();
}

/**
 * 設定顯示狀態
 * @param enable 是否顯示
 */
function setVisible (enable) {
  visible = enable;
  m.redraw();
}

/**
 * 取得顯示狀態
 * @returns {boolean} 是否顯示
 */
function isVisible () {
  return visible;
}

export {
  setVisible,
  isVisible,
  add,
  remove,
  Component
};
