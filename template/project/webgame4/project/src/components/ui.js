import m from 'mithril';

import * as strings from 'language/strings';
import Background from 'component/background';

/* eslint-disable max-len */
function buttonStart () {
  return `<div class="no-underline near-white bg-animate bg-near-black hover-bg-gray inline-flex items-center ma2 tc br2 pa2">
    <svg fill="#77ff77" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>
    <span class="f6 ml3 pr2">${strings.get('yes')}</span>
  </div>`;
}
function buttonAuto () {
  return `<div class="no-underline near-white bg-animate bg-near-black hover-bg-gray inline-flex items-center ma2 tc br2 pa2">
    <svg fill="#77ff77" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
</svg>
    <span class="f6 ml3 pr2">${strings.get('no')}</span>
  </div>`;
}
/* eslint-enable max-len */


let demoRatioIndex = 0;
let demoRatioList = [
  'aspect-ratio--16x9',
  'aspect-ratio--8x5',
  'aspect-ratio--7x5',
  'aspect-ratio--6x4',
  'aspect-ratio--4x3',
  'aspect-ratio--1x1'
];


let Component = {
  event: null,
  oninit (/*vnode*/) {
  },

  oncreate (/*vnode*/) {

  },

  view (/*vnode*/) {
    return m('.dt-ns dt--fixed-ns animated fadeInDownBig',
      {
        style: {
          zIndex: 100,
          position: 'absolute',
          left: '0%',
          top: '0%',
          height: '20%'
        }
      },
      [

        // 開始
        m('.dtc-ns tc pv4 bg-black-10',
          m('.pointer f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-navy',
            {
              onclick () {
                console.log('[start]');
                let event = Component.event;
                if (event) {
                  event.clickStart();
                }


                // 設定背景顯示比例
                let ratio = demoRatioList[demoRatioIndex];
                Background.setAspectRatio(ratio);

                demoRatioIndex += 1;
                if (demoRatioIndex >= demoRatioList.length) {
                  demoRatioIndex = 0;
                }
              }
            },
            m.trust(buttonStart())
          )
        ),

        // 自動
        m('.dtc-ns tc pv4 bg-black-5',
          m('.pointer f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-dark-green',
            {
              onclick () {
                console.log('[auto]');
                let event = Component.event;
                if (event) {
                  event.clickAuto();
                }
              }
            },
            m.trust(buttonAuto())
          )
        ),

        // 一般
        m('.dtc-ns tc pv4 bg-black-10',
          m('.pointer f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-dark-green',
            {
              onclick () {
                console.log('[normal]');
                let event = Component.event;
                if (event) {
                  event.clickNormal();
                }
              }
            },
            m.trust(buttonAuto())
          )
        )
      ]
    );
  }
};

export function setEvent (event) {
  Component.event = event;
}

export default Component;
