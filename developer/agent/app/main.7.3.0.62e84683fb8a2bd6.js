import{l as e,i as a,s as t,r as i}from"./agent.c55f3b95.js";import{r as s}from"./agent.e16c05fc.js";globalThis.setLobbyName=e=>{t.lobbyName=e},globalThis.disableNetwork=()=>{t.disableNet=!0},globalThis.setLoadingEvent=e=>{i.loadingEvent=e},globalThis.setBaseURL=e=>{globalThis.BASE_URL=e};let l=!1;async function o(){function e(a){globalThis.setCheckGameEvent?(globalThis.setCheckGameEvent({getIP:s.getIP,setLoadingEvent:globalThis.setLoadingEvent,setBaseURL:globalThis.setBaseURL}),globalThis.parent.isCheckGameCDN&&(globalThis.disableNetwork(),globalThis.CDN_LIST=[]),a()):setTimeout((()=>{e(a)}),100)}if(globalThis.parent!==globalThis)return t.isCheckGameCDN=globalThis.parent.isCheckGameCDN,i.isCheckGameCDN=t.isCheckGameCDN,new Promise((a=>{globalThis.parent.isCheckGameCDN||globalThis.parent.isGameManager?e(a):a()}))}!async function(){let{start:i,checkCDN:r}=await import("./agent.065a7bec.js");await i();let n=t;n.res&&("v1"===n.res?n.useAvif=!1:"v2"===n.res&&(n.useAvif=!0));let g="common";s.log({label:g,category:"啟動程式"});let c={category:"初始化 主網址",getLabel:()=>`${g}`};if(s.loadBegin(c),"check"===n.lobbyName)try{await o()}catch(e){}try{await async function(){let e=null;if(t.useCache){if(navigator.serviceWorker&&navigator.serviceWorker.register)return e=await navigator.serviceWorker.register("/lib.sw.js",{scope:"/"}),t.registration=e,t.hasCache=!0,e.addEventListener("updatefound",(function(){e.update();let a=e.installing;a.addEventListener("statechange",(()=>{"installed"===a.state&&globalThis.location.reload()}))})),navigator.serviceWorker.addEventListener("message",(e=>{})),new Promise((a=>{!function(){if(e&&e.active&&navigator.serviceWorker.controller){let e={};e.config={BASE_URL:globalThis.BASE_URL,CDN_LIST:globalThis.CDN_LIST},navigator.serviceWorker.controller.postMessage(e),a()}else a()}()}))}else navigator.serviceWorker&&navigator.serviceWorker.register&&(e=await navigator.serviceWorker.register("/lib.sw.js?v=2.0.0",{scope:"/"}),e&&e.unregister&&await e.unregister())}()}catch(e){}s.log({eventName:n.hasCache?"使用":"不使用",label:g,category:"確認快取功能"});let h=null,b=null;try{await e.setDriver(e.LOCALSTORAGE),b=e.createInstance({name:"mygames",storeName:"agent2"}),b&&(n.isCheckGameCDN||a||(h=await b.getItem("baseURL"))),n.store=b}catch(e){}if(h)globalThis.BASE_URL=h,s.report.currentURL=h,n.selectCDN=!0;else if(!n.hasCache)try{await r()}catch(e){}s.log({eventName:n.hasCDN?"使用":"不使用",label:g,category:"確認服務線路"});try{const{Howl:e,Howler:a,IsMobile:t,m:i,nuts:s,component:o,load:g}=await import("./agent.cb2151bc.js");await g(),globalThis.Howl=e,globalThis.Howler=a,globalThis.Howler&&(globalThis.Howler.autoSuspend=!1),globalThis.isMobile=t(globalThis.navigator.userAgent);let c=[],h={PIXI:globalThis.PIXI,m:i,io:globalThis.io,Stats:null,plugin:c};await s.init(h);let b=s.ui.loading,m=async e=>{let a=await e.get(n.langID);n.images=a.images,a.images&&a.images.loading&&b.setScene(a.images.loading)};if(n.useAvif?import("./agent.c4099e47.js").then((e=>{m(e)})):await import("./agent.63033d16.js").then((e=>{m(e)})),l)return;l=!0;let v=globalThis.createjs.Ticker;v.timingMode=v.TIMEOUT,o.run({checkCDN:r,element:document.body})}catch(e){}s.loadEnd(c),s.log({label:g,category:"初始化 主網址"})}();
