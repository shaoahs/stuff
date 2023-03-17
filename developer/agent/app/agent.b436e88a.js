import{b as e,c as t,f as a,m as n,g as o,C as r,i as s,u as i}from"./agent.fa87c44b.js";import{r as c,s as l,d,M as p,o as g,O as u}from"./agent.4297abcb.js";import{C as m,n as f,c as y,a as O}from"./agent.98e8cace.js";import{getGameEvent as E}from"./agent.1a9ee3b7.js";import"./agent.ba1e6c3f.js";var v=0;function R(e,t){var a=t.data;if(Array.isArray(a)&&!(a.length<2)){var n=a[0],o=a[1],r=a[2],s=e._callbacks[n];s&&(delete e._callbacks[n],s(o,r))}}function N(e){var t=this;t._worker=e,t._callbacks={},e.addEventListener("message",(function(e){R(t,e)}))}N.prototype.postMessage=function(e){var t=this,a=v++,n=[a,e];return new Promise((function(e,o){if(t._callbacks[a]=function(t,a){if(t)return o(new Error(t.message));e(a)},void 0!==t._worker.controller){var r=new MessageChannel;r.port1.onmessage=function(e){R(t,e)},t._worker.controller.postMessage(n,[r.port2])}else t._worker.postMessage(n)}))};var h=N;let T=null,w={INIT:"init",CONNECT:"connect",LOGIN:"login",INGAME:"ingame",TOGAME:"togame",REGISTER:"register",ON_REFRESH:"onrefresh",ON_MESSAGE:"onmessage",ON_ERROR:"onerror",ON_BROADCAST:"onbroadcast",ON_CLOSE:"onclose",ON_TOGAME:"ontogame"},A={},b={async connect(e,t){T&&(t&&(A=t),await T.postMessage({type:w.CONNECT,config:e}))},async login(e){if(T){const t=(await import("./agent.5913f1b8.js").then((function(e){return e.f}))).default;let a=(await t.getPromise({excludes:{webglVendorAndRenderer:!0,language:!0,canvas:!0,hasLiedOs:!0,hasLiedBrowser:!0,availableScreenResolution:!0,webdriver:!0,deviceMemory:!0,hardwareConcurrency:!0,timezoneOffset:!0,timezone:!0,sessionStorage:!0,localStorage:!0,indexedDb:!0,addBehavior:!0,openDatabase:!0,cpuClass:!0,platform:!0,doNotTrack:!0,plugins:!0,adBlock:!0,hasLiedLanguages:!0,hasLiedResolution:!0,fonts:!0,fontsFlash:!0,audio:!0,enumerateDevices:!0}})).map((function(e){return e.value})),n=t.x64hash128(a.join(""),31);return e.fingerprint=n,await T.postMessage({type:w.LOGIN,info:e})}},async ingame(e){if(T){return await T.postMessage({type:w.INGAME,info:e})}},async togame(e){if(T){return await T.postMessage({type:w.TOGAME,info:e})}},async register(e){if(T){return await T.postMessage({type:w.REGISTER,config:e})}}};function L(e){if(!Array.isArray(e.data)){let t=e.data;switch(t.type){case w.ON_REFRESH:return void t.offsetTime;case w.ON_CLOSE:return void(A.onclose&&A.onclose());case w.ON_ERROR:return void(A.onerror&&A.onerror(t.data));case w.ON_MESSAGE:return void(A.onmessage&&A.onmessage(t.data));case w.ON_BROADCAST:return void(A.onbroadcast&&A.onbroadcast(t.data));case w.ON_TOGAME:return void(A.ontogame&&A.ontogame(t.data))}}}var M={nested:{Game:{nested:{Share:{nested:{ActionType:{values:{NULL:0}},CheckAction:{fields:{actionType:{type:"ActionType",id:1}},reserved:[[2,2]]},Jackpot:{nested:{ActionType:{values:{NORMAL:0}},BaseResponse:{fields:{actionType:{type:"ActionType",id:1},mJpOutIdx:{type:"uint32",id:3},mJpOutValue:{type:"uint64",id:4},mJpValue:{rule:"repeated",type:"uint64",id:5},resultCode:{type:"uint32",id:6}},reserved:[[2,2]]}}},Setting:{nested:{ActionType:{values:{NORMAL:0}},BaseResponse:{fields:{actionType:{type:"ActionType",id:1},betForm:{rule:"repeated",type:"uint32",id:3},betFormIndex:{type:"uint32",id:4},decimalPosition:{type:"uint32",id:5},enableJP:{type:"bool",id:6},isDemo:{type:"bool",id:7},lastBet:{type:"uint32",id:8},lineAmount:{type:"uint32",id:9}},reserved:[[2,2]]}}},Info:{nested:{ActionType:{values:{NORMAL:0}},BaseResponse:{fields:{actionType:{type:"ActionType",id:1},aPIVersion:{type:"string",id:3},chanceVersion:{type:"string",id:4},libVersion:{type:"string",id:5},packageVersion:{type:"string",id:6},slotServerVersion:{type:"string",id:7}},reserved:[[2,2]]}}}}}}}}};const S={ERROR:0,OK:1},_={SEND_LOCK:-3,CONNECT_TIMEOUT:-2,BUFFER_FULL:-1,ERROR:0,OK:1,LOGIN:3,ROOM:4,CONNECT:2};let C=!1,G=!0;function I(){if(d.state="未連線",l.isInGame&&globalThis.scene){Object.getOwnPropertyNames(globalThis.scene).forEach((e=>{let t=globalThis.scene[e];t&&t.game&&t.game.disconnect&&t.game.disconnect()}))}if(C)return;g[u.GAME_DIALOG_CUSTOM]&&(d.isError||i.setTimeout((()=>{d.isError||e({title:"errorLow",msg:"disconnect"})}),2))}function k(t){if(C)return;g[u.GAME_DIALOG_CUSTOM]&&i.setTimeout((()=>{d.isError||e({title:"errorLow",msg:`[agent onerror] ${t}`})}),.5)}function B(e){}function j(e,t){let a=_.OK;return e?(e.resultCode!==S.OK?(a=_.ERROR,t&&t.error&&t.error(e)):t&&t.handle&&t.handle(e),a):(a=_.ERROR,a)}function D(e){if(G&&(G=!1),e&&e.gid){let t=E()[e.gid];t&&t.recvGameData&&t.recvGameData(e.packet)}}function P(e){O.handle(e);let t=E();Object.getOwnPropertyNames(t).forEach((a=>{let n=t[a];if(n&&n.recvBroadcast){let t=JSON.stringify(e);n.recvBroadcast(t)}}))}let F=null;async function U(e){await async function(e){let t=!1;const{getProject:a}=await import("./agent.fa87c44b.js").then((function(e){return e.n}));let n=await a("lib/abcd",{mode:"blob"}),o=new Worker(n.blobURL);o.addEventListener("message",L),T=new h(o),e.root=n.root,e.pathname=n.pathname;try{await T.postMessage({type:w.INIT,config:e}),t=!0}catch(e){}return t}(e),F=b}async function V(e){let t={ontogame:D,onclose:I,onerror:k,onbroadcast:P,onmessage:B},a=d;a.state="連線中",await F.connect(e,t),a.state="已連線"}async function J(r){try{c.serviceBegin(m.report);let s=l,i=d;i.state="登入中";let p=await F.login(r);return j(p)?(i.isLogin=!0,i.state="登入成功",globalThis.lobby.currentUser=p.userInfo,f&&y(),t&&a(),n.redraw(),c.serviceEnd(m.report),c.log({label:"net",category:"登入"}),s.isManual||o(),p):(i.state="登入失敗",void e({title:"errorLow",msg:"disconnect"}))}catch(e){}}async function x(t){let n=s();try{c.serviceBegin(r.report);let o=d;o.state="進入遊戲";let s=await F.ingame(t);if(!j(s))return o.state="進入遊戲失敗",void e({title:"errorLow",msg:"disconnect"});o.state="遊戲中",a(),y(),c.serviceEnd(r.report),c.log({label:"net",category:"進入遊戲"});let i=l;if(i.module){let e=p;if("p"===i.module[e.PROTOCOL]){let e={gid:s.gid,schema:M,checkName:"Game.Share.CheckAction",fields:[{name:"info",rootName:"Game.Share.Info",typeName:"ActionType",cmdList:["BaseResponse"]},{name:"jackpot",rootName:"Game.Share.Jackpot",typeName:"ActionType",cmdList:["BaseResponse"]},{name:"setting",rootName:"Game.Share.Setting",typeName:"ActionType",cmdList:["BaseResponse"]}]};await F.register(e)}}let g={id:s.gid},u=n.scene[g.id];u&&u.localEvent&&(u.localEvent.enter(g),C=!0)}catch(e){}}async function K(e){try{let t=await F.togame(e);return G&&(G=!1),t&&t.packet}catch(e){}}async function z(e){return await F.register(e)}export{S as RESULT,_ as STATE,V as connect,x as ingame,U as init,J as login,z as register,K as togame};
