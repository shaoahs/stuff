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



/**
 * 啟動遊戲程式
 * @param {Object} config 設定遊戲啟動資訊
 * @returns {void}
 */
export function run () : void {

  let style = {
    zIndex: 0,
    position: 'absolute',
    left: '0%',
    top: '0%',
    width: '100%',
    height: '100%'
  };

  let Component = {
    view () {
      return  m('.ph3 animate__animated animate__bounceInDown', {style: style},
        m('.f6 fw6 ttu tracked animated fadeInLeftBig', 'message'),
        m('.f6 link dim br2 ph3 pv2 mb2 dib white bg-black', 'use alpha'),
        m('.f6 link dim br2 ph3 pv2 mb2 dib white bg-purple', 'use beta'),
        m('.f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-blue', 'use demo'),
        m('.f6 link dim br2 ph3 pv2 mb2 dib white bg-hot-pink', 'use test'),
        null
      );
    }
  };

  m.mount(document.body, Component);
}
