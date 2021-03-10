import create_ts from 'demo/v2/normal/create.ts';
import lost_ts from 'demo/v2/normal/lost.ts';
import win_ts from 'demo/v2/normal/win.ts';
import create_ts$1 from 'demo/v2/jp/create.ts';
import lost_ts$1 from 'demo/v2/jp/lost.ts';
import win_ts$1 from 'demo/v2/jp/win.ts';



var normal = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create_ts,
  lost: lost_ts,
  win: win_ts
});



var jp = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create_ts$1,
  lost: lost_ts$1,
  win: win_ts$1
});

// import * as normal from 'demo/v1/normal/**/*.ts';
var input = {
    normal: normal,
    jp: jp
};

export default input;
