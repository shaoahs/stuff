import create_ts from 'games/slot/demo/create.ts';
import lost_ts from 'games/slot/demo/lost.ts';
import win_ts from 'games/slot/demo/win.ts';
import create_ts$1 from 'games/slot/demoJP/create.ts';
import lost_ts$1 from 'games/slot/demoJP/lost.ts';
import win_ts$1 from 'games/slot/demoJP/win.ts';
import create_ts$2 from 'games/json/demo/create.ts';
import lost_ts$2 from 'games/json/demo/lost.ts';
import win_ts$2 from 'games/json/demo/win.ts';
import create_ts$3 from 'games/json/demoJP/create.ts';
import lost_ts$3 from 'games/json/demoJP/lost.ts';
import win_ts$3 from 'games/json/demoJP/win.ts';



var demo = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create_ts,
  lost: lost_ts,
  win: win_ts
});



var demoJP = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create_ts$1,
  lost: lost_ts$1,
  win: win_ts$1
});



var jsonDemo = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create_ts$2,
  lost: lost_ts$2,
  win: win_ts$2
});



var jsonDemoJP = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create_ts$3,
  lost: lost_ts$3,
  win: win_ts$3
});

var input = {
    demo: demo,
    demoJP: demoJP,
    jsonDemo: jsonDemo,
    jsonDemoJP: jsonDemoJP
};

export default input;
