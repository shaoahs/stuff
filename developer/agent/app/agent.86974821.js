import{c as e,f as t,m as o,g as r,j as a,b as l}from"./agent.860b1310.js";import{r as s,d as i,s as n}from"./agent.1ae2bbf4.js";function c(){}var g=Object.freeze({__proto__:null,show:function(){},hide:function(){},clear:c});let h={handle(a){globalThis.lobby.currentUser=a.userInfo;let l=i,c=n;l.isLogin=!0,l.state="已登入",e&&t(),o.redraw(),s.serviceEnd(h.report),s.log({label:"net",category:"登入"}),c.isManual||r()},report:{time:0,category:"登入",getLabel:()=>"net"},error:a.fatal},b={handle(e){i.isError=!0,globalThis.Howler&&(globalThis.Howler.mute(!0),globalThis.Howler.unload());let t="errorLow";"this account log in elsewhere"===e.text&&(t="elsewhere"),"errorLow"!==t&&l({title:"errorLow",msg:t})}},u={handle(e){i.isError=!0,globalThis.Howler&&(globalThis.Howler.mute(!0),globalThis.Howler.unload());let t="kickOut";"idle too long time"===e.text?t="kickOut":"System kickout"===e.text&&(t="systemKickOut"),l({title:"notice",msg:t})}};const d="kickOut",w="updateBalance",f="disconnectMsg";let m={handle(e){let t=e;if("string"==typeof e&&(t=JSON.parse(e)),t&&t.proto&&t.json){let e=JSON.parse(t.json);switch(t.proto){case w:break;case f:b.handle(e);break;case d:u.handle(e)}}}};export{h as C,m as a,c,g as n};