
var OGVDecoderVideoVP9W = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(OGVDecoderVideoVP9W) {
  OGVDecoderVideoVP9W = OGVDecoderVideoVP9W || {};


var a;a||(a=typeof OGVDecoderVideoVP9W !== 'undefined' ? OGVDecoderVideoVP9W : {});var aa,n;a.ready=new Promise(function(b,c){aa=b;n=c});var ba=a,ca=Object.assign({},a),ha="object"==typeof window,p="function"==typeof importScripts,ia="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,u="",v,w,x,fs,z,D;
if(ia)u=p?require("path").dirname(u)+"/":__dirname+"/",D=()=>{z||(fs=require("fs"),z=require("path"))},v=function(b,c){D();b=z.normalize(b);return fs.readFileSync(b,c?void 0:"utf8")},x=b=>{b=v(b,!0);b.buffer||(b=new Uint8Array(b));return b},w=(b,c,f)=>{D();b=z.normalize(b);fs.readFile(b,function(d,e){d?f(d):c(e.buffer)})},1<process.argv.length&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),process.on("unhandledRejection",function(b){throw b;}),a.inspect=function(){return"[Emscripten Module object]"};
else if(ha||p)p?u=self.location.href:"undefined"!=typeof document&&document.currentScript&&(u=document.currentScript.src),_scriptDir&&(u=_scriptDir),0!==u.indexOf("blob:")?u=u.substr(0,u.replace(/[?#].*/,"").lastIndexOf("/")+1):u="",v=b=>{var c=new XMLHttpRequest;c.open("GET",b,!1);c.send(null);return c.responseText},p&&(x=b=>{var c=new XMLHttpRequest;c.open("GET",b,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}),w=(b,c,f)=>{var d=new XMLHttpRequest;d.open("GET",
b,!0);d.responseType="arraybuffer";d.onload=()=>{200==d.status||0==d.status&&d.response?c(d.response):f()};d.onerror=f;d.send(null)};a.print||console.log.bind(console);var F=a.printErr||console.warn.bind(console);Object.assign(a,ca);ca=null;var G;a.wasmBinary&&(G=a.wasmBinary);var noExitRuntime=a.noExitRuntime||!0;"object"!=typeof WebAssembly&&H("no native wasm support detected");var I,ja=!1,ka,la;
function ma(){var b=I.buffer;ka=b;a.HEAP8=new Int8Array(b);a.HEAP16=new Int16Array(b);a.HEAP32=new Int32Array(b);a.HEAPU8=la=new Uint8Array(b);a.HEAPU16=new Uint16Array(b);a.HEAPU32=new Uint32Array(b);a.HEAPF32=new Float32Array(b);a.HEAPF64=new Float64Array(b)}var na,oa=[],pa=[],qa=[];function ra(){var b=a.preRun.shift();oa.unshift(b)}var L=0,sa=null,M=null;
function H(b){if(a.onAbort)a.onAbort(b);b="Aborted("+b+")";F(b);ja=!0;b=new WebAssembly.RuntimeError(b+". Build with -sASSERTIONS for more info.");n(b);throw b;}function ta(){return N.startsWith("data:application/octet-stream;base64,")}var N;N="ogv-decoder-video-vp9-wasm.wasm";if(!ta()){var ua=N;N=a.locateFile?a.locateFile(ua,u):u+ua}function va(){var b=N;try{if(b==N&&G)return new Uint8Array(G);if(x)return x(b);throw"both async and sync fetching of the wasm failed";}catch(c){H(c)}}
function wa(){if(!G&&(ha||p)){if("function"==typeof fetch&&!N.startsWith("file://"))return fetch(N,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+N+"'";return b.arrayBuffer()}).catch(function(){return va()});if(w)return new Promise(function(b,c){w(N,function(f){b(new Uint8Array(f))},c)})}return Promise.resolve().then(function(){return va()})}function Ia(b){for(;0<b.length;)b.shift()(a)}var O=[];
function P(b){var c=O[b];c||(b>=O.length&&(O.length=b+1),O[b]=c=na.get(b));return c}
var Ra={j:function(){throw Infinity;},h:function(b,c,f){la.copyWithin(b,c,c+f)},k:function(b){var c=la.length;b>>>=0;if(2147483648<b)return!1;for(var f=1;4>=f;f*=2){var d=c*(1+.2/f);d=Math.min(d,b+100663296);var e=Math;d=Math.max(b,d);e=e.min.call(e,2147483648,d+(65536-d%65536)%65536);a:{try{I.grow(e-ka.byteLength+65535>>>16);ma();var g=1;break a}catch(h){}g=void 0}if(g)return!0}return!1},b:Ja,d:Ka,g:La,e:Ma,c:Na,a:Oa,i:Pa,f:Qa,l:function(b,c,f,d,e,g,h,l,q,r,t,J,Q,R,da,ea){function fa(E,k,A,xa,ya,
za,Ta,Ua,S){E.set(new Uint8Array(Va,k,A*xa));var B,y;for(B=y=0;B<za;B++,y+=A)for(k=0;k<A;k++)E[y+k]=S;for(;B<za+Ua;B++,y+=A){for(k=0;k<ya;k++)E[y+k]=S;for(k=ya+Ta;k<A;k++)E[y+k]=S}for(;B<xa;B++,y+=A)for(k=0;k<A;k++)E[y+k]=S;return E}var Va=I.buffer,m=a.videoFormat,Aa=(Q&-2)*q/h,Ba=(R&-2)*r/l,Ca=t*q/h,Da=J*r/l;t===m.cropWidth&&J===m.cropHeight&&(da=m.displayWidth,ea=m.displayHeight);for(var Ea=a.recycledFrames,C,Fa=l*c,Ga=r*d,Ha=r*g;0<Ea.length;){var K=Ea.shift();m=K.format;if(m.width===h&&m.height===
l&&m.chromaWidth===q&&m.chromaHeight===r&&m.cropLeft===Q&&m.cropTop===R&&m.cropWidth===t&&m.cropHeight===J&&m.displayWidth===da&&m.displayHeight===ea&&K.y.bytes.length===Fa&&K.u.bytes.length===Ga&&K.v.bytes.length===Ha){C=K;break}}C||(C={format:{width:h,height:l,chromaWidth:q,chromaHeight:r,cropLeft:Q,cropTop:R,cropWidth:t,cropHeight:J,displayWidth:da,displayHeight:ea},y:{bytes:new Uint8Array(Fa),stride:c},u:{bytes:new Uint8Array(Ga),stride:d},v:{bytes:new Uint8Array(Ha),stride:g}});fa(C.y.bytes,
b,c,l,Q,R,t,J,0);fa(C.u.bytes,f,d,r,Aa,Ba,Ca,Da,128);fa(C.v.bytes,e,g,r,Aa,Ba,Ca,Da,128);a.frameBuffer=C}};
(function(){function b(e){a.asm=e.exports;I=a.asm.m;ma();na=a.asm.t;pa.unshift(a.asm.n);L--;a.monitorRunDependencies&&a.monitorRunDependencies(L);0==L&&(null!==sa&&(clearInterval(sa),sa=null),M&&(e=M,M=null,e()))}function c(e){b(e.instance)}function f(e){return wa().then(function(g){return WebAssembly.instantiate(g,d)}).then(function(g){return g}).then(e,function(g){F("failed to asynchronously prepare wasm: "+g);H(g)})}var d={a:Ra};L++;a.monitorRunDependencies&&a.monitorRunDependencies(L);if(a.instantiateWasm)try{return a.instantiateWasm(d,
b)}catch(e){return F("Module.instantiateWasm callback failed with error: "+e),!1}(function(){return G||"function"!=typeof WebAssembly.instantiateStreaming||ta()||N.startsWith("file://")||ia||"function"!=typeof fetch?f(c):fetch(N,{credentials:"same-origin"}).then(function(e){return WebAssembly.instantiateStreaming(e,d).then(c,function(g){F("wasm streaming compile failed: "+g);F("falling back to ArrayBuffer instantiation");return f(c)})})})().catch(n);return{}})();
a.___wasm_call_ctors=function(){return(a.___wasm_call_ctors=a.asm.n).apply(null,arguments)};a._ogv_video_decoder_init=function(){return(a._ogv_video_decoder_init=a.asm.o).apply(null,arguments)};a._ogv_video_decoder_async=function(){return(a._ogv_video_decoder_async=a.asm.p).apply(null,arguments)};a._ogv_video_decoder_destroy=function(){return(a._ogv_video_decoder_destroy=a.asm.q).apply(null,arguments)};
a._ogv_video_decoder_process_header=function(){return(a._ogv_video_decoder_process_header=a.asm.r).apply(null,arguments)};a._ogv_video_decoder_process_frame=function(){return(a._ogv_video_decoder_process_frame=a.asm.s).apply(null,arguments)};a._malloc=function(){return(a._malloc=a.asm.u).apply(null,arguments)};a._free=function(){return(a._free=a.asm.v).apply(null,arguments)};
var T=a._setThrew=function(){return(T=a._setThrew=a.asm.w).apply(null,arguments)},U=a.stackSave=function(){return(U=a.stackSave=a.asm.x).apply(null,arguments)},V=a.stackRestore=function(){return(V=a.stackRestore=a.asm.y).apply(null,arguments)};function La(b,c,f,d,e){var g=U();try{return P(b)(c,f,d,e)}catch(h){V(g);if(h!==h+0)throw h;T(1,0)}}function Oa(b,c,f,d,e){var g=U();try{P(b)(c,f,d,e)}catch(h){V(g);if(h!==h+0)throw h;T(1,0)}}
function Qa(b,c,f,d,e,g,h,l,q){var r=U();try{P(b)(c,f,d,e,g,h,l,q)}catch(t){V(r);if(t!==t+0)throw t;T(1,0)}}function Ma(b,c,f,d,e,g){var h=U();try{return P(b)(c,f,d,e,g)}catch(l){V(h);if(l!==l+0)throw l;T(1,0)}}function Ka(b,c,f,d){var e=U();try{return P(b)(c,f,d)}catch(g){V(e);if(g!==g+0)throw g;T(1,0)}}function Pa(b,c,f,d,e,g,h){var l=U();try{P(b)(c,f,d,e,g,h)}catch(q){V(l);if(q!==q+0)throw q;T(1,0)}}function Ja(b,c,f){var d=U();try{return P(b)(c,f)}catch(e){V(d);if(e!==e+0)throw e;T(1,0)}}
function Na(b,c){var f=U();try{P(b)(c)}catch(d){V(f);if(d!==d+0)throw d;T(1,0)}}var W;M=function Sa(){W||Wa();W||(M=Sa)};
function Wa(){function b(){if(!W&&(W=!0,a.calledRun=!0,!ja)){Ia(pa);aa(a);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var c=a.postRun.shift();qa.unshift(c)}Ia(qa)}}if(!(0<L)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)ra();Ia(oa);0<L||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},1)):b())}}
if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();Wa();var X,Xa,Y;"undefined"===typeof performance||"undefined"===typeof performance.now?Y=Date.now:Y=performance.now.bind(performance);function Z(b){var c=Y();b=b();a.cpuTime+=Y()-c;return b}a.loadedMetadata=!!ba.videoFormat;a.videoFormat=ba.videoFormat||null;a.frameBuffer=null;a.cpuTime=0;Object.defineProperty(a,"processing",{get:function(){return!1}});
a.init=function(b){Z(function(){a._ogv_video_decoder_init()});b()};a.processHeader=function(b,c){var f=Z(function(){var d=b.byteLength;X&&Xa>=d||(X&&a._free(X),Xa=d,X=a._malloc(Xa));var e=X;(new Uint8Array(I.buffer,e,d)).set(new Uint8Array(b));return a._ogv_video_decoder_process_header(e,d)});c(f)};a.A=[];
a.processFrame=function(b,c){function f(l){a._free(g);c(l)}var d=a._ogv_video_decoder_async(),e=b.byteLength,g=a._malloc(e);d&&a.A.push(f);var h=Z(function(){(new Uint8Array(I.buffer,g,e)).set(new Uint8Array(b));return a._ogv_video_decoder_process_frame(g,e)});d||f(h)};a.close=function(){};a.sync=function(){a._ogv_video_decoder_async()&&(a.A.push(function(){}),Z(function(){a._ogv_video_decoder_process_frame(0,0)}))};a.recycledFrames=[];
a.recycleFrame=function(b){var c=a.recycledFrames;c.push(b);16<c.length&&c.shift()};


  return OGVDecoderVideoVP9W.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = OGVDecoderVideoVP9W;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return OGVDecoderVideoVP9W; });
else if (typeof exports === 'object')
  exports["OGVDecoderVideoVP9W"] = OGVDecoderVideoVP9W;