
var OGVDecoderVideoTheoraW = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(OGVDecoderVideoTheoraW) {
  OGVDecoderVideoTheoraW = OGVDecoderVideoTheoraW || {};


var a;a||(a=typeof OGVDecoderVideoTheoraW !== 'undefined' ? OGVDecoderVideoTheoraW : {});var ba,l;a.ready=new Promise(function(b,c){ba=b;l=c});var ca=a,da=Object.assign({},a),ea="object"==typeof window,m="function"==typeof importScripts,fa="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,t="",y,B,C,fs,D,E;
if(fa)t=m?require("path").dirname(t)+"/":__dirname+"/",E=()=>{D||(fs=require("fs"),D=require("path"))},y=function(b,c){E();b=D.normalize(b);return fs.readFileSync(b,c?void 0:"utf8")},C=b=>{b=y(b,!0);b.buffer||(b=new Uint8Array(b));return b},B=(b,c,f)=>{E();b=D.normalize(b);fs.readFile(b,function(d,e){d?f(d):c(e.buffer)})},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("unhandledRejection",function(b){throw b;}),a.inspect=function(){return"[Emscripten Module object]"};
else if(ea||m)m?t=self.location.href:"undefined"!=typeof document&&document.currentScript&&(t=document.currentScript.src),_scriptDir&&(t=_scriptDir),0!==t.indexOf("blob:")?t=t.substr(0,t.replace(/[?#].*/,"").lastIndexOf("/")+1):t="",y=b=>{var c=new XMLHttpRequest;c.open("GET",b,!1);c.send(null);return c.responseText},m&&(C=b=>{var c=new XMLHttpRequest;c.open("GET",b,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}),B=(b,c,f)=>{var d=new XMLHttpRequest;d.open("GET",
b,!0);d.responseType="arraybuffer";d.onload=()=>{200==d.status||0==d.status&&d.response?c(d.response):f()};d.onerror=f;d.send(null)};a.print||console.log.bind(console);var H=a.printErr||console.warn.bind(console);Object.assign(a,da);da=null;var I;a.wasmBinary&&(I=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;"object"!=typeof WebAssembly&&J("no native wasm support detected");var K,ha=!1,ia,O;
function ja(){var b=K.buffer;ia=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=O=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var ka=[],la=[],ma=[];function na(){var b=a.preRun.shift();ka.unshift(b)}var P=0,Q=null,R=null;
function J(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";H(b);ha=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");l(b);throw b;}function oa(){return S.startsWith("data:application/octet-stream;base64,")}var S;S="ogv-decoder-video-theora-wasm.wasm";if(!oa()){var pa=S;S=a.locateFile?a.locateFile(pa,t):t+pa}function qa(){var b=S;try{if(b==S&&I)return new Uint8Array(I);if(C)return C(b);throw"both async and sync fetching of the wasm failed";}catch(c){J(c)}}
function Ca(){if(!I&&(ea||m)){if("function"==typeof fetch&&!S.startsWith("file://"))return fetch(S,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+S+"'";return b.arrayBuffer()}).catch(function(){return qa()});if(B)return new Promise(function(b,c){B(S,function(f){b(new Uint8Array(f))},c)})}return Promise.resolve().then(function(){return qa()})}function T(b){for(;0<b.length;)b.shift()(a)}
var Da={b:function(b,c,f){O.copyWithin(b,c,c+f)},a:function(b){var c=O.length;b>>>=0;if(2147483648<b)return!1;for(var f=1;4>=f;f*=2){var d=c*(1+.2/f);d=Math.min(d,b+100663296);var e=Math;d=Math.max(b,d);e=e.min.call(e,2147483648,d+(65536-d%65536)%65536);a:{try{K.grow(e-ia.byteLength+65535>>>16);ja();var g=1;break a}catch(q){}g=void 0}if(g)return!0}return!1},c:function(b,c,f,d,e,g,q,n,z,p,u,F,L,M,Y,Z){function aa(A,h,v,ra,sa,ta,Fa,Ga,N){A.set(new Uint8Array(Ha,h,v*ra));var w,r;for(w=r=0;w<ta;w++,r+=
v)for(h=0;h<v;h++)A[r+h]=N;for(;w<ta+Ga;w++,r+=v){for(h=0;h<sa;h++)A[r+h]=N;for(h=sa+Fa;h<v;h++)A[r+h]=N}for(;w<ra;w++,r+=v)for(h=0;h<v;h++)A[r+h]=N;return A}var Ha=K.buffer,k=a.videoFormat,ua=(L&-2)*z/q,va=(M&-2)*p/n,wa=u*z/q,xa=F*p/n;u===k.cropWidth&&F===k.cropHeight&&(Y=k.displayWidth,Z=k.displayHeight);for(var ya=a.recycledFrames,x,za=n*c,Aa=p*d,Ba=p*g;0<ya.length;){var G=ya.shift();k=G.format;if(k.width===q&&k.height===n&&k.chromaWidth===z&&k.chromaHeight===p&&k.cropLeft===L&&k.cropTop===M&&
k.cropWidth===u&&k.cropHeight===F&&k.displayWidth===Y&&k.displayHeight===Z&&G.y.bytes.length===za&&G.u.bytes.length===Aa&&G.v.bytes.length===Ba){x=G;break}}x||(x={format:{width:q,height:n,chromaWidth:z,chromaHeight:p,cropLeft:L,cropTop:M,cropWidth:u,cropHeight:F,displayWidth:Y,displayHeight:Z},y:{bytes:new Uint8Array(za),stride:c},u:{bytes:new Uint8Array(Aa),stride:d},v:{bytes:new Uint8Array(Ba),stride:g}});aa(x.y.bytes,b,c,n,L,M,u,F,0);aa(x.u.bytes,f,d,p,ua,va,wa,xa,128);aa(x.v.bytes,e,g,p,ua,va,
wa,xa,128);a.frameBuffer=x},d:function(b,c,f,d,e,g,q,n,z,p,u){a.videoFormat={width:b,height:c,chromaWidth:f,chromaHeight:d,cropLeft:n,cropTop:z,cropWidth:g,cropHeight:q,displayWidth:p,displayHeight:u,fps:e};a.loadedMetadata=!0}};
(function(){function b(e){a.asm=e.exports;K=a.asm.e;ja();la.unshift(a.asm.f);P--;a.monitorRunDependencies&&a.monitorRunDependencies(P);0==P&&(null!==Q&&(clearInterval(Q),Q=null),R&&(e=R,R=null,e()))}function c(e){b(e.instance)}function f(e){return Ca().then(function(g){return WebAssembly.instantiate(g,d)}).then(function(g){return g}).then(e,function(g){H("failed to asynchronously prepare wasm: "+g);J(g)})}var d={a:Da};P++;a.monitorRunDependencies&&a.monitorRunDependencies(P);if(a.instantiateWasm)try{return a.instantiateWasm(d,
b)}catch(e){return H("Module.instantiateWasm callback failed with error: "+e),!1}(function(){return I||"function"!=typeof WebAssembly.instantiateStreaming||oa()||S.startsWith("file://")||fa||"function"!=typeof fetch?f(c):fetch(S,{credentials:"same-origin"}).then(function(e){return WebAssembly.instantiateStreaming(e,d).then(c,function(g){H("wasm streaming compile failed: "+g);H("falling back to ArrayBuffer instantiation");return f(c)})})})().catch(l);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.f).apply(null,arguments)};a._ogv_video_decoder_init=function(){return(a._ogv_video_decoder_init=a.asm.g).apply(null,arguments)};a._ogv_video_decoder_async=function(){return(a._ogv_video_decoder_async=a.asm.h).apply(null,arguments)};a._ogv_video_decoder_process_header=function(){return(a._ogv_video_decoder_process_header=a.asm.i).apply(null,arguments)};
a._ogv_video_decoder_process_frame=function(){return(a._ogv_video_decoder_process_frame=a.asm.j).apply(null,arguments)};a._ogv_video_decoder_destroy=function(){return(a._ogv_video_decoder_destroy=a.asm.k).apply(null,arguments)};a._malloc=function(){return(a._malloc=a.asm.l).apply(null,arguments)};a._free=function(){return(a._free=a.asm.m).apply(null,arguments)};var U;R=function Ea(){U||Ia();U||(R=Ea)};
function Ia(){function b(){if(!U&&(U=!0,a.calledRun=!0,!ha)){T(la);ba(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();ma.unshift(c)}T(ma)}}if(!(0<P)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)na();T(ka);0<P||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();Ia();var V,Ja,W;"undefined"===typeof performance||"undefined"===typeof performance.now?W=Date.now:W=performance.now.bind(performance);function X(b){var c=W();b=b();a.cpuTime+=W()-c;return b}a.loadedMetadata=!!ca.videoFormat;a.videoFormat=ca.videoFormat||null;a.frameBuffer=null;a.cpuTime=0;Object.defineProperty(a,"processing",{get:function(){return!1}});
a.init=function(b){X(function(){a._ogv_video_decoder_init()});b()};a.processHeader=function(b,c){var f=X(function(){var d=b.byteLength;V&&Ja>=d||(V&&a._free(V),Ja=d,V=a._malloc(Ja));var e=V;(new Uint8Array(K.buffer,e,d)).set(new Uint8Array(b));return a._ogv_video_decoder_process_header(e,d)});c(f)};a.o=[];
a.processFrame=function(b,c){function f(n){a._free(g);c(n)}var d=a._ogv_video_decoder_async(),e=b.byteLength,g=a._malloc(e);d&&a.o.push(f);var q=X(function(){(new Uint8Array(K.buffer,g,e)).set(new Uint8Array(b));return a._ogv_video_decoder_process_frame(g,e)});d||f(q)};a.close=function(){};a.sync=function(){a._ogv_video_decoder_async()&&(a.o.push(function(){}),X(function(){a._ogv_video_decoder_process_frame(0,0)}))};a.recycledFrames=[];
a.recycleFrame=function(b){var c=a.recycledFrames;c.push(b);16<c.length&&c.shift()};


  return OGVDecoderVideoTheoraW.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = OGVDecoderVideoTheoraW;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return OGVDecoderVideoTheoraW; });
else if (typeof exports === 'object')
  exports["OGVDecoderVideoTheoraW"] = OGVDecoderVideoTheoraW;