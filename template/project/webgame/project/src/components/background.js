import m from 'mithril';

let aspectRatio = 'aspect-ratio--16x9';
let Component = {
  setAspectRatio (ratio) {
    aspectRatio = ratio;
    m.redraw();
  },
  oninit (/*vnode*/) {
  },
  view (vnode) {
    let attrs = vnode.attrs;
    return m('.center',
      {
        style: {
          zIndex: 0,
          position: 'absolute',
          left: '0%',
          top: '0%',
          width: '100%',
          height: '100%'
        }
      },
      m(`.aspect-ratio ${aspectRatio} mb4`,
        attrs.imageName ? m('.aspect-ratio--object cover',
          {
            style: {
              background: `url(${attrs.imageName}) center`
            }
          }
        ) : null
      )
    );
  }
};

export default Component;

