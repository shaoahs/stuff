async function t(t,e){let n={gid:e,packet:t},a=await import("./agent.23931d4d.js");return await a.togame(n)}let e={gameEvent:{}};function n(t,n){n&&(e.gameEvent[n]=t)}function a(t){e.gameEvent[t]=null}async function r(t){let e=await import("./agent.23931d4d.js");return await e.register(t)}function i(){let e={};return e.send=t,e.registerGameEvent=n,e.unregisterGameEvent=a,e.register=r,e}function g(){return e.gameEvent}export{i as create,g as getGameEvent};
