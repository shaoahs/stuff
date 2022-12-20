import m from 'mithril';
import * as module from 'component/module';

let Component = {

  oninit (/*vnode*/) {

  },

  oncreate (/*vnode*/) {

  },

  view (/*vnode*/) {

    return m('.w-100 h-100 animated bounce',
      {
        style: {
          zIndex: 200,
          position: 'absolute',
          left: '0%',
          top: '50%'
        }
      },
      m('form.bg-light-red.mw7.center.pa4.br2-ns.ba.b--black-10',
        m('fieldset.cf.bn.ma0.pa0',
          [
            m('legend.pa0.f5.f4-ns.mb3.black-80',
              'Sign up for our newsletter'
            ),
            m('.cf',
              [
                m("label.clip[for='email-address']",
                  'Email Address'
                ),
                m('input.f6.f5-l.input-reset.bn.fl.black-80' +
                    '.bg-white.pa3.lh-solid.w-100.w-75-m.w-80-l.br2-ns.br--left-ns',
                {
                  id: 'email-address',
                  name: 'email-address',
                  placeholder: 'Your Email Address',
                  type: 'text',
                  value: ''
                }),
                m('input.f6.f5-l.button-reset.fl.pv3.tc.bn.bg-animate.bg-black-70.hover-bg-black.white' +
                      '.pointer.w-100.w-25-m.w-20-l.br2-ns.br--right-ns',
                {
                  type: 'button',
                  value: 'Subscribe',
                  onclick () {
                    module.remove(1);
                    module.setVisible(false);
                  }
                })
              ]
            )
          ]
        )
      )
    );
  }
};

export default Component;
