import m from 'mithril';

let Component = {

  oninit (vnode) {
    let self = this;
    self.logo = vnode.attrs.logo;
  },

  view (/*vnode*/) {
    //    let attrs = vnode.attrs;

    return m('.w-100 h-100',
      m('article.br2.ba.dark-gray.b--black-10.mv4.w-100.w-50-m.w-25-l.mw5.center',
        [
          this.logo ? m('img.db.w-100.br2.br--top',
            {
              src: this.logo
            }
          ) : null,
          m('.pa2.ph3-ns.pb3-ns.bg-white.o-50',
            [
              m('.dt.w-100.mt1',
                [
                  m('.dtc',
                    m('h1.f5.f4-ns.mv0',
                      'Cat'
                    )
                  ),
                  m('.dtc.tr',
                    m('h2.f5.mv0',
                      '$1,000'
                    )
                  )
                ]
              ),
              m('p.f6.lh-copy.measure.mt2.mid-gray',
                'If it fits, i sits burrow under covers. Destroy couch leave hair everywhere,' +
                ' and touch water with paw then recoil in horror.'
              )
            ]
          )
        ]
      )
    );
  }
};

export default Component;
