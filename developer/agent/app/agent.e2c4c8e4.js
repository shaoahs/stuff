import{m as e,r as t,e as o,s as r}from"./agent.501c77c1.js";import{f as a,g as l,i as s,k as i,b as n}from"./agent.72a8b87f.js";function c(){}var g=Object.freeze({__proto__:null,show:function(){},hide:function(){},clear:c});let h={handle(i){globalThis.lobby.currentUser=i.userInfo;let n=o,c=r;n.isLogin=!0,n.state="已登入",a&&l(),e.redraw(),t.serviceEnd(h.report),t.log({label:"net",category:"登入"}),c.isManual||s()},report:{time:0,category:"登入",getLabel:()=>"net"},error:i.fatal},u={handle(e){o.isError=!0,globalThis.Howler&&(globalThis.Howler.mute(!0),globalThis.Howler.unload());let t="errorLow";"this account log in elsewhere"===e.text&&(t="elsewhere"),"errorLow"!==t&&n({title:"errorLow",msg:t})}},b={handle(e){o.isError=!0,globalThis.Howler&&(globalThis.Howler.mute(!0),globalThis.Howler.unload());let t="kickOut";"idle too long time"===e.text?t="kickOut":"System kickout"===e.text&&(t="systemKickOut"),n({title:"notice",msg:t})}};const d="kickOut",w="updateBalance",m="disconnectMsg";let f={handle(e){let t=e;if("string"==typeof e&&(t=JSON.parse(e)),t&&t.proto&&t.json){let e=JSON.parse(t.json);switch(t.proto){case w:break;case m:u.handle(e);break;case d:b.handle(e)}}}};export{h as C,f as a,c,g as n};
