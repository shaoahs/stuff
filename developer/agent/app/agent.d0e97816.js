const e={REAL:"real",DEMO:"demo"},t={OVERVIEW_LOGO:0,OVERVIEW_ANIMATION:1,OVERVIEW_BACKGROUND:2,OVERVIEW_PROGRESS:3,GAME_SCENE_CUSTOM:4,GAME_PERFORMANCE_FPS:5,GAME_DIALOG_CUSTOM:6,GAME_DEBUG_MODE:7},n={PROTOCOL:0,GAME_FORMAT:1},r=45e3;let o=!0,a={info:{},isKickOut:!1,group:null,game:null,room:null,host:null,key:null,mode:null,namespace:"develop",currency:null,protocol:null,gameFormat:null,cdn:{errorCounts:0},ping:0},i=[];i[t.OVERVIEW_LOGO]=1,i[t.OVERVIEW_ANIMATION]=1,i[t.OVERVIEW_BACKGROUND]=1,i[t.OVERVIEW_PROGRESS]=0,i[t.GAME_SCENE_CUSTOM]=1,i[t.GAME_PERFORMANCE_FPS]=1,i[t.GAME_DEBUG_MODE]=1,i[t.GAME_DIALOG_CUSTOM]=1;let c={isCheckGameCDN:!1,setting:null,isFinish:!1,loadingEvent:null},u={useAvif:!1,res:null,currentURL:"",isReload:!1,hasCDN:!1,selectCDN:!1,cdnList:[],useCache:!1,hasCache:!1,isCheckGameCDN:!1,disableNet:!1,lobbyName:"",mobileMode:"0",projectURL:"/project/",systemjsURL:"",useOptions:!1,msg:"",ping:!1,isInGame:!1,commandTimeout:15,isManual:!1,launch:null,logo:"",agent:"bg",module:null,langID:"en-us",versionTimestamp:null,version:null},s={URLs:null,isLogin:!1,state:""},f={client:{eventList:[],errorList:[]}};let l=1;var d={getIP:async function(){try{if(!f.ip){let e=await fetch("//pro.ip-api.com/json?key=5SgCadGS9fH36ub");if(e&&e.ok){let t=await e.json();f.ip=t}}}catch(e){}return f.ip},statistic:f,error:function(e){e&&globalThis.gtag&&gtag("event",e.eventName||"錯誤",{event_category:e.category,event_label:e.label,value:e.value||-1,non_interaction:!0})},report:{name:"",currentURL:""},serviceBegin:function(e){e.time=Math.round(performance.now())},serviceEnd:function(e,t){t||(e.time=Math.round(performance.now())-e.time),globalThis.gtag&&gtag("event","timing_complete",{name:e.name||"後台服務",value:e.time,event_category:e.category,event_label:e.getLabel()});let n={name:e.name||"後台服務",label:e.getLabel(),category:e.category,value:e.time};f.client.eventList.push(n)},loadBegin:function(e){e.time=Math.round(performance.now())},loadEnd:function(e){e.time=Math.round(performance.now())-e.time,globalThis.gtag&&gtag("event","timing_complete",{name:e.name||"加載服務",value:e.time,event_category:e.category,event_label:e.getLabel()});let t={name:e.name||"加載服務",label:e.getLabel(),category:e.category,value:e.time};f.client.eventList.push(t)},log0:function(e){},log:function(e){e&&(globalThis.gtag&&gtag("event",e.eventName||"歷程",{event_category:e.category,event_label:`${e.label}`,value:e.value||-1,non_interaction:!0}),l+=1)}},v="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function h(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var g={};({get exports(){return g},set exports(e){g=e}}).exports=function e(t,n,r){function o(i,c){if(!n[i]){if(!t[i]){if(!c&&h)return h(i);if(a)return a(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var s=n[i]={exports:{}};t[i][0].call(s.exports,(function(e){var n=t[i][1][e];return o(n||e)}),s,s.exports,e,t,n,r)}return n[i].exports}for(var a=h,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){(function(e){var n,r,o=e.MutationObserver||e.WebKitMutationObserver;if(o){var a=0,i=new o(f),c=e.document.createTextNode("");i.observe(c,{characterData:!0}),n=function(){c.data=a=++a%2}}else if(e.setImmediate||void 0===e.MessageChannel)n="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){f(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(f,0)};else{var u=new e.MessageChannel;u.port1.onmessage=f,n=function(){u.port2.postMessage(0)}}var s=[];function f(){var e,t;r=!0;for(var n=s.length;n;){for(t=s,s=[],e=-1;++e<n;)t[e]();n=s.length}r=!1}function l(e){1!==s.push(e)||r||n()}t.exports=l}).call(this,void 0!==v?v:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,t,n){var r=e(1);function o(){}var a={},i=["REJECTED"],c=["FULFILLED"],u=["PENDING"];function s(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=u,this.queue=[],this.outcome=void 0,e!==o&&v(this,e)}function f(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function l(e,t,n){r((function(){var r;try{r=t(n)}catch(t){return a.reject(e,t)}r===e?a.reject(e,new TypeError("Cannot resolve promise with itself")):a.resolve(e,r)}))}function d(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function v(e,t){var n=!1;function r(t){n||(n=!0,a.reject(e,t))}function o(t){n||(n=!0,a.resolve(e,t))}function i(){t(o,r)}var c=h(i);"error"===c.status&&r(c.value)}function h(e,t){var n={};try{n.value=e(t),n.status="success"}catch(e){n.status="error",n.value=e}return n}function g(e){return e instanceof this?e:a.resolve(new this(o),e)}function b(e){var t=new this(o);return a.reject(t,e)}function y(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var i=new Array(n),c=0,u=-1,s=new this(o);++u<n;)f(e[u],u);return s;function f(e,o){function u(e){i[o]=e,++c!==n||r||(r=!0,a.resolve(s,i))}t.resolve(e).then(u,(function(e){r||(r=!0,a.reject(s,e))}))}}function p(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var i=-1,c=new this(o);++i<n;)u(e[i]);return c;function u(e){t.resolve(e).then((function(e){r||(r=!0,a.resolve(c,e))}),(function(e){r||(r=!0,a.reject(c,e))}))}}t.exports=s,s.prototype.catch=function(e){return this.then(null,e)},s.prototype.then=function(e,t){if("function"!=typeof e&&this.state===c||"function"!=typeof t&&this.state===i)return this;var n=new this.constructor(o);return this.state!==u?l(n,this.state===c?e:t,this.outcome):this.queue.push(new f(n,e,t)),n},f.prototype.callFulfilled=function(e){a.resolve(this.promise,e)},f.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},f.prototype.callRejected=function(e){a.reject(this.promise,e)},f.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},a.resolve=function(e,t){var n=h(d,t);if("error"===n.status)return a.reject(e,n.value);var r=n.value;if(r)v(e,r);else{e.state=c,e.outcome=t;for(var o=-1,i=e.queue.length;++o<i;)e.queue[o].callFulfilled(t)}return e},a.reject=function(e,t){e.state=i,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},s.resolve=g,s.reject=b,s.all=y,s.race=p},{1:1}],3:[function(e,t,n){(function(t){"function"!=typeof t.Promise&&(t.Promise=e(2))}).call(this,void 0!==v?v:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{2:2}],4:[function(e,t,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(e){return}}var i=a();function c(){try{if(!i||!i.open)return!1;var e="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),t="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!e||t)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(e){return!1}}function u(e,t){e=e||[],t=t||{};try{return new Blob(e,t)}catch(o){if("TypeError"!==o.name)throw o;for(var n=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)n.append(e[r]);return n.getBlob(t.type)}}"undefined"==typeof Promise&&e(3);var s=Promise;function f(e,t){t&&e.then((function(e){t(null,e)}),(function(e){t(e)}))}function l(e,t,n){"function"==typeof t&&e.then(t),"function"==typeof n&&e.catch(n)}function d(e){return"string"!=typeof e&&(e=String(e)),e}function v(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}var h="local-forage-detect-blob-support",g=void 0,b={},y=Object.prototype.toString,p="readonly",m="readwrite";function _(e){for(var t=e.length,n=new ArrayBuffer(t),r=new Uint8Array(n),o=0;o<t;o++)r[o]=e.charCodeAt(o);return n}function w(e){return new s((function(t){var n=e.transaction(h,m),r=u([""]);n.objectStore(h).put(r,"key"),n.onabort=function(e){e.preventDefault(),e.stopPropagation(),t(!1)},n.oncomplete=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),n=navigator.userAgent.match(/Edge\//);t(n||!e||parseInt(e[1],10)>=43)}})).catch((function(){return!1}))}function I(e){return"boolean"==typeof g?s.resolve(g):w(e).then((function(e){return g=e}))}function E(e){var t=b[e.name],n={};n.promise=new s((function(e,t){n.resolve=e,n.reject=t})),t.deferredOperations.push(n),t.dbReady?t.dbReady=t.dbReady.then((function(){return n.promise})):t.dbReady=n.promise}function S(e){var t=b[e.name].deferredOperations.pop();if(t)return t.resolve(),t.promise}function N(e,t){var n=b[e.name].deferredOperations.pop();if(n)return n.reject(t),n.promise}function R(e,t){return new s((function(n,r){if(b[e.name]=b[e.name]||M(),e.db){if(!t)return n(e.db);E(e),e.db.close()}var o=[e.name];t&&o.push(e.version);var a=i.open.apply(i,o);t&&(a.onupgradeneeded=function(t){var n=a.result;try{n.createObjectStore(e.storeName),t.oldVersion<=1&&n.createObjectStore(h)}catch(e){if("ConstraintError"!==e.name)throw e}}),a.onerror=function(e){e.preventDefault(),r(a.error)},a.onsuccess=function(){var t=a.result;t.onversionchange=function(e){e.target.close()},n(t),S(e)}}))}function T(e){return R(e,!1)}function O(e){return R(e,!0)}function C(e,t){if(!e.db)return!0;var n=!e.db.objectStoreNames.contains(e.storeName),r=e.version<e.db.version,o=e.version>e.db.version;if(r&&(e.version,e.version=e.db.version),o||n){if(n){var a=e.db.version+1;a>e.version&&(e.version=a)}return!0}return!1}function A(e){return new s((function(t,n){var r=new FileReader;r.onerror=n,r.onloadend=function(n){var r=btoa(n.target.result||"");t({__local_forage_encoded_blob:!0,data:r,type:e.type})},r.readAsBinaryString(e)}))}function D(e){return u([_(atob(e.data))],{type:e.type})}function j(e){return e&&e.__local_forage_encoded_blob}function k(e){var t=this,n=t._initReady().then((function(){var e=b[t._dbInfo.name];if(e&&e.dbReady)return e.dbReady}));return l(n,e,e),n}function L(e){E(e);for(var t=b[e.name],n=t.forages,r=0;r<n.length;r++){var o=n[r];o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)}return e.db=null,T(e).then((function(t){return e.db=t,C(e)?O(e):t})).then((function(r){e.db=t.db=r;for(var o=0;o<n.length;o++)n[o]._dbInfo.db=r})).catch((function(t){throw N(e,t),t}))}function B(e,t,n,r){void 0===r&&(r=1);try{var o=e.db.transaction(e.storeName,t);n(null,o)}catch(o){if(r>0&&(!e.db||"InvalidStateError"===o.name||"NotFoundError"===o.name))return s.resolve().then((function(){if(!e.db||"NotFoundError"===o.name&&!e.db.objectStoreNames.contains(e.storeName)&&e.version<=e.db.version)return e.db&&(e.version=e.db.version+1),O(e)})).then((function(){return L(e).then((function(){B(e,t,n,r-1)}))})).catch(n);n(o)}}function M(){return{forages:[],db:null,dbReady:null,deferredOperations:[]}}function x(e){var t=this,n={db:null};if(e)for(var r in e)n[r]=e[r];var o=b[n.name];o||(o=M(),b[n.name]=o),o.forages.push(t),t._initReady||(t._initReady=t.ready,t.ready=k);var a=[];function i(){return s.resolve()}for(var c=0;c<o.forages.length;c++){var u=o.forages[c];u!==t&&a.push(u._initReady().catch(i))}var f=o.forages.slice(0);return s.all(a).then((function(){return n.db=o.db,T(n)})).then((function(e){return n.db=e,C(n,t._defaultConfig.version)?O(n):e})).then((function(e){n.db=o.db=e,t._dbInfo=n;for(var r=0;r<f.length;r++){var a=f[r];a!==t&&(a._dbInfo.db=n.db,a._dbInfo.version=n.version)}}))}function U(e,t){var n=this;e=d(e);var r=new s((function(t,r){n.ready().then((function(){B(n._dbInfo,p,(function(o,a){if(o)return r(o);try{var i=a.objectStore(n._dbInfo.storeName).get(e);i.onsuccess=function(){var e=i.result;void 0===e&&(e=null),j(e)&&(e=D(e)),t(e)},i.onerror=function(){r(i.error)}}catch(e){r(e)}}))})).catch(r)}));return f(r,t),r}function G(e,t){var n=this,r=new s((function(t,r){n.ready().then((function(){B(n._dbInfo,p,(function(o,a){if(o)return r(o);try{var i=a.objectStore(n._dbInfo.storeName).openCursor(),c=1;i.onsuccess=function(){var n=i.result;if(n){var r=n.value;j(r)&&(r=D(r));var o=e(r,n.key,c++);void 0!==o?t(o):n.continue()}else t()},i.onerror=function(){r(i.error)}}catch(e){r(e)}}))})).catch(r)}));return f(r,t),r}function F(e,t,n){var r=this;e=d(e);var o=new s((function(n,o){var a;r.ready().then((function(){return a=r._dbInfo,"[object Blob]"===y.call(t)?I(a.db).then((function(e){return e?t:A(t)})):t})).then((function(t){B(r._dbInfo,m,(function(a,i){if(a)return o(a);try{var c=i.objectStore(r._dbInfo.storeName);null===t&&(t=void 0);var u=c.put(t,e);i.oncomplete=function(){void 0===t&&(t=null),n(t)},i.onabort=i.onerror=function(){var e=u.error?u.error:u.transaction.error;o(e)}}catch(e){o(e)}}))})).catch(o)}));return f(o,n),o}function P(e,t){var n=this;e=d(e);var r=new s((function(t,r){n.ready().then((function(){B(n._dbInfo,m,(function(o,a){if(o)return r(o);try{var i=a.objectStore(n._dbInfo.storeName).delete(e);a.oncomplete=function(){t()},a.onerror=function(){r(i.error)},a.onabort=function(){var e=i.error?i.error:i.transaction.error;r(e)}}catch(e){r(e)}}))})).catch(r)}));return f(r,t),r}function W(e){var t=this,n=new s((function(e,n){t.ready().then((function(){B(t._dbInfo,m,(function(r,o){if(r)return n(r);try{var a=o.objectStore(t._dbInfo.storeName).clear();o.oncomplete=function(){e()},o.onabort=o.onerror=function(){var e=a.error?a.error:a.transaction.error;n(e)}}catch(e){n(e)}}))})).catch(n)}));return f(n,e),n}function z(e){var t=this,n=new s((function(e,n){t.ready().then((function(){B(t._dbInfo,p,(function(r,o){if(r)return n(r);try{var a=o.objectStore(t._dbInfo.storeName).count();a.onsuccess=function(){e(a.result)},a.onerror=function(){n(a.error)}}catch(e){n(e)}}))})).catch(n)}));return f(n,e),n}function q(e,t){var n=this,r=new s((function(t,r){e<0?t(null):n.ready().then((function(){B(n._dbInfo,p,(function(o,a){if(o)return r(o);try{var i=a.objectStore(n._dbInfo.storeName),c=!1,u=i.openKeyCursor();u.onsuccess=function(){var n=u.result;n?0===e||c?t(n.key):(c=!0,n.advance(e)):t(null)},u.onerror=function(){r(u.error)}}catch(e){r(e)}}))})).catch(r)}));return f(r,t),r}function V(e){var t=this,n=new s((function(e,n){t.ready().then((function(){B(t._dbInfo,p,(function(r,o){if(r)return n(r);try{var a=o.objectStore(t._dbInfo.storeName).openKeyCursor(),i=[];a.onsuccess=function(){var t=a.result;t?(i.push(t.key),t.continue()):e(i)},a.onerror=function(){n(a.error)}}catch(e){n(e)}}))})).catch(n)}));return f(n,e),n}function H(e,t){t=v.apply(this,arguments);var n=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||n.name,e.storeName=e.storeName||n.storeName);var r,o=this;if(e.name){var a=e.name===n.name&&o._dbInfo.db?s.resolve(o._dbInfo.db):T(e).then((function(t){var n=b[e.name],r=n.forages;n.db=t;for(var o=0;o<r.length;o++)r[o]._dbInfo.db=t;return t}));r=e.storeName?a.then((function(t){if(t.objectStoreNames.contains(e.storeName)){var n=t.version+1;E(e);var r=b[e.name],o=r.forages;t.close();for(var a=0;a<o.length;a++){var c=o[a];c._dbInfo.db=null,c._dbInfo.version=n}var u=new s((function(t,r){var o=i.open(e.name,n);o.onerror=function(e){o.result.close(),r(e)},o.onupgradeneeded=function(){o.result.deleteObjectStore(e.storeName)},o.onsuccess=function(){var e=o.result;e.close(),t(e)}}));return u.then((function(e){r.db=e;for(var t=0;t<o.length;t++){var n=o[t];n._dbInfo.db=e,S(n._dbInfo)}})).catch((function(t){throw(N(e,t)||s.resolve()).catch((function(){})),t}))}})):a.then((function(t){E(e);var n=b[e.name],r=n.forages;t.close();for(var o=0;o<r.length;o++)r[o]._dbInfo.db=null;var a=new s((function(t,n){var r=i.deleteDatabase(e.name);r.onerror=function(){var e=r.result;e&&e.close(),n(r.error)},r.onblocked=function(){},r.onsuccess=function(){var e=r.result;e&&e.close(),t(e)}}));return a.then((function(e){n.db=e;for(var t=0;t<r.length;t++)S(r[t]._dbInfo)})).catch((function(t){throw(N(e,t)||s.resolve()).catch((function(){})),t}))}))}else r=s.reject("Invalid arguments");return f(r,t),r}var K={_driver:"asyncStorage",_initStorage:x,_support:c(),iterate:G,getItem:U,setItem:F,removeItem:P,clear:W,length:z,key:q,keys:V,dropInstance:H};function X(){return"function"==typeof openDatabase}var Q="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",J="~~local_forage_type~",Y=/^~~local_forage_type~([^~]+)~/,$="__lfsc__:",Z=$.length,ee="arbf",te="blob",ne="si08",re="ui08",oe="uic8",ae="si16",ie="si32",ce="ur16",ue="ui32",se="fl32",fe="fl64",le=Z+ee.length,de=Object.prototype.toString;function ve(e){var t,n,r,o,a,i=.75*e.length,c=e.length,u=0;"="===e[e.length-1]&&(i--,"="===e[e.length-2]&&i--);var s=new ArrayBuffer(i),f=new Uint8Array(s);for(t=0;t<c;t+=4)n=Q.indexOf(e[t]),r=Q.indexOf(e[t+1]),o=Q.indexOf(e[t+2]),a=Q.indexOf(e[t+3]),f[u++]=n<<2|r>>4,f[u++]=(15&r)<<4|o>>2,f[u++]=(3&o)<<6|63&a;return s}function he(e){var t,n=new Uint8Array(e),r="";for(t=0;t<n.length;t+=3)r+=Q[n[t]>>2],r+=Q[(3&n[t])<<4|n[t+1]>>4],r+=Q[(15&n[t+1])<<2|n[t+2]>>6],r+=Q[63&n[t+2]];return n.length%3==2?r=r.substring(0,r.length-1)+"=":n.length%3==1&&(r=r.substring(0,r.length-2)+"=="),r}function ge(e,t){var n="";if(e&&(n=de.call(e)),e&&("[object ArrayBuffer]"===n||e.buffer&&"[object ArrayBuffer]"===de.call(e.buffer))){var r,o=$;e instanceof ArrayBuffer?(r=e,o+=ee):(r=e.buffer,"[object Int8Array]"===n?o+=ne:"[object Uint8Array]"===n?o+=re:"[object Uint8ClampedArray]"===n?o+=oe:"[object Int16Array]"===n?o+=ae:"[object Uint16Array]"===n?o+=ce:"[object Int32Array]"===n?o+=ie:"[object Uint32Array]"===n?o+=ue:"[object Float32Array]"===n?o+=se:"[object Float64Array]"===n?o+=fe:t(new Error("Failed to get type for BinaryArray"))),t(o+he(r))}else if("[object Blob]"===n){var a=new FileReader;a.onload=function(){var n=J+e.type+"~"+he(this.result);t($+te+n)},a.readAsArrayBuffer(e)}else try{t(JSON.stringify(e))}catch(e){t(null,e)}}function be(e){if(e.substring(0,Z)!==$)return JSON.parse(e);var t,n=e.substring(le),r=e.substring(Z,le);if(r===te&&Y.test(n)){var o=n.match(Y);t=o[1],n=n.substring(o[0].length)}var a=ve(n);switch(r){case ee:return a;case te:return u([a],{type:t});case ne:return new Int8Array(a);case re:return new Uint8Array(a);case oe:return new Uint8ClampedArray(a);case ae:return new Int16Array(a);case ce:return new Uint16Array(a);case ie:return new Int32Array(a);case ue:return new Uint32Array(a);case se:return new Float32Array(a);case fe:return new Float64Array(a);default:throw new Error("Unkown type: "+r)}}var ye={serialize:ge,deserialize:be,stringToBuffer:ve,bufferToString:he};function pe(e,t,n,r){e.executeSql("CREATE TABLE IF NOT EXISTS "+t.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],n,r)}function me(e){var t=this,n={db:null};if(e)for(var r in e)n[r]="string"!=typeof e[r]?e[r].toString():e[r];var o=new s((function(e,r){try{n.db=openDatabase(n.name,String(n.version),n.description,n.size)}catch(e){return r(e)}n.db.transaction((function(o){pe(o,n,(function(){t._dbInfo=n,e()}),(function(e,t){r(t)}))}),r)}));return n.serializer=ye,o}function _e(e,t,n,r,o,a){e.executeSql(n,r,o,(function(e,i){i.code===i.SYNTAX_ERR?e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[t.storeName],(function(e,c){c.rows.length?a(e,i):pe(e,t,(function(){e.executeSql(n,r,o,a)}),a)}),a):a(e,i)}),a)}function we(e,t){var n=this;e=d(e);var r=new s((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"SELECT * FROM "+o.storeName+" WHERE key = ? LIMIT 1",[e],(function(e,n){var r=n.rows.length?n.rows.item(0).value:null;r&&(r=o.serializer.deserialize(r)),t(r)}),(function(e,t){r(t)}))}))})).catch(r)}));return f(r,t),r}function Ie(e,t){var n=this,r=new s((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"SELECT * FROM "+o.storeName,[],(function(n,r){for(var a=r.rows,i=a.length,c=0;c<i;c++){var u=a.item(c),s=u.value;if(s&&(s=o.serializer.deserialize(s)),void 0!==(s=e(s,u.key,c+1)))return void t(s)}t()}),(function(e,t){r(t)}))}))})).catch(r)}));return f(r,t),r}function Ee(e,t,n,r){var o=this;e=d(e);var a=new s((function(a,i){o.ready().then((function(){void 0===t&&(t=null);var c=t,u=o._dbInfo;u.serializer.serialize(t,(function(t,s){s?i(s):u.db.transaction((function(n){_e(n,u,"INSERT OR REPLACE INTO "+u.storeName+" (key, value) VALUES (?, ?)",[e,t],(function(){a(c)}),(function(e,t){i(t)}))}),(function(t){if(t.code===t.QUOTA_ERR){if(r>0)return void a(Ee.apply(o,[e,c,n,r-1]));i(t)}}))}))})).catch(i)}));return f(a,n),a}function Se(e,t,n){return Ee.apply(this,[e,t,n,1])}function Ne(e,t){var n=this;e=d(e);var r=new s((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"DELETE FROM "+o.storeName+" WHERE key = ?",[e],(function(){t()}),(function(e,t){r(t)}))}))})).catch(r)}));return f(r,t),r}function Re(e){var t=this,n=new s((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){_e(t,r,"DELETE FROM "+r.storeName,[],(function(){e()}),(function(e,t){n(t)}))}))})).catch(n)}));return f(n,e),n}function Te(e){var t=this,n=new s((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){_e(t,r,"SELECT COUNT(key) as c FROM "+r.storeName,[],(function(t,n){var r=n.rows.item(0).c;e(r)}),(function(e,t){n(t)}))}))})).catch(n)}));return f(n,e),n}function Oe(e,t){var n=this,r=new s((function(t,r){n.ready().then((function(){var o=n._dbInfo;o.db.transaction((function(n){_e(n,o,"SELECT key FROM "+o.storeName+" WHERE id = ? LIMIT 1",[e+1],(function(e,n){var r=n.rows.length?n.rows.item(0).key:null;t(r)}),(function(e,t){r(t)}))}))})).catch(r)}));return f(r,t),r}function Ce(e){var t=this,n=new s((function(e,n){t.ready().then((function(){var r=t._dbInfo;r.db.transaction((function(t){_e(t,r,"SELECT key FROM "+r.storeName,[],(function(t,n){for(var r=[],o=0;o<n.rows.length;o++)r.push(n.rows.item(o).key);e(r)}),(function(e,t){n(t)}))}))})).catch(n)}));return f(n,e),n}function Ae(e){return new s((function(t,n){e.transaction((function(r){r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],(function(n,r){for(var o=[],a=0;a<r.rows.length;a++)o.push(r.rows.item(a).name);t({db:e,storeNames:o})}),(function(e,t){n(t)}))}),(function(e){n(e)}))}))}function De(e,t){t=v.apply(this,arguments);var n=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||n.name,e.storeName=e.storeName||n.storeName);var r,o=this;return r=e.name?new s((function(t){var r;r=e.name===n.name?o._dbInfo.db:openDatabase(e.name,"","",0),e.storeName?t({db:r,storeNames:[e.storeName]}):t(Ae(r))})).then((function(e){return new s((function(t,n){e.db.transaction((function(r){function o(e){return new s((function(t,n){r.executeSql("DROP TABLE IF EXISTS "+e,[],(function(){t()}),(function(e,t){n(t)}))}))}for(var a=[],i=0,c=e.storeNames.length;i<c;i++)a.push(o(e.storeNames[i]));s.all(a).then((function(){t()})).catch((function(e){n(e)}))}),(function(e){n(e)}))}))})):s.reject("Invalid arguments"),f(r,t),r}var je={_driver:"webSQLStorage",_initStorage:me,_support:X(),iterate:Ie,getItem:we,setItem:Se,removeItem:Ne,clear:Re,length:Te,key:Oe,keys:Ce,dropInstance:De};function ke(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&!!localStorage.setItem}catch(e){return!1}}function Le(e,t){var n=e.name+"/";return e.storeName!==t.storeName&&(n+=e.storeName+"/"),n}function Be(){var e="_localforage_support_test";try{return localStorage.setItem(e,!0),localStorage.removeItem(e),!1}catch(e){return!0}}function Me(){return!Be()||localStorage.length>0}function xe(e){var t=this,n={};if(e)for(var r in e)n[r]=e[r];return n.keyPrefix=Le(e,t._defaultConfig),Me()?(t._dbInfo=n,n.serializer=ye,s.resolve()):s.reject()}function Ue(e){var t=this,n=t.ready().then((function(){for(var e=t._dbInfo.keyPrefix,n=localStorage.length-1;n>=0;n--){var r=localStorage.key(n);0===r.indexOf(e)&&localStorage.removeItem(r)}}));return f(n,e),n}function Ge(e,t){var n=this;e=d(e);var r=n.ready().then((function(){var t=n._dbInfo,r=localStorage.getItem(t.keyPrefix+e);return r&&(r=t.serializer.deserialize(r)),r}));return f(r,t),r}function Fe(e,t){var n=this,r=n.ready().then((function(){for(var t=n._dbInfo,r=t.keyPrefix,o=r.length,a=localStorage.length,i=1,c=0;c<a;c++){var u=localStorage.key(c);if(0===u.indexOf(r)){var s=localStorage.getItem(u);if(s&&(s=t.serializer.deserialize(s)),void 0!==(s=e(s,u.substring(o),i++)))return s}}}));return f(r,t),r}function Pe(e,t){var n=this,r=n.ready().then((function(){var t,r=n._dbInfo;try{t=localStorage.key(e)}catch(e){t=null}return t&&(t=t.substring(r.keyPrefix.length)),t}));return f(r,t),r}function We(e){var t=this,n=t.ready().then((function(){for(var e=t._dbInfo,n=localStorage.length,r=[],o=0;o<n;o++){var a=localStorage.key(o);0===a.indexOf(e.keyPrefix)&&r.push(a.substring(e.keyPrefix.length))}return r}));return f(n,e),n}function ze(e){var t=this.keys().then((function(e){return e.length}));return f(t,e),t}function qe(e,t){var n=this;e=d(e);var r=n.ready().then((function(){var t=n._dbInfo;localStorage.removeItem(t.keyPrefix+e)}));return f(r,t),r}function Ve(e,t,n){var r=this;e=d(e);var o=r.ready().then((function(){void 0===t&&(t=null);var n=t;return new s((function(o,a){var i=r._dbInfo;i.serializer.serialize(t,(function(t,r){if(r)a(r);else try{localStorage.setItem(i.keyPrefix+e,t),o(n)}catch(e){"QuotaExceededError"!==e.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==e.name||a(e),a(e)}}))}))}));return f(o,n),o}function He(e,t){if(t=v.apply(this,arguments),!(e="function"!=typeof e&&e||{}).name){var n=this.config();e.name=e.name||n.name,e.storeName=e.storeName||n.storeName}var r,o=this;return r=e.name?new s((function(t){e.storeName?t(Le(e,o._defaultConfig)):t(e.name+"/")})).then((function(e){for(var t=localStorage.length-1;t>=0;t--){var n=localStorage.key(t);0===n.indexOf(e)&&localStorage.removeItem(n)}})):s.reject("Invalid arguments"),f(r,t),r}var Ke={_driver:"localStorageWrapper",_initStorage:xe,_support:ke(),iterate:Fe,getItem:Ge,setItem:Ve,removeItem:qe,clear:Ue,length:ze,key:Pe,keys:We,dropInstance:He},Xe=function(e,t){return e===t||"number"==typeof e&&"number"==typeof t&&isNaN(e)&&isNaN(t)},Qe=function(e,t){for(var n=e.length,r=0;r<n;){if(Xe(e[r],t))return!0;r++}return!1},Je=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},Ye={},$e={},Ze={INDEXEDDB:K,WEBSQL:je,LOCALSTORAGE:Ke},et=[Ze.INDEXEDDB._driver,Ze.WEBSQL._driver,Ze.LOCALSTORAGE._driver],tt=["dropInstance"],nt=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(tt),rt={description:"",driver:et.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1};function ot(e,t){e[t]=function(){var n=arguments;return e.ready().then((function(){return e[t].apply(e,n)}))}}function at(){for(var e=1;e<arguments.length;e++){var t=arguments[e];if(t)for(var n in t)t.hasOwnProperty(n)&&(Je(t[n])?arguments[0][n]=t[n].slice():arguments[0][n]=t[n])}return arguments[0]}var it=function(){function e(t){for(var n in o(this,e),Ze)if(Ze.hasOwnProperty(n)){var r=Ze[n],a=r._driver;this[n]=a,Ye[a]||this.defineDriver(r)}this._defaultConfig=at({},rt),this._config=at({},this._defaultConfig,t),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch((function(){}))}return e.prototype.config=function(e){if("object"===(void 0===e?"undefined":r(e))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var t in e){if("storeName"===t&&(e[t]=e[t].replace(/\W/g,"_")),"version"===t&&"number"!=typeof e[t])return new Error("Database version must be a number.");this._config[t]=e[t]}return!("driver"in e)||!e.driver||this.setDriver(this._config.driver)}return"string"==typeof e?this._config[e]:this._config},e.prototype.defineDriver=function(e,t,n){var r=new s((function(t,n){try{var r=e._driver,o=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!e._driver)return void n(o);for(var a=nt.concat("_initStorage"),i=0,c=a.length;i<c;i++){var u=a[i];if((!Qe(tt,u)||e[u])&&"function"!=typeof e[u])return void n(o)}var l=function(){for(var t=function(e){return function(){var t=new Error("Method "+e+" is not implemented by the current driver"),n=s.reject(t);return f(n,arguments[arguments.length-1]),n}},n=0,r=tt.length;n<r;n++){var o=tt[n];e[o]||(e[o]=t(o))}};l();var d=function(n){Ye[r],Ye[r]=e,$e[r]=n,t()};"_support"in e?e._support&&"function"==typeof e._support?e._support().then(d,n):d(!!e._support):d(!0)}catch(e){n(e)}}));return l(r,t,n),r},e.prototype.driver=function(){return this._driver||null},e.prototype.getDriver=function(e,t,n){var r=Ye[e]?s.resolve(Ye[e]):s.reject(new Error("Driver not found."));return l(r,t,n),r},e.prototype.getSerializer=function(e){var t=s.resolve(ye);return l(t,e),t},e.prototype.ready=function(e){var t=this,n=t._driverSet.then((function(){return null===t._ready&&(t._ready=t._initDriver()),t._ready}));return l(n,e,e),n},e.prototype.setDriver=function(e,t,n){var r=this;Je(e)||(e=[e]);var o=this._getSupportedDrivers(e);function a(){r._config.driver=r.driver()}function i(e){return r._extend(e),a(),r._ready=r._initStorage(r._config),r._ready}function c(e){return function(){var t=0;function n(){for(;t<e.length;){var o=e[t];return t++,r._dbInfo=null,r._ready=null,r.getDriver(o).then(i).catch(n)}a();var c=new Error("No available storage method found.");return r._driverSet=s.reject(c),r._driverSet}return n()}}var u=null!==this._driverSet?this._driverSet.catch((function(){return s.resolve()})):s.resolve();return this._driverSet=u.then((function(){var e=o[0];return r._dbInfo=null,r._ready=null,r.getDriver(e).then((function(e){r._driver=e._driver,a(),r._wrapLibraryMethodsWithReady(),r._initDriver=c(o)}))})).catch((function(){a();var e=new Error("No available storage method found.");return r._driverSet=s.reject(e),r._driverSet})),l(this._driverSet,t,n),this._driverSet},e.prototype.supports=function(e){return!!$e[e]},e.prototype._extend=function(e){at(this,e)},e.prototype._getSupportedDrivers=function(e){for(var t=[],n=0,r=e.length;n<r;n++){var o=e[n];this.supports(o)&&t.push(o)}return t},e.prototype._wrapLibraryMethodsWithReady=function(){for(var e=0,t=nt.length;e<t;e++)ot(this,nt[e])},e.prototype.createInstance=function(t){return new e(t)},e}(),ct=new it;t.exports=ct},{3:3}]},{},[4])(4);var b=g;globalThis.setLobbyName=e=>{u.lobbyName=e},globalThis.disableNetwork=()=>{u.disableNet=!0},globalThis.setLoadingEvent=e=>{c.loadingEvent=e},globalThis.setBaseURL=e=>{globalThis.BASE_URL=e};let y=!1;async function p(){function e(t){globalThis.setCheckGameEvent?(globalThis.setCheckGameEvent({getIP:d.getIP,setLoadingEvent:globalThis.setLoadingEvent,setBaseURL:globalThis.setBaseURL}),globalThis.parent.isCheckGameCDN&&(globalThis.disableNetwork(),globalThis.CDN_LIST=[]),t()):setTimeout((()=>{e(t)}),100)}if(globalThis.parent!==globalThis)return u.isCheckGameCDN=globalThis.parent.isCheckGameCDN,c.isCheckGameCDN=u.isCheckGameCDN,new Promise((t=>{globalThis.parent.isCheckGameCDN||globalThis.parent.isGameManager?e(t):t()}))}!async function(){let{start:e,checkCDN:t}=await import("./agent.4312f838.js");await e();let n=u;n.res&&("v1"===n.res?n.useAvif=!1:"v2"===n.res&&(n.useAvif=!0));let r="common";d.log({label:r,category:"啟動程式"});let o={category:"初始化 主網址",getLabel:()=>`${r}`};if(d.loadBegin(o),"check"===n.lobbyName)try{await p()}catch(e){}try{await async function(){let e=null;if(u.useCache){if(navigator.serviceWorker&&navigator.serviceWorker.register)return e=await navigator.serviceWorker.register("/lib.sw.js",{scope:"/"}),u.registration=e,u.hasCache=!0,e.addEventListener("updatefound",(function(){e.update();let t=e.installing;t.addEventListener("statechange",(()=>{"installed"===t.state&&globalThis.location.reload()}))})),navigator.serviceWorker.addEventListener("message",(e=>{})),new Promise((t=>{!function(){if(e&&e.active&&navigator.serviceWorker.controller){let e={};e.config={BASE_URL:globalThis.BASE_URL,CDN_LIST:globalThis.CDN_LIST},navigator.serviceWorker.controller.postMessage(e),t()}else t()}()}))}else navigator.serviceWorker&&navigator.serviceWorker.register&&(e=await navigator.serviceWorker.register("/lib.sw.js?v=2.0.0",{scope:"/"}),e&&e.unregister&&await e.unregister())}()}catch(e){}d.log({eventName:n.hasCache?"使用":"不使用",label:r,category:"確認快取功能"});let a=null,i=null;try{await b.setDriver(b.LOCALSTORAGE),i=b.createInstance({name:"mygames",storeName:"agent2"}),i&&n.isCheckGameCDN,n.store=i}catch(e){}if(a)globalThis.BASE_URL=a,d.report.currentURL=a,n.selectCDN=!0;else if(!n.hasCache)try{await t()}catch(e){}d.log({eventName:n.hasCDN?"使用":"不使用",label:r,category:"確認服務線路"});try{const{Howl:e,Howler:r,IsMobile:o,m:a,nuts:i,component:c,load:u}=await import("./agent.3c051f13.js").then((function(e){return e.n}));await u(),globalThis.Howl=e,globalThis.Howler=r,globalThis.Howler&&(globalThis.Howler.autoSuspend=!1),globalThis.isMobile=o(globalThis.navigator.userAgent);let s=[],f={PIXI:globalThis.PIXI,m:a,io:globalThis.io,Stats:null,plugin:s};await i.init(f);let l=i.ui.loading,d=async e=>{let t=await e.get(n.langID);n.images=t.images,t.images&&t.images.loading&&l.setScene(t.images.loading)};if(n.useAvif?import("./agent.a6a7dd4a.js").then((e=>{d(e)})):await import("./agent.709ae692.js").then((e=>{d(e)})),y)return;y=!0;let v=globalThis.createjs.Ticker;v.timingMode=v.TIMEOUT,c.run({checkCDN:t,element:document.body})}catch(e){}d.loadEnd(o),d.log({label:r,category:"初始化 主網址"})}();export{e as G,n as M,t as O,r as T,a,c as b,v as c,s as d,o as e,b as l,i as o,d as r,u as s};
