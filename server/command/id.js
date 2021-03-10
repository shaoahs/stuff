(function() {
  const logger = require('pino')({
    prettyPrint: {
      translateTime: true,
      colorize: true,
    }
  });
  
  var RESULT = {
    ERROR: 0,
    OK: 1
  };

  var CMD = {
    ERROR:        'error',      // 錯誤
    CONNECT:      'connect',    // 連線
    LOGIN:        'login',      // 登入
    IN_GAME:      'inGame',     // 進入遊戲
    TO_GAME:      'toGame',     // 遊戲命令
    EXIT_GAME:    'exitGame',   // 離開遊戲
    NET_PING:     'ping',       // net ping
    NET_PONG:     'pong',       // net pong
    BROADCAST:    'broadCastMsg',  // 廣播訊息
    RECONNECT:    'reconnect',  // 重新連線
    DISCONNECT:   'disconnect'  // 斷線
  };
  var filenameMapCommand = {
    "login.js" : CMD.LOGIN,
    "inGame.js" : CMD.IN_GAME,
    "toGame.js" : CMD.TO_GAME,
    "exitGame.js" : CMD.EXIT_GAME,
    "ping.js" : CMD.NET_PING,
    "pong.js" : CMD.NET_PONG,
    "reconnect.js" : CMD.RECONNECT,
    "disconnect.js" : CMD.DISCONNECT
  };
  //--------
  exports.filenameToCommand = function(filename){
    var cmdID = filenameMapCommand[filename];
    return cmdID;
  };
  exports.RESULT = RESULT;
  exports.CMD = CMD;
  exports.logger = logger;
  //-----------------------------------------------
}).call(this);
