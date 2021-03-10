/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

let socketio = null;

function init (config) {
  socketio = config.io;
}

/**
 * 網路物件
 *
 */
class Network {

  /**
   * 建立網路物件並連線
   * @param config 設定檔
   * @param roomName 房間名稱
   */
  //  constructor (config, roomName = '/1.00.0') {
  constructor (config, roomName = '') {

    //    this.symbol = Symbol();
    let property = {
      event: config && config.event,
      socket: null,
      cmdList: config && config.commandList,
      isConnect: false,
      host: config && config.host,
      roomName: roomName
    };

    // is private
    //    this[this.symbol] = property;
    /**
     * 是否連線
     */
    this.isConnect = () => property.isConnect;

    /**
     * 設定 Host
     * @param hostName {String} 主機名稱
     */
    this.setHost = (hostName) => property.host = hostName;

    /**
     * 設定命令列清單
     */
    this.setCommandList = (cmdList) => property.cmdList = cmdList;

    /**
     * 註冊網路事件
     * @param name
     * @param event
     */
    this.registerCommand = (name, event) => {
      let socket = property.socket;
      if (socket) {
        socket.on(name, event);
      }
    };

    /**
     * 傳送命令
     * @param name  命令名稱
     * @param data   命令內容
     */
    this.sendCommand = (name, data) => {
      let socket = property.socket;
      if (socket) {
        socket.compress(true).emit(name, data);
      }
    };

    /**
     * 設定事件 (connect and disconnect event)
     * @param event {Object} 事件
     */
    this.setEvent = (event) => {
      property.event = event;
    };

    /**
     * 連線
     */
    this.connect = (event) => {
      let socket;
      let cmdList = property.cmdList;
      if (property.socket) {
        return false;
      }

      // socket = socketio.connect(property.host + property.roomName, {
      //   pingTimeout: 15000,
      //   pingInterval: 30000,
      //   secure: true,
      //   transports: [ 'websocket' ]
      // });

      socket = socketio(property.host + property.roomName, {
        transports: [ 'websocket' ]
      });
      let e = {};
      if (event) {
        property.event = event;
        e.connect = event.connect;
        e.disconnect = event.disconnect;
      } else if (property.event) {
        e.connect = property.event.connect;
        e.disconnect = property.event.disconnect;
      }

      property.socket = socket;

      //-- 註冊命令
      socket.on('connect', () => {
        property.isConnect = true;
        if (e.connect) {
          e.connect();
          e.connect = null;
        }
      });
      socket.on('disconnect', () => {
        property.isConnect = false;
        if (e.disconnect) {
          e.disconnect();
          e.disconnect = null;
        }
      });

      //--
      if (cmdList) {
        let nameList = Object.getOwnPropertyNames(cmdList);
        nameList.forEach((name) => {
          socket.on(name, cmdList[name]);
        });
      }

      return true;
    };

    /**
     * 斷線
     *
     */
    this.disconnect = () => {
      let socket = property.socket;
      if (socket) {
        socket.disconnect();
      }
    };

  }

  //// end
}

var client = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init,
  Network: Network
});

/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */
//import {CMD, RESULT, STATE} from 'src/client/lobby';


let CMD;
let RESULT;
let STATE;

/**
 * 網路命令
 */
class CommandList {

  static init (config) {
    CMD = config.CMD;
    RESULT = config.RESULT;
    STATE = config.STATE;
  }

  /**
   * 建立
   * @param eventMap {Object} 事件表
   *  @return {Object}
   */
  static create (property) {
    let lobbyBuf = property.lobbyBuffer;
    let gameBuf = property.gameBuffer;
    let eMap = null;
    let list;
    let mgr = {
      cmdList: null,
      gameProc: null,
      setEventMap (eventMap) {
        eMap = eventMap;
      }
    };
    list = ((property) => {
      let proc = {};
      let gameEvent = property.gameEvent;

      /**
       * 確認命令是否正確
       * @param cmdName  {String} 命令名稱
       * @param data {Object} 原始資料
       * @param buf  {Object} 暫存
       * @param cb   {Object} 回調物件
       * @returns {number} 傳回狀態
       */
      proc.checkData = (cmdName, data, buf, cb) => {
        console.log(cmdName);
        let state = STATE.OK;

        if (data.resultCode !== RESULT.OK) {
          console.log('command "' + cmdName + '" check data error ! result code : ' + data.resultCode);
          state = STATE.ERROR;

          // 錯誤處理
          if (cb && cb.error) {
            cb.error(data);
          }
        } else {
          if (cb && cb.handle) {
            cb.handle(data);
          }
        }

        return state;
      };

      /**
       * 處理遊戲資料
       */
      proc.gameProc = data => {
        let event = gameEvent[data.gid];

        //--
        if (event && event.recvGameData) {
          event.recvGameData(data.packet);
        } else {
          console.log('gameProc no found gameEvent : ' + data.gid);
        }
      };

      proc.broadcastProc = data => {
        let nameList = Object.getOwnPropertyNames(gameEvent);
        nameList.forEach(name => {
          let event = gameEvent[name];
          if (event && event.recvBroadcast) {
            event.recvBroadcast(data);
          }
        });
      };

      mgr.gameProc = proc.gameProc;

      //--
      return {

        /**
         * 連線
         */
        connect (data) {
          console.log(CMD.CONNECT);
          let event = eMap && eMap.connect;

          // 處理 callback
          if (event && event.handle) {
            event.handle(data);
          }
        },

        /**
         * 重新連線
         */
        reconnect (data) {
          console.log(CMD.RECONNECT);
          let event = eMap && eMap.reconnect;

          // 處理 callback
          if (event && event.handle) {
            event.handle(data);
          }
        },

        /**
         * 登入
         */
        login (data) {
          let event = eMap && eMap.login;
          if (!proc.checkData(CMD.LOGIN, data, lobbyBuf, event)) {
            return;
          }

          property.connectionToken = data.connectionToken;
        },

        /**
         * 重新登入
         */
        relogin (data) {
          let event = eMap && eMap.relogin;
          if (!proc.checkData(CMD.RELOGIN, data, lobbyBuf, event)) {
            return;
          }

          property.connectionToken = data.connectionToken;
        },

        /**
         * 進入遊戲
         */
        inGame (data) {
          let event = eMap && eMap.inGame;
          proc.checkData(CMD.IN_GAME, data, lobbyBuf, event);
        },

        /**
         * 離開遊戲
         */
        exitGame (data) {
          let event = eMap && eMap.exitGame;
          proc.checkData(CMD.EXIT_GAME, data, lobbyBuf, event);
        },

        /**
         * 遊戲命令
         */
        toGame (data) {
          let event = eMap && eMap.toGame;
          proc.checkData(CMD.TO_GAME, data, gameBuf, event);

          proc.gameProc(data);
        },

        /**
         * 廣播用
         */
        broadCastMsg (data) {
          let event = eMap && eMap.broadcast;
          if (event && event.handle) {
            event.handle(data);
          }
          proc.broadcastProc(data);
        },

        /**
         * net ping
         */
        ping (data) {
          let event = eMap && eMap.ping;
          if (event && event.handle) {
            event.handle(data);
          }
        },

        /**
         * net pong
         */
        pong (data) {
          let event = eMap && eMap.pong;
          if (event && event.handle) {
            event.handle(data);
          }
        },

        /**
         * 斷線錯誤訊息
         */
        disconnectMsg (data) {
          console.log(CMD.DISCONNECT_MSG);
          let event = eMap && eMap.disconnectMsg;
          if (event && event.handle) {
            event.handle(data);
          }
        },

        /**
         * 斷線
         */
        disconnect (data) {
          console.log(CMD.DISCONNECT);
          let event = eMap && eMap.disconnect;
          if (event && event.handle) {
            event.handle(data);
          }
        }
      };
    })(property);

    //--
    mgr.cmdList = list;
    property.commandManager = mgr;
  }
}

//import 'tween';
//let Ticker = createjs.Ticker;

let Ticker = null;

/**
 * 更新畫面用
 */
let objList = [];
let onceList = [];
let updateOnce = false;

/**
 * 增加 update 物件
 * @param obj {Object} 物件
 * @return {boolean} 是否加入成功
 */
function add (obj) {
  let state = false;
  if (obj && obj.update) {
    if (!Object.prototype.hasOwnProperty.call(obj, '__updateIndex')) {
      obj.__updateIndex = objList.length;
      objList.push(obj);
      state = true;
    } else {
      console.log('[updateManager] add error !');
    }
  }

  return state;
}

/**
 * 刪除 update 物件
 * @param obj {Object} 物件
 */
function remove (obj) {
  let idx;
  let length = objList.length;
  let tmp;
  if (typeof obj.__updateIndex === 'number') {
    idx = obj.__updateIndex;
    if (idx >= 0 && idx < length) {
      let lastIdx = length - 1;
      tmp = objList[lastIdx];
      objList[idx] = tmp;
      tmp.__updateIndex = idx;

      // remove
      objList.splice(lastIdx, 1);
    }

    delete obj.__updateIndex;
  }
}

/**
 * 執行一次
 * @param func
 * @param seconds
 * @returns {{currentTime: number, func: *}}
 */
function setTimeout (func, seconds) {
  let t = {
    currentTime: 0.0,
    func: func
  };
  t.update = (offsetTime) => {
    if (t.currentTime >= seconds) {
      remove(t);
      if (t.func) {
        t.func(t.currentTime);
      }
    }
    t.currentTime += offsetTime;
  };
  add(t);
  return t;
}

/**
 * 重複執行
 * @param func {Function}
 * @param seconds
 * @returns {{currentTime: number, func: Function}}
 */
function setInterval (func, seconds) {
  let t = {
    currentTime: 0.0,
    func: func
  };
  t.update = (offsetTime) => {
    t.currentTime += offsetTime;
    if (t.currentTime >= seconds) {
      if (t.func) {
        t.func(t.currentTime);
      }
      t.currentTime = 0.0;
    }
  };
  add(t);
  return t;
}

/**
 * 清除計時器
 * @param t
 */
function clearInterval (t) {
  remove(t);
}

/**
 * 執行一次(下一個 frame update 觸發)
 * @param obj
 * @returns {Promise}
 */
function once (obj) {
  if (obj && obj.update) {
    onceList.push(obj);
    updateOnce = true;
  }
}

/**
 * 重設 update
 */
function reset () {
  objList.forEach(obj => {
    delete obj.__updateIndex;
  });

  objList = [];
}

/**
 * 更新畫面
 * @param offsetTime {Number} 時間偏移量
 */
function update (offsetTime) {
  if (updateOnce) {
    onceList.forEach(obj => {
      obj.update(offsetTime);
      if (obj.pause) {
        obj.pause();
      }
    });
    onceList = [];
    updateOnce = false;
  }
  objList.forEach(obj => {
    obj.update(offsetTime);
  });
}

let lastTime = -1;

/**
 * 刷新遊戲畫面
 * @param time {Integer} 經過總時間
 */
function refresh (event)  {
  let currentTime = performance.now() * 0.001;
  let offsetTime;
  if (event.paused) {
    return;
  }

  //
  if (lastTime < 0) {
    offsetTime = 0.0;
    lastTime = currentTime;
  } else {
    offsetTime = currentTime - lastTime;
    lastTime = currentTime;
  }

  //  console.log('refresh offsetTime : ' + offsetTime);
  update(offsetTime);
}

//------------------------------------------------------
let isPlay = false;
let isInit = false;
function init$1 () {
  if (isInit) {
    return;
  }
  isInit = true;
  Ticker = globalThis.createjs.Ticker;
  Ticker.timingMode = Ticker.TIMEOUT;
  Ticker.interval = 1000 / 60;
  Ticker.addEventListener('tick', refresh);
  reset();
}

/**
 * play
 */
function play () {
  if (!isPlay) {
    isPlay = true;
    lastTime = -1;
    Ticker.paused = false;
  }
}

/**
 * pause
 */
function pause () {
  if (isPlay) {
    isPlay = false;
    Ticker.paused = true;
  }
}

var updateManager = /*#__PURE__*/Object.freeze({
  __proto__: null,
  add: add,
  remove: remove,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  once: once,
  reset: reset,
  init: init$1,
  play: play,
  pause: pause
});

/**
 * 命令
 */
const ERROR = 'error';                  // 錯誤
const CONNECT = 'connect';              // 連線
const RECONNECT = 'reconnect';          // 重新連線
const LOGIN = 'login';                  // 登入
const RELOGIN = 'relogin';              // 重新登入
const IN_GAME = 'inGame';               // 進入遊戲
const EXIT_GAME = 'exitGame';           // 離開遊戲
const TO_GAME = 'toGame';               // 遊戲命令
const BROADCAST = 'broadCastMsg';       // 廣播用
const DISCONNECT = 'disconnect';        // 斷線
const DISCONNECT_MSG = 'disconnectMsg'; // 斷線訊息

const CMD$1 = {
  ERROR,
  CONNECT,
  RECONNECT,
  LOGIN,
  RELOGIN,
  IN_GAME,
  EXIT_GAME,
  TO_GAME,
  BROADCAST,
  DISCONNECT_MSG,
  DISCONNECT
};

/**
 * result id 對照表
 */
const RESULT$1 = {
  ERROR: 0,
  OK: 1
};

/**
 * state id 對照表
 */
const STATE$1 = {
  SEND_LOCK: -3,
  CONNECT_TIMEOUT: -2,
  BUFFER_FULL: -1,
  ERROR: 0,
  OK: 1,
  LOGIN: 3,
  ROOM: 4,
  CONNECT: 2
};

/**
 * 大廳物件
 */
class Lobby extends Network {

  /**
   * 建立大廳
   * @param config 設定檔
   * @constructor
   */
  constructor (config, roomName) {
    let property = {
      gameEvent: {},
      sendEvent: {},
      commandManager: null,
      connectionToken: null,
      timer: null,
      login: null,
      game: {
        configMap: {},
        template: null
      },
      lobbyBuffer: {
        sendCommandList: [],
        token: null
      },
      gameBuffer: {
        sendCommandList: [],
        token: null
      }
    };
    let Loader = config.Loader;


    //--
    super(config, roomName);
    let self = this;

    CommandList.init({
      CMD: CMD$1,
      RESULT: RESULT$1,
      STATE: STATE$1
    });

    /***************************************************************/
    /**
     * 更新資料
     */
    function updateCommand () {
      let lobbyBuf = property.lobbyBuffer;
      let gameBuf = property.gameBuffer;
      let commandList = lobbyBuf.sendCommandList;
      let cmd;

      // 確認是否有 lobby 命令
      if (commandList.length > 0) {
        cmd = commandList.shift();
        self.sendLobbyCommand(cmd);
      }

      // 確認是否有 game 命令
      commandList = gameBuf.sendCommandList;
      if (commandList.length > 0) {
        cmd = commandList.shift();
        self.sendGameCommand(cmd);
      }
    }

    /***************************************************************/

    if (!property.timer) {
      property.timer = setInterval(updateCommand, 0.1);
    }

    //    property.timer = setInterval(updateCommand, 50);
    /***************************************************************/
    /**
     * 初始化
     * @param urlMap{Object} 下載物件
     * @param callback {Function} callback
     */
    this.init = (urlMap, callback) => {
      let gameTemplateNameMap = {};
      let loginName = 'login';
      let gameListName = 'gamelist';
      let loader = new Loader();

      //--
      CommandList.create(property);
      self.setCommandList(property.commandManager.cmdList);

      //--
      if (urlMap) {
        if (urlMap.gameTemplate) {
          let nameList = Object.getOwnPropertyNames(urlMap.gameTemplate);
          nameList.forEach(name => {
            loader.add(name, urlMap.gameTemplate[name]);
            gameTemplateNameMap[name] = true;
          });
        }
        if (urlMap.login) {
          loader.add(loginName, urlMap.login);
        }
        if (urlMap.gameList) {
          loader.add(gameListName, urlMap.gameList);
        }
        console.log('start get infomation');
        loader.load((loader, resource) => {
          console.log('check infomation');
          if (resource) {
            property.game.template = {};
            let nameList = Object.getOwnPropertyNames(gameTemplateNameMap);
            nameList.forEach(name => {
              if (resource[name]) {
                property.game.template[name] = resource[name].data;
              }
            });

            if (resource[loginName]) {
              property.login = JSON.parse(resource[loginName].data);
            }

            if (resource[gameListName]) {
              let infoList = JSON.parse(resource[gameListName].data);
              infoList.forEach((info) => {
                property.game.configMap[info.id] = info;
                console.log(info);
              });

            }
          }

          // 登入設定
          if (property.login && property.login.server && property.login.server.host) {
            console.log('host : ' + property.login.server.host);
            self.setHost(property.login.server.host);
          }

          if (callback) {
            callback({
              login: property.login
            });
          }
        });
      } else {
        if (callback) {
          callback({
            login: null
          });
        }
      }
    };

    /**
     * get game info
     */
    this.getGame = () => property.game;

    /**
     * 取得命令管理物件
     * @return {Object} 傳回管理物件
     */
    this.getCommandManager = () => property.commandManager;

    this.gameProc = (data) => {
      if (property.commandManager) {
        property.commandManager.gameProc(data);
      }
    };

    /**
     * 設定事件對照表
     * @param eventMap {Object} 事件對照表
     */
    this.setEventMap = eventMap => {
      if (property.commandManager) {
        console.log('setEventMap ' + eventMap);
        property.commandManager.setEventMap(eventMap);
      } else {
        console.log('setEventMap error');
      }
    };

    this.setSendEvent = sendEvent => {
      property.sendEvent.game = sendEvent.game;
    };

    /**
     * 登入
     * @param info {Object} 登入資訊
     */
    this.login = info => {
      let data = info;
      self.sendCommand(LOGIN, data);
    };

    /**
     * 重新登入
     */
    this.relogin = () => {
      let data = {
        connectionToken: property.connectionToken
      };

      self.sendCommand(RELOGIN, data);
    };

    /**
     * register game event
     * @param gameEvent {Object} 遊戲相關事件
     * @param id {String} 遊戲 ID
     */
    this.registerGameEvent = (gameEvent, id) => {
      console.log('registerGameEvent : ' + id);
      if (id) {
        property.gameEvent[id] = gameEvent;
      }
    };

    /**
     * unregister game event
     * @param id {String} 遊戲 ID
     */
    this.unregisterGameEvent = (id) => {
      console.log('unregisterGameEvent : ' + id);
      property.gameEvent[id] = null;
    };

    /**
     * 傳送大廳命令
     * @param name {String} 命令
     * @param data {Object} 資料
     * @return {Integer} 傳送狀態
     */
    this.setLobbyCommand = (name, data) => {
      let lobbyBuf = property.lobbyBuffer;
      lobbyBuf.sendCommandList.push({
        name: name,
        data: data
      });
      return STATE$1.OK;
    };

    /**
     * 傳送大廳命令
     * @param cmd {Object} 命令
     * @return {Integer} 傳送狀態
     */
    this.sendLobbyCommand = (cmd) => {

      //      cmd.data.token = property.lobbyBuffer.token;
      self.sendCommand(cmd.name, cmd.data);
    };

    /**
     * 傳送遊戲命令
     * @param packet {Object} 資料
     * @param gid {String}   代號
     * @return {Integer} 傳送狀態
     */
    this.setGameCommand = (packet, gid) => {
      let gameBuf = property.gameBuffer;
      gameBuf.sendCommandList.push({
        gid: gid,
        packet: packet
      });
      return  STATE$1.OK;
    };

    /**
     * 傳送遊戲命令
     * @param packet {Object} 資料
     * @param gid {String}   代號
     * @return {Integer} 傳送狀態
     */
    this.sendGameCommand = (cmd) => {
      let data = {
        gid: cmd.gid,
        packet: cmd.packet
      };
      console.log(cmd.gid + ' send command ');
      self.sendCommand(TO_GAME, data);
      if (property.sendEvent.game) {
        property.sendEvent.game(cmd.gid);
      }
    };
  }

  /**
   * 狀態定義
   * @returns {Object}
   */

  static get STATE () {
    return STATE$1;
  }

  /**
   * 命令定義
   * @returns {Object}
   */

  static get CMD () {
    return CMD$1;
  }

  /**
   * 結果定義
   * @returns {Object}
   */

  static get RESULT () {
    return RESULT$1;
  }
}

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

function debug (obj, PIXI) {

  let rect = obj.getBounds();
  let graphics = obj.graphics;
  if (!graphics) {
    let anchor = obj.anchor;
    graphics = new PIXI.Graphics();
    obj.graphics = graphics;
    obj.addChild(graphics);
    graphics.x = 0;
    graphics.y = 0;
    graphics.lineStyle(1, 0xFFFFFF, 1.0);
    graphics.beginFill(0x00ff00, 0.15);
    graphics.drawRect(-rect.width * anchor.x, -rect.height * anchor.y, rect.width, rect.height);
    graphics.endFill();
    console.log('rect : ' + JSON.stringify(rect));
  }
}

/**
 * 取得材質群組
 * @param textures {Object} 材質群組
 * @param groupName {String} 群組名稱
 * @return {Object} 群組
 */
function getTextureGroup (textures, groupName) {

  let group = textures;
  if (group) {
    let groupNameList = groupName && groupName.split('.');
    groupNameList && groupNameList.every((groupName) => {
      let child = group[groupName];
      if (child) {
        group = child;
        return true;
      } else {
        group = null;
        return false;
      }
    });

    if (group === textures) {
      group = null;
    }
  }

  return group;
}

function make (SuperClass) {
  return class Base extends SuperClass {
    constructor (args) {
      super(args, false);
      this.cloneIndex = 0;
    }
    clone () {
      this.cloneIndex += 1;
    }
    addToScene (layer) {
      layer.addChild(this);
    }

    removeFromScene () {
      if (this.parent) {
        this.parent.removeChild(this);
      }
    }
    reload () {
      let self = this;
      let textures = self._game.textures;
      let res = self.conf.resource;

      let group = getTextureGroup(textures, res.group);
      if (group) {
        self.texture = group[res.name] || PIXI.Texture.EMPTY;
      }
    }
  };
}

class BaseOld {
  constructor () {
    this.cloneIndex = 0;
  }

  clone () {
    this.cloneIndex += 1;
  }

  addToScene (layer) {
    layer.addChild(this);
  }

  removeFromScene () {
    let self = this;
    if (self.parent) {
      self.parent.removeChild(self);
    }
  }
}

var base = /*#__PURE__*/Object.freeze({
  __proto__: null,
  debug: debug,
  getTextureGroup: getTextureGroup,
  make: make,
  'default': BaseOld
});

const TYPE = 'animation';

let Animation = null;

function init$2 () {
  let PIXI = globalThis.PIXI;
  let AnimatedSprite = null;
  if (PIXI.AnimatedSprite) {
    AnimatedSprite = PIXI.AnimatedSprite;
  } else {
    AnimatedSprite = PIXI.extras.AnimatedSprite;
  }
  Animation = class Anim extends make(AnimatedSprite) {

    static get TYPE () {return TYPE;}

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info) {
      super(info.textures || [ PIXI.Texture.EMPTY ], false);
      let self = this;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE;
      self.name = info.name;
      self.objName = info.objName || null;
      self.isInScene = info.isInScene;

      if (info.pos)    {
        self.x = info.pos.x;
        self.y = info.pos.y;
      }

      if (info.anchor)    {
        self.anchor.x = info.anchor.x || 0.0;
        self.anchor.y = info.anchor.y || 0.0;
      }

      self.loop = info.loop;
      if (typeof info.speed === 'number') {
        self.animationSpeed = info.speed;
      }
    }

    /**
     * 拷貝
     * @return {Animation}
     */
    clone (game) {
      super.clone();
      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        loop: this.loop,
        speed: this.animationSpeed,
        pos: this.position,
        anchor: this.anchor,
        textures: this.textures
      };
      return new Animation(info);
    }
    removeFromScene () {
      super.removeFromScene();
      if (this._game) {
        this._game.removeUpdate(this);
      }
    }
    addToScene (layer) {
      layer.addChild(this);
      if (this.playing && this._game) {
        this._game.addUpdate(this);
      }
    }

    play () {
      if (this._game) {
        this._game.addUpdate(this);
      }
      super.play();
    }
    stop () {
      if (this._game) {
        this._game.removeUpdate(this);
      }
      super.stop();
    }
    update (offsetTime) {
      super.update(offsetTime * 60);
    }

    /**
     * reload
     */
    reload () {
      let textures = this._game.textures;
      let conf = this.conf;
      let res = this.conf.resource;

      let group = getTextureGroup(textures, res.group);
      if (group) {
        this.textures = group[res.name] || [ PIXI.Texture.EMPTY ];
      }
      if (conf.loop) {
        this.play();
      }
    }
  };

}

/**
 * 動畫
 */

const TYPE$1 = 'button';

let Button = null;

function init$3 () {
  let PIXI = globalThis.PIXI;
  Button = class B extends make(PIXI.Sprite) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () { return TYPE$1;}

    /**
     * constructor
     * @param info {Object} 相關資訊
     */
    constructor (info)  {
      super((info.texture && info.texture.leave) || PIXI.Texture.EMPTY);
      let self = this;
      self._game = info.game;
      self.type = TYPE$1;
      self.conf = info.conf;
      self.objName = info.objName || null;
      self.name = info.name;
      self.isInScene = info.isInScene;

      //--
      if (info.pos)    {
        self.x = info.pos.x;
        self.y = info.pos.y;
      }

      if (info.anchor)    {
        self.anchor.x = info.anchor.x || 0.0;
        self.anchor.y = info.anchor.y || 0.0;
      }
      self.scale.x = 1.0;

      self.buttonMode = true;
      self.interactive = true;

      let custom = {};
      self.custom = custom;
      custom.texture = info.texture || {
        enter: PIXI.Texture.EMPTY,
        leave: PIXI.Texture.EMPTY,
        press: PIXI.Texture.EMPTY,
        disable: PIXI.Texture.EMPTY
      };
      custom.isPress = false;
      custom.flagDrag = false;
      custom.canMove = false;
      custom.timer = null;
      custom.obj = null;

      // event
      self.touchstart = self.mousedown = data => {
        if (custom.flagDrag && custom.timer) {
          if (self.dragEvent)        {
            self.dragEvent.curTimes = self.dragEvent.times;
            if (self.dragEvent.reset) {
              self.dragEvent.reset();
            }
          }

          custom.timer.restart();
        }

        self.eventPress(data);
      };

      self.touchend = self.mouseup = data => {

        custom.canMove = false;
        if (custom.flagDrag && self.dragEvent) {
          if (self.dragEvent.reset) {
            self.dragEvent.reset();
          }
        }

        self.eventRelease(data);
      };

      self.mouseover = data => {

        if (custom.flagDrag && self.dragEvent) {
          if (self.dragEvent.reset) {
            self.dragEvent.reset();
          }
        }

        self.eventEnter(data);
      };

      self.mouseout = data => {

        custom.canMove = false;
        if (custom.flagDrag && self.dragEvent) {
          if (self.dragEvent.reset) {
            self.dragEvent.reset();
          }
        }

        self.eventLeave(data);
      };

      self.touchendoutside = self.mouseupoutside = data => {

        if (custom.flagDrag && self.dragEvent) {
          if (self.dragEvent.reset) {
            self.dragEvent.reset();
          }
        }

        self.eventLeave(data);
      };
    }

    /**
     * 拷貝
     * @return {Button}
     */
    clone (game)  {
      super.clone();

      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        pos: this.position,
        anchor: this.anchor,
        texture: this.custom.texture
      };
      return new Button(info);
    }

    /**
     * 設定材質
     * @param textures {object}
     */
    setTextures (textures)  {
      let texture = this.custom.texture;
      if (textures) {
        texture.enter = textures.enter || PIXI.Texture.EMPTY;
        texture.leave = textures.leave || PIXI.Texture.EMPTY;
        texture.press = textures.press || PIXI.Texture.EMPTY;
        texture.disable = textures.disable || PIXI.Texture.EMPTY;
      }

      this.update();
    }
    setTexture (textures) {
      this.setTextures(textures);
    }

    /**
     * 設定點擊事件
     * @param click {Function}
     * @param obj {Object}
     */
    setClick (click, obj)  {
      this.eventClick = click;
      this.obj = obj;
    }

    /**
     * 壓下
     * @param data {Object}
     */
    eventPress (/*data*/) {
      let self = this;
      let te = self.custom.texture;

      self.texture = te.press;
      self.custom.isPress = true;
    }

    /**
     * 放開
     * @param data {Object}
     */
    eventRelease (/*data*/) {
      let self = this;
      let te = self.custom.texture;
      if (self.custom.isPress) {
        self.texture = te.leave;

        if (typeof self.eventClick === 'function') {
          self.eventClick(self, self.obj);
        }
      } else {
        self.texture = te.leave;
      }

      self.custom.isPress = false;
    }

    /**
     * 進入指定範圍
     * @param data {Object}
     */
    eventEnter (/*data*/)  {
      let self = this;
      let te = self.custom.texture;
      if (self.custom.isPress) {
        self.texture = te.press;
      } else {
        self.texture = te.enter;
      }
    }

    /**
     * 離開指定範圍
     * @param data {Object}
     */
    eventLeave (/*data*/)  {
      let self = this;
      let te = self.custom.texture;

      self.texture = te.leave;
      self.custom.isPress = false;
    }

    /**
     * 啟動拖曳事件
     * @param dragEvent {Object}設定拖曳相關事件
     */
    setDragEnable (dragEvent)  {
      let self = this;
      let custom = self.custom;


      custom.flagDrag = true;
      self.mousemove = self.touchmove = event => {
        if (custom.canMove)      {
          custom.isPress = false;
          let pos = {
            x: parseInt(event.data.global.x),
            y: parseInt(event.data.global.y)
          };
          self.x = pos.x;
          self.y = pos.y;
        }
      };

      self.dragEvent = dragEvent;
      if (!self.dragEvent)    {
        self.dragEvent = {

        };
        self.dragEvent.times = 10;
      }
      self.dragEvent.curTimes = self.dragEvent.times;

    }

    /**
     * 關閉拖曳事件
     */
    setDragDisable ()  {
      let self = this;
      self.custom.flagDrag = false;
      self.mousemove = self.touchmove = null;
    }

    /**
     * 設定是否開啟
     * @param enable {Boolean} 是否開啟或關閉
     * @param update {Boolean} 是否立即更新
     */
    setEnable (enable, update)  {
      if (enable) {
        this.enable(update);
      } else {
        this.disable(update);
      }
    }

    /**
     * 開啟
     * @param update {Boolean} 是否立即更新
     */
    enable (update)  {
      this.interactive = true;
      let te = this.custom.texture;
      if (update) {
        this.texture = te.leave;
      }
    }

    isEnabled () {
      return this.interactive;
    }

    /**
     * 關閉
     * @param update {Boolean} 是否立即更新
     */
    disable (update)  {
      this.interactive = false;
      let te = this.custom.texture;
      if (update) {
        this.texture = te.disable;
      }
    }

    /**
     * 更新
     */
    update () {
      let te = this.custom.texture;
      if (this.interactive) {
        this.texture = te.leave;
      } else {
        this.texture = te.disable;
      }
    }

    /**
     * reload
     */
    reload () {
      let textures = this._game.textures;
      let res = this.conf.resource;

      let group = getTextureGroup(textures, res.group);
      if (group) {
        this.setTextures(group[res.name]);
      }
    }

  };
}

/**
 * 圖片按鈕
 */

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

//import * as sceneManager from 'src/scene/sceneManager';

const TYPE$2 = 'group';
let Group = null;

function init$4 (config) {
  let PIXI = globalThis.PIXI;
  let sceneManager = config.sceneManager;
  Group = class G extends make(PIXI.Container) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {
      return TYPE$2;
    }

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info) {
      super();
      let self = this;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$2;
      self.name = info.name;
      self.objName = info.objName || null;
      self.isInScene = info.isInScene;
      self.childList = [];

      if (info.pos) {
        self.x = info.pos.x || 0.0;
        self.y = info.pos.y || 0.0;
      }
      if (info.pivot) {
        self.pivot.x = info.pivot.x || 0.0;
        self.pivot.y = info.pivot.y || 0.0;
      }
    }

    /**
     * 拷貝
     * @return {Group}
     */
    clone (game) {
      super.clone();
      let childList = null;
      if (this.conf && this.conf.childList) {
        childList = this.conf.childList;
      }
      let info = {
        game: game || this._game,
        childList: childList,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        pivot: this.pivot,
        pos: this.position
      };
      return sceneManager.createGroup(info, this._game);
    }

    removeFromScene () {
      super.removeFromScene();
      this.stop();
    }

    /**
     * stop
     */
    stop () {
      this.childList.forEach(child => {
        if (child.stop) {
          child.stop();
        }
      });
    }
    reload () {
      console.log('reload');
      this.childList.forEach(child => {
        if (child.reload) {
          child.reload();
        }
      });
    }
  };
}

/**
 * 群組
 */

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

const TYPE$3 = 'image';
let Image = null;

function init$5 () {
  let PIXI = globalThis.PIXI;
  Image = class I extends make(PIXI.Sprite) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {return TYPE$3;}

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info) {
      super(info.texture || PIXI.Texture.EMPTY);
      let self = this;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$3;
      self.name = info.name;
      self.objName = info.objName;
      self.isInScene = info.isInScene;

      if (info.pos) {
        self.x = info.pos.x;
        self.y = info.pos.y;
      }
      if (info.anchor) {
        self.anchor.x = info.anchor.x || 0.0;
        self.anchor.y = info.anchor.y || 0.0;
      }
    }

    /**
     * 拷貝
     * @return {Image}
     */
    clone (game)  {
      super.clone();
      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        pos: this.position,
        anchor: this.anchor,
        alpha: this.alpha,
        texture: this.texture
      };
      return new Image(info);
    }
  };
}

/**
 * 圖片
 *
 */

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

const TYPE$4 = 'spine';

let Spine = null;

function init$6 () {
  let PIXI = globalThis.PIXI;
  Spine = class S extends make(PIXI.Container) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {
      return TYPE$4;
    }

    static getChild (spine, name) {
      let child = null;
      let slots = spine.spineData.slots;
      let idx = -1;
      slots.some((slot, index) => {
        if (slot.name === name) {
          idx = index;
          return true;
        }
        return false;
      });

      if (idx >= 0) {
        child = spine.children[idx];
        if (child && child.children[0]) {
          child = child.children[0];
        }
      }

      return child;
    }
    static getRect (obj, debug) {

      let rect = obj.getBounds();

      // debug
      if (debug) {
        let graphics = new PIXI.Graphics();
        obj.addChild(graphics);
        graphics.x = 0;
        graphics.y = 0;
        graphics.lineStyle(1, 0x0000FF, 0.75);
        graphics.beginFill(0x00ff0B, 0.15);
        graphics.drawRect(-rect.width * 0.5, -rect.height * 0.5, rect.width, rect.height);
        graphics.endFill();
        graphics.lineStyle(1, 0x000000);
        graphics.moveTo(0, 0);
        graphics.lineTo(rect.width, rect.height);
        graphics.moveTo(rect.width, 0);
        graphics.lineTo(0, rect.height);
      }
      console.log('rect : ' + JSON.stringify(rect));
      return rect;
    }


    /*
     static fixTargetPosition (config) {
     let offset = config.offset || { x: 0, y: 0 };
     let reference = config.reference;
     let target = config.target;

     let rect = reference.getLocalBounds();

     //    let targetRect = target.getLocalBounds();
     target.x = 0;//rect.width * 0.5 + offset.y;// + target.width * 0.5;
     target.y = 0;//rect.height * 0.5 + offset.y;// + target.height * 0.5;

     console.log(offset);
     console.log('    rect x:' + rect.x + ' y:' + rect.y + ' w:' + rect.width + ' h:' + rect.height);
     console.log('    target x:' +
     target.x + ' y:' + target.y + ' w:' + target.width + ' h:' + target.height);
     }
     */

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info) {
      super();
      let self = this;
      let spineDataGroup = info.spineDataGroup;
      let textureGroup = info.textureGroup;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$4;
      self.name = info.name;
      self.objName = info.objName || null;
      self.isInScene = info.isInScene;
      let custom = {};
      self.custom = custom;

      custom.childList = [];
      custom.spineAnimList = [];
      custom.group = {};
      custom.spineDataGroup = spineDataGroup;
      custom.textureGroup = textureGroup;
      custom.configList = info.configList || (info.conf && info.conf.configList);

      if (info.pos) {
        self.x = info.pos.x || 0.0;
        self.y = info.pos.y || 0.0;
      }
      if (!PIXI.spine) {
        return;
      }
      custom.configList.forEach((config, index) => {
        let spine;
        let sprite;
        let entry = null;
        let point;
        let rect;
        sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        spine = new PIXI.spine.Spine(spineDataGroup[config.dataName]);
        point = { x: 0, y: 0 };
        rect = spine.getLocalBounds();

        // spine.skeleton.setSkin(null);
        // spine.skeleton.setSkin('default');
        spine.skeleton.setToSetupPose();
        spine.autoUpdate = false;
        spine.state.timeScale = 0.0;
        spine.x = 0.01;
        spine.y = 0.01;

        spine.childMap = {};
        spine.getChild = (name) => {
          let child = spine.childMap[name];
          return child;
        };

        let slots = spine.spineData.slots;
        slots.forEach((slot, idx) => {
          let child = spine.children[idx];
          if (child && child.children) {
            child = child.children[0];
            spine.childMap[slot.name] = child;
          }
        });
        sprite.name = config.name;
        sprite.addChild(spine);
        custom.childList[index] = sprite;

        // anchor
        if (config.anchor) {
          spine.x = -spine.width * config.anchor.x + 0.01;
          spine.y = -spine.height * config.anchor.y + 0.01;
        }

        point.x = rect.x;
        point.y = rect.y;

        // fix position
        if (config.fixPosition) {
          let fixPosition = config.fixPosition;
          let offset = fixPosition.offset || { x: 0, y: 0 };
          let child = null;
          if (fixPosition.childName) {
            child = spine.getChild(fixPosition.childName);
          }

          if (!child) {
            child = spine.children[fixPosition.childIndex || 0].children[0];
          }
          rect = child.getBounds();
          spine.x = -rect.x + -rect.width * 0.5;
          spine.y = -rect.y + -rect.height * 0.5;
          point.x = spine.x + rect.x;
          point.y = spine.y + rect.y;
          spine.x = spine.x + offset.x;
          spine.y = spine.y + offset.y;
        }

        // debug message
        if (config.debug) {
          let graphics = new PIXI.Graphics();
          sprite.addChild(graphics);
          graphics.x = 0.0;
          graphics.y = 0.0;
          graphics.lineStyle(1, 0xFF0000, 0.9);
          graphics.beginFill(0xFF700B, 0.10);
          graphics.drawRect(spine.x + rect.x, spine.y + rect.y, rect.width, rect.height);
          graphics.endFill();
          graphics.lineStyle(0);
          graphics.beginFill(0x000000, 1);
          graphics.drawCircle(point.x, point.y, 3);
          graphics.endFill();
          graphics.beginFill(0xFFFFFF, 1);
          graphics.drawCircle(point.x, point.y, 1);
          graphics.endFill();
          spine.children.forEach(child => {
            let c = child.children[0];
            if (!c || !c.getBounds) {
              c = child;
            }
            if (c && c.getBounds) {
              let rect = c.getBounds();
              let graphics = new PIXI.Graphics();
              c.addChild(graphics);
              graphics.x = 0.0;
              graphics.y = 0.0;
              graphics.lineStyle(1, 0x00FF00, 0.75);
              graphics.beginFill(0x0BFF70, 0.15);
              graphics.drawRect(-rect.width * 0.5, -rect.height * 0.5, rect.width, rect.height);
              graphics.endFill();
              graphics.lineStyle(0);
              graphics.beginFill(0x000000, 1);
              graphics.drawCircle(0, 0, 3);
              graphics.endFill();
              graphics.beginFill(0xFFFFFF, 1);
              graphics.drawCircle(0, 0, 1);
              graphics.endFill();
            }
          });

        }

        // console.log('  spine x:' + spine.x + ' y:' + spine.y + ' w:' + spine.width + ' h:' + spine.height);
        // console.log('  rect x:' + rect.x + ' y:' + rect.y + ' w:' + rect.width + ' h:' + rect.height);

        // name
        if (config.name) {
          custom.group[config.name] = {
            sprite: sprite,
            spine: spine,
            entry: entry,
            animConfig: {
              animationName: config.animationName,
              timeScale: config.timeScale,
              loop: config.loop
            }
          };
        }

        //        self.addChild(sprite);
        custom.spineAnimList.push(spine);
      });

      //--
      custom.configList.forEach(config => {
        let spine = custom.group[config.name].spine;
        if (spine && config.mask) {
          let te = PIXI.Texture.EMPTY;
          if (textureGroup) {
            te = textureGroup[config.mask.name] || PIXI.Texture.EMPTY;
          }
          let mask = new PIXI.Sprite(te);
          let follow = spine;

          //        let spineRect = spine.getLocalBounds();
          //        let rect = spineRect;

          spine.mask = mask;
          if (config.mask.follow) {
            follow = custom.group[config.mask.follow];
          }

          if (follow) {
            let rect = follow.getLocalBounds();
            if (config.mask.local) {
              mask.x = rect.x;
              mask.y = rect.y;
            } else {
              mask.x = 0;
              mask.y = 0;
            }

            follow.addChild(mask);
          }

          //
          let fixPosition  = config.mask.fixPosition;
          if (fixPosition && follow) {
            console.log('    fixPosition ');
            let offset = fixPosition.offset || { x: 0, y: 0 };
            let child;
            if (fixPosition.childName) {
              child = follow.getChild(fixPosition.childName);
            }
            if (!child) {
              child = follow.children[fixPosition.childIndex || 0].children[0];
            }
            let rect = child.getBounds();

            /*          let lRect = child.getLocalBounds();*/
            let fRect = follow.getBounds();
            let flRect = follow.getLocalBounds();

            mask.x = flRect.x + (rect.x - fRect.x) + offset.y;
            mask.y = flRect.y + (rect.y - fRect.y) + offset.y;
          }

          // debug
          if (config.mask.debug) {
            let graphics = new PIXI.Graphics();
            let pos = { x: 0, y: 0 };
            if (follow) {
              pos.x = follow.x;
              pos.y = follow.y;
              follow.parent.addChild(graphics);
            }

            graphics.x = pos.x + mask.x;
            graphics.y = pos.y + mask.y;

            graphics.lineStyle(1, 0x0000FF, 0.75);
            graphics.beginFill(0xFF700B, 0.15);
            graphics.drawRect(0, 0, mask.width, mask.height);
            graphics.endFill();
            graphics.lineStyle(1, 0x000000);
            graphics.moveTo(0, 0);
            graphics.lineTo(mask.width, mask.height);
            graphics.moveTo(mask.width, 0);
            graphics.lineTo(0, mask.height);
          }

          // console.log('    spine x:' + spine.x + ' y:' + spine.y + ' w:' + spine.width + ' h:' + spine.height);
          // console.log('    rect x:' + rect.x + ' y:' + rect.y + ' w:' + rect.width + ' h:' + rect.height);
          // console.log('    mask x:' + mask.x + ' y:' + mask.y + ' w:' + mask.width + ' h:' + mask.height);
        }

        if (spine && config.maskList) {
          config.maskList.forEach(maskSet => {
            let follow;
            let target;
            let te = PIXI.Texture.EMPTY;
            if (textureGroup) {
              te = textureGroup[maskSet.name] || PIXI.Texture.EMPTY;
            }
            let mask = new PIXI.Sprite(te);
            let child = null;

            // 跟隨
            if (maskSet.followName) {
              child = spine.getChild(maskSet.followName);
            }
            if (!child) {
              child = spine.children[maskSet.follow] && spine.children[maskSet.follow].children[0];
            }
            follow = child;

            // 目標
            child = null;
            if (maskSet.targetName) {
              child = spine.getChild(maskSet.targetName);
            }
            if (!child) {
              child = spine.children[maskSet.target] && spine.children[maskSet.target].children[0];
            }
            target = child;

            if (target) {
              target.mask = mask;
            }

            if (follow) {
              mask.x = -follow.width / 2;
              mask.y = -follow.height / 2;
              follow.addChild(mask);
            }
          });
        }
      });
    }

    /**
     * 拷貝
     * @return {Spine}
     */
    clone (game) {
      super.clone();
      let custom = this.custom;

      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        textureGroup: custom.textureGroup,
        spineDataGroup: custom.spineDataGroup,
        configList: custom.configList,
        pos: this.position
      };
      return new Spine(info);
    }

    removeFromScene () {
      if (this.parent) {
        this.parent.removeChild(this);
      }
      this._game.removeUpdate(this);
    }

    getGroup (name) {
      return this.custom.group[name];
    }

    /**
     * 取得 spine 物件
     * @param name {String} 動畫物件名稱
     * @return {*}
     */
    getSpine (name) {
      let self = this;
      let group = self.custom.group[name];
      let spine;
      if (group) {
        spine = group.spine;
      }

      return spine;
    }
    getEntry (name) {
      let self = this;
      let group = self.custom.group[name];
      let entry;
      if (group) {
        entry = group.entry;
      }

      return entry;
    }

    /**
     * 取得動畫設定資訊
     * @param name {String} 動畫物件名稱
     * @return {*}
     */
    getAnimConfig (name) {
      let self = this;
      let group = self.custom.group[name];
      let animConfig;
      if (group) {
        animConfig = group.animConfig;
      }

      return animConfig;
    }

    /**
     * play
     */
    play (configList) {
      let self = this;
      let custom = self.custom;
      let spineAnimList = [];
      if (configList && Array.isArray(configList)) {
        custom.childList.forEach(child => {
          self.removeChild(child);
        });
        configList.forEach(config => {
          let group = custom.group[config.name];
          if (group) {
            let spine = group.spine;
            let sprite = group.sprite;
            let animConfig = group.animConfig;
            if (spine) {
              group.entry = spine.state.setAnimation(0, config.animationName || animConfig.animationName, config.loop);

              spine.update(0);
              spine.state.timeScale = config.timeScale || animConfig.timeScale;
              spineAnimList.push(spine);
            }
            self.addChild(sprite);
          }
        });
      } else {
        let nameList = Object.getOwnPropertyNames(custom.group);
        nameList.forEach(name => {
          let group = custom.group[name];
          if (group) {
            let spine = group.spine;
            let sprite = group.sprite;
            let animConfig = group.animConfig;
            if (spine) {
              group.entry = spine.state.setAnimation(0, animConfig.animationName, animConfig.loop);

              spine.update(0);
              spine.state.timeScale = animConfig.timeScale;
              spineAnimList.push(spine);
            }
            self.addChild(sprite);
          }
        });
      }

      custom.spineAnimList = spineAnimList;
      self._game.addUpdate(self);
    }

    /**
     * pause
     */
    pause () {
      let self = this;
      let custom = self.custom;
      let nameList = Object.getOwnPropertyNames(custom.group);
      nameList.forEach(name => {
        let group = custom.group[name];
        let spine = group.spine;

        if (spine) {
          spine.state.timeScale = 0.0;
        }
      });
    }

    /**
     * resume
     */
    resume () {
      let self = this;
      let custom = self.custom;
      let nameList = Object.getOwnPropertyNames(custom.group);
      nameList.forEach(name => {
        let group = custom.group[name];
        let spine = group.spine;
        let animConfig = group.animConfig;
        if (spine) {
          spine.state.timeScale = animConfig.timeScale;
        }
      });
    }

    /**
     * stop
     */
    stop (configList) {
      let self = this;
      let custom = self.custom;
      if (configList && Array.isArray(configList)) {
        configList.forEach(config => {
          let group = custom.group[config.name];
          let spine = group.spine;
          let animConfig = group.animConfig;
          animConfig.animationName = config.animationName || animConfig.animationName;
          if (spine) {
            spine.state.timeScale = 0.0;
          }
        });
      } else {
        let nameList = Object.getOwnPropertyNames(custom.group);
        nameList.forEach(name => {
          let group = custom.group[name];
          let spine = group.spine;

          if (spine) {
            spine.state.timeScale = 0.0;
          }
        });
        self._game.removeUpdate(self);
      }
    }

    /**
     * update
     */
    update (offsetTime) {
      this.custom.spineAnimList.forEach((spine) => {
        spine.update(offsetTime);
      });
    }

    /**
     * reload
     */
    reload () {
    }
  };
}

/**
 * spine
 */

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

const TYPE$5 = 'bone';
let factory = null;
let Bone = null;

function init$7 () {
  let PIXI = globalThis.PIXI;
  Bone = class Bones extends make(PIXI.Sprite) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {
      return TYPE$5;
    }

    static setFactory (f) {
      factory = f;
    }

    static getFactory () {
      return factory;
    }

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info) {
      super(PIXI.Texture.EMPTY);
      let self = this;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$5;
      self.name = info.name;
      self.objName = info.objName || null;
      self.resource = {};
      self.animation = { timeScale: 1.0 };
      self.isInScene = info.isInScene;
      self.isUpdate = false;
      if (info.animation) {
        self.animation.name = info.animation.name;
        self.animation.timeScale = info.animation.timeScale;
      }

      if (info.resource) {
        self.resource.name = info.resource.name;
      }

      //----
      if (info.pos) {
        self.x = info.pos.x || 0.0;
        self.y = info.pos.y || 0.0;
      }
      if (info.anchor) {
        self.anchor.x = info.anchor.x || 0.50;
        self.anchor.y = info.anchor.y || 0.50;
      }

      let armature = factory && factory.buildArmature(self.resource.name);
      if (armature) {
        let display = armature.display;
        display.scale.set(1.0, 1.0);
        self.addChild(display);
      } else {
        console.log('dragonBones factory buildArmature error ! ' + self.resource.name);
      }

      self.armature = armature;
      self.state = null;
    }

    /**
     * 拷貝
     * @return {Bone}
     */
    clone (game) {
      super.clone();
      let index = this.cloneIndex;
      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        resource: this.resource,
        animation: this.animation,
        name: this.name + '.clone.' + index,
        pos: this.sprite.position
      };
      return new Bone(info);
    }


    removeFromScene () {
      let self = this;
      if (self.parent) {
        self.parent.removeChild(self);
      }
      self.stop();
    }

    play (name) {
      let armature = this.armature;
      let animation = this.animation;
      if (armature) {
        animation.name = name || animation.name;
        this.state = armature.animation.play(animation.name);
        if (this.state) {
          this.state.timeScale = animation.timeScale;
        }

        if (!this.isUpdate) {
          this.isUpdate = true;
          this._game.addUpdate(this);
        }
      }
    }

    stop () {
      let armature = this.armature;
      if (armature) {
        if (this.isUpdate) {
          this.isUpdate = false;
          this._game.removeUpdate(this);
        }
      }
    }

    set timeScale (timeScale) {
      this.animation.timeScale = timeScale;
      if (this.state) {
        this.state.timeScale = timeScale;
      }
    }

    get timeScale () {
      return this.animation.timeScale;
    }
    update (offsetTime) {
      let armature = this.armature;
      if (armature) {
        armature.advanceTime(offsetTime);
      }
    }

    /**
     * reload
     */
    reload () {
    }
  };
}

/**
 * 群組
 */

//import * as sceneManager from 'src/scene/sceneManager';

const TYPE$6 = 'digit';

/**
 * 數字
 */
const NUM =
  {

    // 預設數字格式
    CHAR_MAP: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.' ],

    // 橫式直式
    DISPLAY:
    {
      TRANSVERSE: 1,  // 橫式
      STRAIGHT: 2  // 直式
    },

    // 對齊方式
    ALIGN_TYPE:
    {
      POS: 1,
      RECT: 2
    },

    // 數字固定或動態座標
    OFFSET_TYPE:
    {
      STATIC: 1,
      DYNAMIC: 2
    },

    // 水平對齊
    HORI_ALIGN:
    {
      LEFT: 1,
      CENTER: 2,
      RIGHT: 3
    },

    // 垂直對齊
    VERTI_ALIGN:
    {
      TOP: 1,
      CENTER: 2,
      BOTTOM: 3
    }
  };

let Digit = null;


function init$8 () {
  let PIXI = globalThis.PIXI;
  Digit = class D extends make(PIXI.Sprite) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {return TYPE$6;}

    /***
     * 取得
     * @return {string}
     */
    static get NUM () {return NUM;}


    constructor (info) {
      super(info.background || PIXI.Texture.EMPTY);
      let self = this;
      let te;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$6;
      self.name = info.name;
      self.objName = info.objName;
      self.isInScene = info.isInScene;

      let custom = {};
      let rect = {};
      let event = {};
      custom.rect = rect;
      custom.event = event;
      self.custom = custom;

      rect.pos = new PIXI.Point(0, 0);
      rect.anchor = new PIXI.Point(0.0, 0.0);
      rect.width = info.width || 64;
      rect.height = info.height || 16;
      if (info.rect) {
        if (info.rect.pos) {
          rect.x = info.rect.pos.x;
          rect.y = info.rect.pos.y;
        }

        if (info.rect.anchor) {
          rect.anchor.x = info.rect.anchor.x;
          rect.anchor.y = info.rect.anchor.y;
        }

        rect.width = info.rect.width || rect.width;
        rect.height = info.rect.height || rect.height;
      }

      //----
      custom.textureName = info.textureName || '';
      custom.numCounts = info.numCounts || 4;
      custom.charMap = info.charMap || NUM.CHAR_MAP;
      custom.shift = 1;
      if (typeof info.shift === 'number') {
        custom.shift = info.shift;
      }

      // 屬性設定
      custom.enable = false;
      custom.display = info.display || NUM.DISPLAY.TRANSVERSE;
      custom.alignType = info.alignType || NUM.ALIGN_TYPE.RECT;
      custom.offsetType = info.offsetType || NUM.OFFSET_TYPE.STATIC;
      custom.horiType = info.horiType || NUM.HORI_ALIGN.LEFT;
      custom.vertiType = info.vertiType || NUM.VERTI_ALIGN.TOP;
      custom.alpha = 1.0;
      custom.anchor = { x: 0, y: 0};
      if (info.anchor) {
        custom.anchor.x = info.anchor.x;
        custom.anchor.y = info.anchor.y;
      }
      custom.lastCnt = 0;
      custom.value = 0;
      custom.currentValue = 0;
      custom.targetValue = 0;
      custom.offsetValue = 0;
      custom.background = info.background || PIXI.Texture.EMPTY;
      custom.autoHide = info.autoHide;
      custom.useComma = info.useComma;
      custom.useMoney = info.useMoney;
      custom.useDash = info.useDash;

      if (typeof info.fixVal === 'number') {
        custom.fixVal = info.fixVal;
      } else {
        custom.fixVal = 0;
      }

      if (info.pos) {
        self.x = info.pos.x;
        self.y = info.pos.y;
      }

      if (info.pivot) {
        self.pivot.x = info.pivot.x;
        self.pivot.y = info.pivot.y;
      }

      // create an array to store the textures
      custom.numTe = {};
      custom.numSprite = [];

      //      let baseURL = sceneManager.getBaseURL();
      let i, name, texture, frame, sprite, ch, counts;
      counts = custom.charMap.length;
      for (i = 0; i < counts; i += 1) {
        ch = custom.charMap[i];
        name = custom.textureName + ch;
        custom.numTe[ch] =  PIXI.utils.TextureCache[name] || PIXI.Texture.EMPTY;//PIXI.Texture.fromFrame(name);
      }

      texture = custom.numTe[custom.charMap[0]];
      frame = texture.frame;
      custom.offset = info.offset || frame.width;
      custom.symbolOffset = -1;
      if (typeof info.symbolOffset === 'number') {
        custom.symbolOffset = info.symbolOffset;
      }

      counts = custom.numCounts;
      for (i = 0; i < counts; i += 1)    {
        te = new PIXI.Texture(texture.baseTexture, frame.clone());
        sprite = new PIXI.Sprite(te);
        sprite.anchor.x = custom.anchor.x;
        sprite.anchor.y = custom.anchor.y;
        custom.numSprite[i] = sprite;
      }

      self._eventUpdate = self._animChange;
    }

    /**
     * 複製
     * @return {Number}
     */
    clone (game) {
      super.clone();
      let custom = this.custom;

      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        pos: this.position,
        pivot: this.pivot,
        anchor: custom.anchor,
        rect: custom.rect,
        display: custom.display,
        alignType: custom.alignType,
        offsetType: custom.offsetType,
        horiType: custom.horiType,
        vertiType: custom.vertiType,
        textureName: custom.textureName,
        numCounts: custom.numCounts,
        charMap: custom.charMap,
        offset: custom.offset,
        symbolOffset: custom.symbolOffset,
        shift: custom.shift,
        background: custom.background,
        autoHide: custom.autoHide,
        fixVal: custom.fixVal,
        useComma: custom.useComma,
        useDash: custom.useDash,
        useMoney: custom.useMoney
      };
      return new Digit(info);
    }
    removeFromScene () {
      super.removeFromScene();
      this._game.removeUpdate(this);
    }

    /**
     * 橫向顯示
     */
    transverse () {
      this.setDisplay(NUM.DISPLAY.TRANSVERSE);
    }

    /**
     * 垂直顯示
     */
    straight () {
      this.setDisplay(NUM.DISPLAY.TRANSVERSE);
    }

    /**
     * 設定顯示方式
     * @param display {Object} 顯示方式
     */
    setDisplay (display) {
      if (display === NUM.DISPLAY.TRANSVERSE) {
        this.display = display;
      } else if (display === NUM.DISPLAY.STRAIGHT) {
        this.display = display;
      } else {
        console.log(this.name + ' "number" setDisplay error');
        return;
      }

      this.setAlign(this.horiType, this.vertiType);
    }

    /**
     * 設定背景
     * @param texture {PIXI.Texture} 材質
     */
    setBackground (texture) {
      this.texture = texture;
    }

    /**
     * 設定參考錨座標位置
     * @param anchor {PIXI.Point} 座標
     */
    setAnchor (anchor) {
      if (!anchor) {
        return;
      }
      let custom = this.custom;

      let i, a = custom.anchor, cnt = custom.numSprite.length;
      a.x = anchor.x;
      a.y = anchor.y;
      for (i = 0; i < cnt; i += 1) {
        a = custom.numSprite[i].anchor;
        a.x = anchor.x;
        a.y = anchor.y;
      }
    }

    /**
     * 對齊方式
     * @param horizontal {Object} 水平對齊方式
     * @par
     * am vertical {Object} 垂直對齊方式
     */
    setAlign (horizontal, vertical) {
      let custom = this.custom;
      custom.alignType = NUM.ALIGN_TYPE.RECT;
      let p = custom.rect.pos,
        position = {x: p.x, y: p.y},
        a = custom.anchor,
        w = custom.rect.width,
        h = custom.rect.height,
        offset = custom.offset;
      let rect = {
        w: 0,
        h: 0
      };
      let children = this.children;
      let i,
        cnt = children.length;
      if (custom.lastCnt === cnt && custom.horiType === horizontal && custom.vertiType === vertical) {
        return;
      }
      custom.lastCnt = cnt;
      custom.horiType = horizontal;
      custom.vertiType = vertical;
      let prevFrame;


      children.forEach(sprite => {
        let frame = sprite.texture.frame;
        if (sprite.ch === '.' || sprite.ch === ',') {
          rect.w -= offset;
          rect.h -= offset;
          if (prevFrame) {
            rect.w += prevFrame.width;
            rect.h += prevFrame.height;
          }

          //          console.log(frame);
          rect.w += frame.width;
          rect.h += frame.height;
          rect.w += custom.symbolOffset * 2;
        } else {
          rect.w += offset;
          rect.h += offset;
        }
        prevFrame = frame;
      });

      switch (custom.horiType) {
        case NUM.HORI_ALIGN.LEFT:
          if (custom.display === NUM.DISPLAY.TRANSVERSE) {
            position.x = p.x;
          } else {
            position.x = p.x;
          }

          break;
        case NUM.HORI_ALIGN.CENTER:
          if (custom.display === NUM.DISPLAY.TRANSVERSE) {
            position.x = p.x + w * 0.5 - rect.w * 0.5;
          } else {
            position.x = p.x + w * 0.5;
          }

          break;
        case NUM.HORI_ALIGN.RIGHT:
          if (custom.display === NUM.DISPLAY.TRANSVERSE) {
            position.x = p.x + w - rect.w;
          } else {
            position.x = p.x + w;
          }

          break;
      }

      switch (custom.vertiType) {
        case NUM.VERTI_ALIGN.TOP:
          position.y = p.y;
          break;
        case NUM.VERTI_ALIGN.CENTER:
          if (custom.display === NUM.DISPLAY.TRANSVERSE) {
            position.y = p.y + h * 0.5;
          } else {
            position.y = p.y + h * 0.5 - rect.h * 0.5;
          }

          break;
        case NUM.VERTI_ALIGN.BOTTOM:
          if (custom.display === NUM.DISPLAY.TRANSVERSE) {
            position.y = p.y + h;
          } else {
            position.y = p.y + h - rect.h;
          }
          break;
      }
      let baseValue = 0;
      let lastFrame = {width: 0, height: 0};
      for (i = cnt - 1; i >= 0; i -= 1) {
        let sprite = children[i];
        let pos = sprite.position;
        let frame = sprite.texture.frame;
        if (custom.display === NUM.DISPLAY.TRANSVERSE) {
          pos.x = baseValue + position.x;
          pos.y = position.y;
        } else {
          pos.y = baseValue + position.y;
          pos.x = position.x;
        }
        if (sprite.ch === '.' || sprite.ch === ',') {
          if (custom.display === NUM.DISPLAY.TRANSVERSE) {
            baseValue -= offset;
            baseValue += lastFrame.width;
            pos.x = baseValue + position.x - (lastFrame.width * a.x) + (frame.width * a.x);
            baseValue += frame.width + custom.symbolOffset * 2;
            pos.x += custom.symbolOffset;
          } else {
            baseValue += frame.height;
          }

          //          base.debug(sprite);
        } else {
          baseValue += offset;
        }

        //        debug(sprite);
        prevFrame = frame;
        lastFrame = frame;
      }
    }

    /**
     * 設定透明度
     * @param alpha {Float} 範圍 0.00 - 1.00
     */
    setAlpha (value) {
      this.children.forEach(child => {
        child.alpha = value;
      });

      this.custom.alpha = value;
    }

    set shift (value) {
      this.custom.shift = value;
    }
    get shift () {
      return this.custom.shift;
    }

    set fixVal (value) {
      this.custom.fixVal = value;
    }
    get fixVal () {
      return this.custom.fixVal;
    }

    /**
     * @return {Integer}
     */
    getValue () {
      return this.custom.value;
    }

    /**
     * 設定數值
     * @param value {Integer} 數值
     * @param immediate {Boolean} 是否即時顯示
     */
    setValue (value, immediate) {
      let self = this;
      let custom = self.custom;
      let event = custom.event;
      custom.currentValue = custom.value;
      custom.value = value || 0;
      custom.targetValue = value || 0;
      if (custom.currentValue < custom.targetValue) {
        custom.offsetValue = custom.shift;
      } else if (custom.currentValue > custom.targetValue) {
        custom.offsetValue = -custom.shift;
      }
      if (event.begin) {
        event.begin(self);
      }

      //----
      if (immediate) {
        self.enable();
        return;
      } else {
        custom.currentValue = custom.value;
      }

      //----
      let group = self;
      let str = self.fixValueString(custom.currentValue);
      let te, ch, cnts = str.length, alpha = custom.alpha,
        nums = custom.numSprite.length - 1;
      let frameZero = custom.numTe['0'].frame;

      while (nums >= 0) {
        cnts = cnts - 1;
        let sprite = custom.numSprite[nums];
        if (cnts >= 0) {
          ch = str[cnts];
          te = custom.numTe[ch];
          sprite.ch = ch;
          sprite.alpha = alpha;
          if (te) {
            if (sprite.texture.width > 1 && sprite.texture.height > 1) {
              sprite.texture.frame = te.frame.clone();
            }
          }
          group.addChild(sprite);
        } else {
          sprite.ch = '0';
          if (custom.autoHide) {
            group.removeChild(sprite);
          } else {
            if (sprite.texture.width > 1 && sprite.texture.height > 1) {
              sprite.texture.frame = frameZero.clone();
            }
            sprite.alpha = alpha;
            group.addChild(sprite);
          }
        }
        nums = nums - 1;
      }
      self.setAlign(custom.horiType, custom.vertiType);
    }

    setEvent (event) {
      let custom = this.custom;
      let e = custom.event;
      e.begin = event.begin || e.begin;
      e.end = event.end || e.end;
      e.changeString = event.changeString || e.changeString;
    }

    /**
     * 動畫
     */
    _animChange (offsetTime) {
      let self = this;
      let custom = self.custom;
      let event = custom.event;
      let offsetValue = custom.offsetValue * offsetTime * 1000;
      if (offsetValue < 0) {
        if (custom.currentValue <= custom.targetValue) {
          custom.currentValue = custom.targetValue;
          self.disable();
          if (event.end) {
            event.end(self);
          }
        } else {
          custom.currentValue = custom.currentValue + offsetValue;
        }
      } else {
        if (custom.currentValue >= custom.targetValue) {
          custom.currentValue = custom.targetValue;
          self.disable();
          if (event.end) {
            event.end(self);
          }
        } else {
          custom.currentValue = custom.currentValue + offsetValue;
        }
      }

      let  group = self;
      let str = self.fixValueString(custom.currentValue);
      let ch, te, alpha = custom.alpha, cnts = str.length, nums = custom.numSprite.length - 1;

      let frameZero = custom.numTe['0'].frame;

      //--
      while (nums >= 0) {
        cnts = cnts - 1;
        let sprite = custom.numSprite[nums];
        if (cnts >= 0) {
          ch = str[cnts];
          te = custom.numTe[ch];
          sprite.ch = ch;
          sprite.alpha = alpha;
          if (te) {
            if (sprite.texture.width > 1 && sprite.texture.height > 1) {
              sprite.texture.frame = te.frame.clone();
            }
          }
          group.addChild(sprite);
        } else {
          sprite.ch = '0';
          if (custom.autoHide) {
            group.removeChild(sprite);
          } else {
            if (sprite.texture.width > 1 && sprite.texture.height > 1) {
              sprite.texture.frame = frameZero.clone();
            }
            sprite.alpha = alpha;
            group.addChild(sprite);
          }
        }
        nums = nums - 1;
      }
      self.setAlign(custom.horiType, custom.vertiType);
    }

    /**
     *
     * fix number string
     * @param value {Integer} 修正
     * @return {string} 修正後字串
     */
    fixValueString (value) {
      let custom = this.custom;
      let event = custom.event;
      let buf = value.toString();
      let pos = buf.lastIndexOf('.');
      if (pos < 0 && custom.fixVal > 0) {
        buf += '.';
        pos = buf.length;
      } else if (pos >= 0 && custom.fixVal === 0) {
        pos = buf.lastIndexOf('.');
        buf = buf.substr(0, pos);
        pos = buf.length;
      }
      for (let i = pos + 1; i <= pos + custom.fixVal; i += 1) {
        if (i >= buf.length) {
          buf = buf.concat('0');
        }
      }
      let str = buf;
      if (custom.fixVal > 0) {
        if (buf.length > pos + custom.fixVal) {
          str = buf.substr(0, pos + custom.fixVal + 1);
        }
      }

      /*
      let currentValue = value * Math.pow(10, custom.fixVal);
      currentValue = parseInt(currentValue, 10) * Math.pow(0.1, custom.fixVal);//
      let str = currentValue.toFixed(custom.fixVal);
*/
      let returnString = null;
      let a, b, c, d;
      let len = str.length;

      let nValue = Math.floor(value);
      if (custom.fixVal > 0) {
        d = str.substr((len - (custom.fixVal + 1)), (custom.fixVal + 1));
        str = nValue.toString();
        len = str.length;
      }

      if (custom.useComma) {
        if (len > 6) {
          a = str.substr(0, (len - 6));
          b = str.substr((len - 6), 3);
          c = str.substr((len - 3), 3);
          returnString = a + ',' + b + ',' + c;
        } else if (len > 3) {
          a = str.substr(0, (len - 3));
          b = str.substr((len - 3), 3);
          returnString = a + ',' + b;
        } else {
          returnString = str;
        }

      } else {
        returnString = str;
      }

      if (custom.useMoney) {
        returnString = '$' + returnString;
      }

      if (custom.useDash && custom.fixVal === 0) {
        returnString = returnString + '_';
      }

      if (custom.fixVal > 0) {
        returnString = returnString + d;
      }
      if (event.changeString) {
        returnString = event.changeString(returnString);
      }
      return returnString;
    }

    /**
     * setTexture
     * @param strName {String} 材質名稱
     */
    setTexture (strName) {
      this.setTextures(strName);
    }

    /**
     * setTextures
     * @param strName {String} 材質名稱
     */
    setTextures (strName) {
      console.log('setTextures : ' + strName);
      let self = this;
      let custom = self.custom;
      if (custom.textureName !== strName) {
        custom.textureName = strName;

        // create an array to store the textures
        let i, name, texture, ch, counts;
        for (i = 0, counts = custom.charMap.length; i < counts; i++) {
          ch = custom.charMap[i];
          name = custom.textureName + ch;
          custom.numTe[ch] = PIXI.utils.TextureCache[name] || PIXI.Texture.EMPTY;//PIXI.Texture.fromFrame(name);
        }

        texture = custom.numTe[custom.charMap[0]];
        for (i = 0, counts = custom.numCounts; i < counts; i++) {
          let sprite = custom.numSprite[i];
          sprite.texture = new PIXI.Texture(texture.baseTexture, texture.frame.clone());
          sprite.anchor.x = custom.anchor.x;
          sprite.anchor.y = custom.anchor.y;
        }
      }
      custom.lastCnt = 0;
      self.setValue(self.custom.currentValue, false);
    }

    /**
     * 使用 update 作為更新畫面用
     */
    enable () {
      let self = this;
      let custom = self.custom;
      if (!custom.enable) {
        custom.enable = true;
        self._game.addUpdate(self);
      }
    }

    /**
     * 不使用 update 作為更新畫面用
     */
    disable () {
      let self = this;
      let custom = self.custom;
      if (custom.enable) {
        custom.enable = false;
        self._game.removeUpdate(self);
      }
    }

    /**
     * stop
     */
    stop () {
      this.disable();
    }

    /**
     * 更新
     * @param offsetTime {Number} 時間偏移量
     */
    update (offsetTime)  {
      if (this._eventUpdate) {
        this._eventUpdate(offsetTime);
      }
    }

    /**
     * reload
     */
    reload () {
      let self = this;
      let textures = self._game.textures;
      let res = self.conf.resource;
      let custom = self.custom;
      custom.textureName = '';
      this.setTextures(res.texture);

      if (res.group) {
        let group = getTextureGroup(textures, res.group);
        if (group) {
          self.texture = group[res.background] || PIXI.Texture.EMPTY;
        }
      }
    }
  };
}

/**
 * 數字
 * @param info {Object} 相關資訊
 */

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

const TYPE$7 = 'scrollbar';

let Scrollbar = null;

function init$9 () {
  let PIXI = globalThis.PIXI;
  Scrollbar = class S extends make(PIXI.Sprite) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () { return TYPE$7;}

    constructor (info) {
      super(info.background || PIXI.Texture.EMPTY);
      let self = this;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$7;
      self.name = info.name;
      self.objName = info.objName;
      self.isInScene = info.isInScene;
      self.value = {
        current: 1,
        offset: 1,
        min: 1,
        max: 10,
        range: 9
      };
      self.value.range = self.value.max - self.value.min;
      self.eventScroll = null;

      //----
      self.slider = new PIXI.Sprite(info.slider);
      self.slider.anchor.x = 0.5;
      self.addChild(self.slider);
      if (info.pos)    {
        self.x = info.pos.x || 0.0;
        self.y = info.pos.y || 0.0;
      }

      if (info.anchor)    {
        self.anchor.x = info.anchor.x || 0.0;
        self.anchor.y = info.anchor.y || 0.0;
      }

      self.limit = {
        offset: 0,
        min: self.conf.slider.width * 0.5,
        max: self.conf.width - self.conf.slider.width * 0.5
      };
      self.limit.length = self.limit.max - self.limit.min;
      self.slider.x = self.limit.min;
      self.slider.value = 0;
      self.limit.offset = self.limit.length / self.value.range;

      // event
      self.hasMove = false;
      self.buttonMode = true;
      self.interactive = true;
      self.obj = null;
      self.touchstart = self.mousedown = event => {
        let pos = {
          x: parseInt(event.data.global.x),
          y: parseInt(event.data.global.y)
        };

        self.hasMove = true;
        self.slider.x = pos.x - self.x;
        if (self.slider.x < self.limit.min) {
          self.slider.x = self.limit.min;
        } else if (self.slider.x >= self.limit.max) {
          self.slider.x = self.limit.max;
        }

        self.slider.value = self.slider.x - self.limit.min;

        //-- check value
        self.value.current = self.value.min +
          self.value.offset * parseInt(self.slider.value / self.limit.offset);

        //--
        if (self.eventScroll) {
          self.eventScroll(self.value.current, self);
        }
      };

      self.touchend = self.mouseup = event => {
        let pos = {
          x: parseInt(event.data.global.x),
          y: parseInt(event.data.global.y)
        };
        console.log(pos);
        self.hasMove = false;
      };

      self.slider.buttonMode = true;
      self.slider.interactive = true;
      self.slider.mousedown = self.slider.touchstart = (/*event*/) => {
        self.hasMove = true;
      };

      self.slider.mouseup =
        self.slider.mouseupoutside =
          self.slider.touchend =
            self.slider.touchendoutside = (/*event*/) => {
              self.hasMove = false;
            };

      self.slider.mousemove = self.slider.touchmove = event => {
        if (event.which === 0) {
          self.hasMove = false;
        }

        if (self.hasMove) {
          let pos = {
            x: parseInt(event.data.global.x),
            y: parseInt(event.data.global.y)
          };
          self.slider.x = pos.x - self.x;
          if (self.slider.x < self.limit.min) {
            self.slider.x = self.limit.min;
          } else if (self.slider.x >= self.limit.max) {
            self.slider.x = self.limit.max;
          }

          self.slider.value = self.slider.x - self.limit.min;

          //-- check value
          self.value.current = self.value.min +
            self.value.offset * parseInt(self.slider.value / self.limit.offset);

          //--
          if (self.eventScroll) {
            self.eventScroll(self.value.current, self);
          }
        }
      };
    }

    /**
     * 拷貝
     * @return {Scrollbar}
     */
    clone () {
      return null;
    }

    /**
     * 設定綁定事件
     * @param event {Function}
     */
    setBindScrollEvent (event) {
      this.eventScroll = event;
    }

    /**
     * reset
     */
    reset () {
      this.hasMove = false;
    }

    /**
     * 範圍初始化
     * @param conf {Object}
     */
    setRange (conf)  {

      //--
      if (typeof conf.current === 'number') {
        this.value.current = conf.current;
      }

      //--
      if (typeof conf.offset === 'number') {
        this.value.offset = conf.offset;
      }

      //--
      if (typeof conf.min === 'number') {
        this.value.min = conf.min;
      }

      //--
      if (typeof conf.max === 'number') {
        this.value.max = conf.max;
      }

      //--
      if (typeof conf.range === 'number') {
        this.value.range = conf.range;
      }

      if (this.value.current < this.value.min) {
        this.value.current = this.value.min;
      } else if (this.value.current > this.value.max) {
        this.value.current = this.value.max;
      }

      this.value.offset = (this.value.max - this.value.min) / this.value.range;
      this.limit.offset = this.limit.length / this.value.range;
      this.slider.value = this.limit.offset * (this.value.current - this.value.min);
      this.slider.x = this.limit.min + this.slider.value;

      //--
      if (this.eventScroll) {
        this.eventScroll(this.value.current, this);
      }
    }

    /**
     * 更新
     */

    // update() {
    // }

    /**
     * 設定數值
     * @param value {Integer}
     */
    setValue (value) {
      if (value >= this.value.min && value <= this.value.max)    {

        this.value.current = value;
        this.slider.value = this.limit.offset *
          ((this.value.current - this.value.min) / this.value.range);
        this.slider.x = this.limit.min + this.slider.value;

        //--
        if (this.eventScroll) {
          this.eventScroll(this.value.current, this);
        }
      }
    }

    /**
     * 取得數值
     * @return {Integer} 傳回目前數值
     */
    getValue () {
      return this.value.current;
    }
  };

}

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

const TYPE$8 = 'text';

let Text = null;

function init$a () {
  let PIXI = globalThis.PIXI;
  Text = class T extends make(PIXI.Text)  {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {return TYPE$8;}

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info)  {
      super(info.text || 'test used');
      let self = this;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$8;
      self.name = info.name;
      self.objName = info.objName;
      self.isInScene = info.isInScene;

      let style = {

        /*font : 'bold italic 36px Arial',*/
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 0
      };
      if (info.style) {
        style.fill = info.style.fill || '#FFFFFF';
        style.stroke = info.style.stroke || '#000000';
        style.strokeThickness = info.style.strokeThickness || 0;
      }
      self.style = style;

      if (info.pos)    {
        self.x = info.pos.x;
        self.y = info.pos.y;
      }

      if (info.anchor)    {
        self.anchor.x = info.anchor.x || 0.0;
        self.anchor.y = info.anchor.y || 0.0;
      }
    }

    /**
     * 拷貝
     * @return {Text}
     */
    clone (game) {
      super.clone();
      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + this.cloneIndex,
        pos: this.position,
        anchor: this.anchor,
        style: this.style,
        text: this.text
      };
      return new Text(info);
    }

    /**
     * reload
     */
    reload () {
    }
  };

}

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

const TYPE$9 = 'particle';

let configMap = {
  demo: {
    alpha: {
      start: 1,
      end: 0
    },
    scale: {
      start: 0.1,
      end: 1.5
    },
    color: {
      start: 'ffffff',
      end: 'ffffff'
    },
    speed: {
      start: 600,
      end: 200
    },
    startRotation: {
      min: 0,
      max: 360
    },
    rotationSpeed: {
      min: 0,
      max: 20
    },
    lifetime: {
      min: 0.5,
      max: 0.7
    },
    blendMode: 'normal',
    frequency: 0.000016,
    emitterLifetime: -1,
    maxParticles: 100,
    pos: {
      x: 0,
      y: 0
    },
    addAtBack: false,
    spawnType: 'point'
  }
};
let Particle = null;

function init$b () {
  let PIXI = globalThis.PIXI;
  let ParticleContainer = null;
  if (PIXI.particles && PIXI.particles.ParticleContainer) {
    ParticleContainer = PIXI.particles.ParticleContainer;
  }
  if (!ParticleContainer) {
    return;
  }

  Particle = class P extends make(ParticleContainer) {

    /***
     * 取得物件類型
     * @return {string}
     */
    static get TYPE () {return TYPE$9;}

    static setConfigMap (conf) {
      configMap = conf || configMap;
    }
    static getConfig (name) {
      return configMap[name];
    }

    /**
     * constructor
     * @param info {Object}
     */
    constructor (info)  {
      super();
      let self = this;
      let custom = {};
      let emitter;

      self.custom = custom;
      self._game = info.game;
      self.conf = info.conf;
      self.type = TYPE$9;
      self.name = info.name;
      self.objName = info.objName;
      self.isInScene = info.isInScene;

      let setting = info.setting;
      custom.type = setting.type;
      custom.config = setting.config;
      custom.art = setting.art;
      custom.ownerPos = new PIXI.Point(0, 0);


      self.setProperties({
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
      });


      if (PIXI.particles && PIXI.particles.Emitter) {
        emitter = new PIXI.particles.Emitter(
          self,
          custom.art,
          custom.config
        );
      }
      if (emitter) {
        if (custom.type === 'path')      {
          emitter.particleConstructor = PIXI.particles.PathParticle;
        }    else if (custom.type === 'anim')      {
          emitter.particleConstructor = PIXI.particles.AnimatedParticle;
        }
      }

      //----
      if (info.pos) {
        self.x = info.pos.x;
        self.y = info.pos.y;
      }

      self.emitter = emitter;
    }

    /**
     * 拷貝
     * @return {Particle}
     */
    clone (game)  {
      super.clone();
      let index = this.cloneIndex;
      let custom = this.custom;
      let info = {
        game: game || this._game,
        conf: this.conf,
        isInScene: this.isInScene,
        name: this.name + '.clone.' + index,
        pos: this.position,
        setting: {
          type: custom.type,
          config: custom.config,
          art: custom.art
        }
      };
      return new Particle(info);
    }

    removeFromScene () {
      super.removeFromScene();
      this._game.removeUpdate(this);
    }

    /**
     * 播放
     * @param offsetTime
     */
    play (position, offsetTime = 0.0) {
      let self = this;
      let emitter = self.emitter;
      let pos = position || self.custom.ownerPos;
      if (emitter) {
        emitter.emit = true;
        emitter.resetPositionTracking();
        emitter.updateOwnerPos(pos.x, pos.y);
        emitter.update(offsetTime);
        self._game.addUpdate(self);
      }
    }

    /**
     * 停止
     * @param offsetTime
     */
    stop () {
      let self = this;
      self._game.removeUpdate(self);
    }

    /**
     * 更新
     * @param offsetTime {Number} 時間偏移量
     */
    update (offsetTime)  {
      this.emitter.update(offsetTime);
    }

    /**
     * reload
     */
    reload () {
    }
  };
}

/**
 * 粒子系統
 */

/**
 *
 *
 */

function filenameInfo (string) {
  let dir;
  let base;
  let ext;
  let name;
  let idx = string.lastIndexOf('/');
  if (idx > 0) {
    idx += 1;
    dir = string.slice(0, idx);
    base = string.slice(idx);
  }
  idx = base.lastIndexOf('.');
  if (idx > 0) {
    name = base.slice(0, idx);
    idx += 1;
    ext = base.slice(idx);
  }

  console.log(`     dir : ${dir}`);
  console.log(`    base : ${base}`);
  console.log(`    name : ${name}`);
  console.log(`     ext : ${ext}`);

  return {
    dir,
    base,
    name,
    ext
  };
}

function handleData (data, map, job) {

  let complete = null;
  if (job) {
    complete = job;
  } else {
    complete = (info) => {
      console.log(`info : ${info}`);
      return info;
    };
  }

  let completeArray = (info, list, create) => {
    info.forEach(info => {
      list.push(create(info));
    });
  };

  let completeObject = (info, obj, create) => {
    let names = Object.getOwnPropertyNames(info);
    let group;
    names.forEach(name => {
      let child = info[name];
      if (typeof child === 'string') {
        obj[name] = create(child);
      } else if (Array.isArray(child)) {
        group = [];
        completeArray(child, group, create);
        obj[name] = group;
      } else if (typeof child === 'object') {
        group = {};
        completeObject(child, group, create);
        obj[name] = group;
      }
    });
  };

  let names;
  names = Object.getOwnPropertyNames(data);
  names.forEach(name => {
    let info, group = map[name];
    info = data[name];
    if (Array.isArray(info)) {
      if (!group) {
        group = [];
        completeArray(info, group, complete);
        map[name] = group;
      } else        {
        completeArray(info, group, complete);
      }
    } else if (typeof info === 'object') {
      if (!group) {
        group = {};
        completeObject(info, group, complete);
        map[name] = group;
      } else        {
        completeObject(info, group, complete);
      }
    } else if (typeof info === 'string') {
      map[name] = complete(info);
    } else {
      console.log(' no found : ' + name);
    }
  });
}


var utils = {
  filenameInfo,
  handleData
};

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* globals Howl */
//let clock = null;
let dragon = null;
let baseLoader = null;
let jsyaml = null;

/**
 * 場景管理
 *
 */
/*
 * 設定檔
 */
const    ID_CREATE_CONFIG = 'config';

/*
 * 聲音
 */
const    ID_CREATE_SOUND = 'sound';

/*
 * 材質
 */
const ID_CREATE_TEXTURE = 'texture';

/*
 * 物件
 */
const ID_CREATE_OBJECT = 'object';

/*
 * ASSET
 */
const    ID_CREATE_ASSET = 'asset';

/*
 * SPINE 動畫
 */
const    ID_CREATE_SPINE = 'spine';

/*
 * dragonBones 動畫
 */
const    ID_CREATE_BONES = 'bones';

/*
 * 物件清單
 */
const  OBJ_TYPE = {
  INFO: 'info',       // 訊息
  GROUP: 'group',      // 群組
  SCROLLBAR: 'scrollbar',  // scrollbar
  BACKGROUND: 'background', // 背景
  PARTICLE: 'particle',   // 粒子
  TEXT: 'text',       // 文字
  IMAGE: 'image',      // 圖片
  SPINE: 'spine',      // spine 動畫
  BONE: 'bone',       // bones 動畫
  ANMIMATION: 'animation',  // 動畫
  NUMBER: 'number',     // 數字
  BUTTON: 'button'      // 按鈕
};

let property = {

  /** 場景相關事件 */
  event: {
    resBegin: null,
    resEnd: null,
    sceneResBegin: null,
    SceneResLoading: null,
    SceneResEnd: null
  },
  state: null,
  game: null,
  baseURL: '',
  base: 0,
  baseProgress: 0,
  baseIndex: 0,
  baseMax: 0,

  /** 物件工廠 */
  objectFactory: {},

  /** 是否正在建立場景 */
  isBusy: false,

  /** 材質清單存放位置 */
  textures: null,

  /** spine 清單存放位置 */
  spines: null,

  /** sound 清單存放位置 */
  sounds: null,

  /** bones 清單存放位置 */
  bonesFactory: null,

  /** 聲音對照表 */
  soundMapList: []
};

//====================================================


/**
 * 取得材質群組
 * @param groupName {String} 群組名稱
 * @return {Object} 群組
 */
let getTextureGroup$1 = getTextureGroup;

// let getTextureGroup = (groupName) => {
//   let group = property.textures;
//   if (group) {
//     let groupNameList = groupName && groupName.split('.');
//     groupNameList && groupNameList.every((groupName) => {
//       let subGroup = group[groupName];
//       if (subGroup) {
//         group = subGroup;
//         return true;
//       } else {
//         return false;
//       }
//     });

//     if (group === property.textures) {
//       group = null;
//     }
//   }

//   return group;
// };

/**
 * 取得 spine data 群組
 * @param groupName {String} 群組名稱
 * @return {Object} 群組
 */
let getSpineDataGroup = (groupName) => {
  let group = property.spines,
    groupNameList = groupName && groupName.split('.');
  if (group && groupNameList) {
    groupNameList.every((groupName) => {
      let subGroup = group[groupName];
      if (subGroup) {
        group = subGroup;
        return true;
      } else {
        return false;
      }
    });
  }

  return group;
};

/**
 * 建立物件 (資訊處理用)
 * @param info {Object}  物件資訊
 * @return {Object} 傳回物件資訊
 */
let createInfo = (info /*parent*/) => {
  let obj = {};
  obj.conf = info;
  obj.name = info.name;
  obj.objName = info.objName;
  return obj;
};

/**
 * 建立材質
 * @param name {String} 名稱
 * @param rect {Object} 範圍
 * @param color {Object} 顏色
 * @return {Object} 材質
 */
function createDebugTxeture (name, rect, color = '#000000') {
  console.log('createDebugTxeture : ' + name);
  return PIXI.Texture.Draw((canvas) => {

    //we are now in a 2D context
    if (rect) {
      canvas.width = rect.width || 140;
      canvas.height = rect.height || 40;
    } else {
      canvas.width = 100;
      canvas.height = 24;
    }

    let ctx = canvas.getContext('2d');  //get  canvas 2D context
    ctx.strokeStyle = color;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 2, 2);
    ctx.fillRect(canvas.width - 2, 0, 2, 2);
    ctx.fillRect(0, canvas.height - 2, 2, 2);
    ctx.fillRect(canvas.width - 2, canvas.height - 2, 2, 2);

    //--
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.fillRect(x, y, 2, 2);


    //        ctx.font = "24px";
    //        ctx.fillText("zxcvv",10,10);
  });
}

/**
 * 建立物件 (particle)
 * @param info {Object} particle 資訊
 * @return {Object} particle 物件
 */
let createParticle = (info, game) => {
  let particle = null;
  let groupName = info.resource.group,
    teName = info.resource.name,
    pos = info.pos || { x: 0, y: 0},
    group = getTextureGroup$1(property.textures, groupName);

  let art = group && group[teName];

  let config = Particle.getConfig(info.config.name);

  if (art && config) {

    if (info.debug) {
      let te = createDebugTxeture(info.name, info);
      if (!Array.isArray(art)) {
        art = [ art ];
      }
      art.push(te);
    }

    particle = new Particle({
      game: game,
      conf: info,
      name: info.name,
      objName: info.objName,
      isInScene: info.isInScene,
      setting: {
        type: info.type,
        config: config,
        art: art,
        useParticleContainer: info.useParticleContainer
      },
      pos: pos
    });
  }

  return particle;
};

/**
 * 建立物件 (spine)
 * @param info {Object} spine資訊
 * @return {Object} spine物件
 */
let createSpine = (info, game) => {
  let spine = null,
    pos = info.pos || { x: 0, y: 0 },
    spineDataGroup = getSpineDataGroup(info.resource.spineData),
    textureGroup = getTextureGroup$1(property.textures, info.resource.texture);

  //--
  if (spineDataGroup) {
    spine = new Spine({
      game: game,
      conf: info,
      name: info.name,
      objName: info.objName,
      isInScene: info.isInScene,
      spineDataGroup,
      textureGroup,
      pos
    });
  }
  return spine;
};

/**
 * 建立物件 (bone)
 * @param info {Object} bone資訊
 * @return {Object} bone物件
 */
let createBone = (info, game) => {
  let bone,
    pos = info.pos || { x: 0, y: 0 },
    resource = {},
    animation = { timeScale: 1.0 };

  //--
  if (!info.resource || (typeof info.resource.name !== 'string')) {
    console.log('createBone resource.name undefined !');
  } else {
    resource.name = info.resource.name;
  }

  if (info.animation) {
    animation.name = info.animation.name;
    animation.timeScale = info.animation.timeScale;
  }

  //--
  bone = new Bone({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    resource: resource,
    animation: animation,
    isInScene: info.isInScene,
    pos: pos
  });
  return bone;
};

/**
 * 建立物件 (群組)
 * @param info {Object} 群組資訊
// * @param parent {Object} 父物件
 * @return {Object} 群組物件
 */
let createGroup = (info, game) => {
  let group,
    pos = info.pos || { x: 0, y: 0 },
    objectFactory = property.objectFactory;

  group = new Group({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    pivot: info.pivot,
    pos: pos
  });

  //--
  if (info.childList) {
    info.childList.forEach(info => {
      let func = objectFactory[info.type];
      let child;
      if (func) {
        child = func(info, game);
        if (child) {
          if (info.isInScene && child) {
            group.addChild(child);
          }

          group.childList.push(child);
        }
      }
    });
  }

  return group;
};

/**
 * 建立物件 (文字)
 * @param info {Object} 文字資訊
 * @return {Object} 文字物件
 */
let createText = (info, game) => {
  let text,
    pos = info.pos || { x: 0, y: 0 },
    anchor = info.anchor || { x: 0.0, y: 0.0 };

  //--
  text = new Text({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    pos: pos,
    anchor: anchor,
    text: info.text || '文字訊息'
  });
  return text;
};

/**
 * 建立物件 (scrollbar)
 * @param info {Object} scrollbar資訊
 * @return {Object} scrollbar物件
 */
let createScrollbar = (info, game) => {
  let res = info.resource;
  let groupName = res.group;
  let group = getTextureGroup$1(property.textures, groupName);
  let scrollbar;
  let textureSlider = PIXI.Texture.EMPTY;
  let textureBackground = PIXI.Texture.EMPTY;

  if (info.debug) {
    textureBackground = createDebugTxeture(info.name, info);
  } else {
    if (group) {
      textureSlider = group[res.slider] || textureSlider;
      textureBackground = group[res.background] || textureBackground;
    }
  }

  scrollbar = new Scrollbar({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    pos: info.pos,
    anchor: info.anchor,
    slider: textureSlider,
    background: textureBackground
  });
  return scrollbar;
};

/**
 * 建立物件 (背景)
 * @param info {Object} 背景
 * @param parent {Object} 父物件
 * @return {Object} 背景
 */
let createBackground = (info, game) => {
  let groupName = info.resource.group,
    teName = info.resource.name,
    pos = info.pos || { x: 0, y: 0},
    anchor = info.anchor || { x: 0.0, y: 0.0 },
    group = getTextureGroup$1(property.textures, groupName),
    image;
  if (typeof teName === 'number') {
    if (teName < 0) {
      teName = 0;
    }
  }
  let te = (group && group[teName]) || PIXI.Texture.EMPTY;

  if (info.debug) {
    te = createDebugTxeture(info.name, info);
  }

  image = new Image({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    pos: pos,
    anchor: anchor,
    texture: te
  });
  return image;
};

/**
 * 建立物件 (圖片)
 * @param info {Object} 圖片
 * @return {Object} 圖片
 */
let createImage = (info, game) => {
  let groupName = info.resource.group,
    teName = info.resource.name,
    pos = info.pos || {x: 0, y: 0},
    anchor = info.anchor || {x: 0.0, y: 0.0},
    group = getTextureGroup$1(property.textures, groupName),
    blendMode = info.blend,
    image;

  //----
  if (typeof teName === 'number') {
    if (teName < 0) {
      teName = 0;
    }
  }
  let te = (group && group[teName]) || PIXI.Texture.EMPTY;

  if (typeof blendMode === 'number') {
    if (blendMode < 0) {
      blendMode = 0;
    }
  } else {
    blendMode = 0;
  }

  //--
  if (info.debug) {
    te = createDebugTxeture(info.name, info);
  }

  //--
  image = new Image({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    pos: pos,
    anchor: anchor,
    alpha: info.alpha || 1.0,
    texture: te
  });
  image.blendMode = blendMode;
  return image;
};

/**
 * 建立物件 (動畫)
 * @param info {Object} 動畫
 * @return {Object} 動畫
 */
let createAnimation = (info, game) => {
  let groupName = info.resource.group,
    teName = info.resource.name,
    pos = info.pos || { x: 0, y: 0 },
    anchor = info.anchor || { x: 0.0, y: 0.0 },
    speed = info.speed || 0.33,
    loop = info.loop,
    group = getTextureGroup$1(property.textures, groupName),
    anim;
  let teList = (group && group[teName]) || [ PIXI.Texture.EMPTY ];

  if (info.debug) {
    teList = [ createDebugTxeture(info.name, info) ];
  }

  anim = new Animation({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    speed: speed,
    loop: loop,
    pos: pos,
    anchor: anchor,
    textures: teList
  });
  return anim;
};

/**
 * 建立物件 (數字)
 * @param info {Object} 數字
 * @return {Object} 數字
 */
let createNumber = (info, game) => {
  let res = info.resource;
  let teName = info.resource.texture,
    group = getTextureGroup$1(property.textures, res.group),
    cnts = info.numCounts || 4,
    offset = info.offset,
    symbolOffset = info.symbolOffset,
    charMap = info.charMap,
    autoHide = info.autoHide,
    rect = {
      pos: {x: 0, y: 0},
      width: info.width,
      height: info.height
    },
    num;
  let background = (group && group[info.resource.background]) || PIXI.Texture.EMPTY;

  if (info.debug) {
    background = createDebugTxeture(info.name, info);
  }

  num = new Digit({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    autoHide: autoHide,
    fixVal: info.fixVal,
    useComma: info.useComma,
    useDash: info.useDash,
    useMoney: info.useMoney,
    pos: info.pos,
    anchor: info.anchor,
    pivot: info.pivot,
    rect: rect,
    textureName: teName,
    background: background,
    numCounts: cnts,
    charMap: charMap,
    symbolOffset: symbolOffset,
    offset: offset
  });

  return num;
};

/**
 * 建立物件 (按鈕)
 * @param info {Object} 按鈕
 * @return {Object} 按鈕
 */
let createButton = (info, game) => {
  let res = info.resource,
    groupName = res.group,
    teName = res.name,
    group = getTextureGroup$1(property.textures, groupName),
    teBtn,
    btn;
  let te = {
    enter: PIXI.Texture.EMPTY,
    press: PIXI.Texture.EMPTY,
    leave: PIXI.Texture.EMPTY,
    disable: PIXI.Texture.EMPTY
  };
  if (info.debug) {
    te.enter = createDebugTxeture(info.name, info);
    te.press = te.enter;
    te.leave = te.enter;
    te.disable = te.enter;
  } else {

    teBtn = group && group[teName];
    if (teBtn) {
      te.enter = teBtn[res.enter] || te.enter;
      te.press = teBtn[res.press] || te.press;
      te.leave = teBtn[res.leave] || te.leave;
      te.disable = teBtn[res.disable] || te.disable;
    }
  }

  btn = new Button({
    game: game,
    conf: info,
    name: info.name,
    objName: info.objName,
    isInScene: info.isInScene,
    pos: info.pos,
    anchor: info.anchor,
    texture: te
  });
  return btn;
};

/**
 * 初始化
 */
function init$c (conf) {
  property.objectFactory[OBJ_TYPE.INFO]         = createInfo;
  property.objectFactory[OBJ_TYPE.GROUP]        = createGroup;
  property.objectFactory[OBJ_TYPE.SCROLLBAR]    = createScrollbar;
  property.objectFactory[OBJ_TYPE.BACKGROUND]   = createBackground;
  property.objectFactory[OBJ_TYPE.TEXT]         = createText;
  property.objectFactory[OBJ_TYPE.IMAGE]        = createImage;
  property.objectFactory[OBJ_TYPE.ANMIMATION]   = createAnimation;
  property.objectFactory[OBJ_TYPE.NUMBER]       = createNumber;
  property.objectFactory[OBJ_TYPE.BUTTON]       = createButton;
  property.objectFactory[OBJ_TYPE.SPINE]        = createSpine;
  property.objectFactory[OBJ_TYPE.PARTICLE]     = createParticle;

  jsyaml = conf.jsyaml;
  baseLoader = conf.Loader;
  dragon = conf.dragon;

  if (dragon) {

    /*
    clock = dragon.dragonBones.WorldClock.clock;
    Bone.setClock(clock);
*/
    property.objectFactory[OBJ_TYPE.BONE]         = createBone;
  }
}

/**
 * 註冊物件
 */
function registerFactory (config) {
  property.objectFactory[config.type] = config.create;
}


/**
 * 讀取場景
 * @param config {Object} 場景設定檔
 * @return {boolean} 是否開始讀取
 */
function loadScene (config) {
  let e = property.event;
  let procFinish;
  let procData;
  if (property.isBusy) {
    return false;
  }

  property.isBusy = true;
  property.game = config.game;

  //----
  let filenameList = config.filename,
    procList = config.proc,
    callbackList = config.callback,
    finish = config.finish,
    rawDataList = [],
    currentIndex = 0;

  //----
  // 一筆原生資料處理完成後
  let procCallback = (data) => {
    let curCallback = callbackList[currentIndex];
    if (curCallback) {
      curCallback(data);
    }

    if (e.resEnd) {
      e.resEnd(currentIndex);
    }

    // if (currentIndex !== 0) {
    // }

    // 確認是否有下一筆
    currentIndex += 1;
    if (currentIndex < rawDataList.length)    {
      if (e.resBegin) {
        e.resBegin(currentIndex);
      }

      procData();
    } else {
      procFinish();
    }
  };

  // 完成所有原生資料處理
  procFinish = () => {
    property.isBusy = false;
    if (finish) {
      finish();
    }
  };

  //處理一筆原生資料成為可使用物件
  procData = () => {
    let curProc, rawData, data;
    curProc = procList[currentIndex];
    rawData = rawDataList[currentIndex];

    try {
      data = jsyaml.load(rawData);
      if (curProc) {
        property.baseIndex += 1;
        property.baseProgress = property.baseIndex / property.baseMax * 100;
        curProc(data, procCallback);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //----
  if (!Array.isArray(filenameList)) {
    console.log('error : filenameList');
    return false;
  }

  if (!Array.isArray(procList)) {
    console.log('error : procList');
    return false;
  }

  if (!Array.isArray(callbackList)) {
    console.log('error : callbackList');
    return false;
  }

  if (filenameList.length !== procList.length) {
    console.log('error : procList.length');
    return false;
  }

  //--
  function start () {
    currentIndex = 0;
    procData();
  }

  //--
  (function () {
    console.log('-------------------------------');
    if (e.sceneResBegin) {
      e.sceneResBegin(ID_CREATE_CONFIG);
    }

    property.baseIndex = 0;
    property.baseProgress = 0;
    property.baseMax = 1 + filenameList.length;
    property.baseProgress = property.baseIndex / property.baseMax * 100;
    property.base = 1 / property.baseMax;

    let loader = new baseLoader(property.baseURL, 50);
    filenameList.forEach((filename, index) => {
      loader.add(index.toString(), filename);
    });
    loader.onProgress.once(loader => {
      let currentProgress = loader.progress;
      if (currentProgress > 100) {
        currentProgress = 100;
      }

      let totalProgress = property.baseProgress + currentProgress * property.base;

      if (e.sceneResLoading) {
        e.sceneResLoading({
          currentProgress: currentProgress,
          currentLength: filenameList.length,
          totalProgress: totalProgress,
          state: property.state
        });
      }
    });

    loader.load((loader, resource) => {
      let names = Object.getOwnPropertyNames(resource);
      names.forEach((name) => {
        let idx = parseInt(name);
        rawDataList[idx] = resource[name].data;
      });
      if (e.sceneResEnd) {
        e.sceneResEnd(ID_CREATE_CONFIG);
      }

      start();
    });
  }());

  return true;
}

function loadSceneEx (config) {
  let e = property.event;
  let procFinish;
  let procData;
  if (property.isBusy) {
    return false;
  }

  property.isBusy = true;
  property.game = config.game;

  //----
  let objDataList = config.objData,
    procList = config.proc,
    callbackList = config.callback,
    finish = config.finish,
    currentIndex = 0;

  //----
  // 一筆原生資料處理完成後
  let procCallback = (data) => {
    let curCallback = callbackList[currentIndex];
    if (curCallback) {
      curCallback(data);
    }

    if (e.resEnd) {
      e.resEnd(currentIndex);
    }

    // 確認是否有下一筆
    currentIndex += 1;
    if (currentIndex < objDataList.length)    {
      if (e.resBegin) {
        e.resBegin(currentIndex);
      }

      procData(currentIndex);

    } else {
      procFinish();
    }
  };

  // 完成所有原生資料處理
  procFinish = () => {
    property.isBusy = false;
    if (finish) {
      finish();
    }
  };

  //處理一筆原生資料成為可使用物件
  procData = (index) => {
    let curProc, data;
    curProc = procList[index];
    data = objDataList[index];
    property.baseIndex = index;
    property.baseProgress = property.baseIndex / property.baseMax * 100;
    if (curProc && data) {
      curProc(data, procCallback);
    }
  };

  //----
  if (!Array.isArray(objDataList)) {
    return false;
  }

  if (!Array.isArray(procList)) {
    return false;
  }

  if (!Array.isArray(callbackList)) {
    return false;
  }

  if (objDataList.length !== procList.length) {
    return false;
  }

  //--
  function start () {
    currentIndex = 0;
    procData(currentIndex);
  }

  //--
  (function () {
    property.baseIndex = 0;
    property.baseProgress = 0;
    property.baseMax = objDataList.length;
    property.base = 1 / property.baseMax;

    start();
  }());

  return true;
}

/**
 * 設定事件
 * @param event {Object} 事件清單
 */
function setEvent (event)  {
  let e = property.event;
  if (event) {
    e.resBegin        = event.resBegin        || e.resBegin;
    e.resEnd          = event.resEnd          || e.resEnd;
    e.sceneResBegin   = event.sceneResBegin   || e.sceneResBegin;
    e.sceneResLoading = event.sceneResLoading || e.sceneResLoading;
    e.sceneResEnd     = event.sceneResEnd     || e.sceneResEnd;
  } else {
    e.resBegin        = null;
    e.resEnd          = null;
    e.sceneResBegin   = null;
    e.sceneResLoading = null;
    e.sceneResEnd     = null;
  }
}

/**
 * 設定
 * @param state
 */
function setState (state) {
  property.state = state;
}

/**
 * 建立原始資訊用
 * @param data {Object} 原始資訊
 * @param callback {Function} callback event
 */
function createRawData (data, callback) {
  if (typeof data.particle === 'object') {
    Particle.setConfigMap(data.particle);
  }

  callback(data);
}

/**
 * 建立 spine 動畫用
 * @param data {Object} 動畫資訊
 * @param callback {Function} callback event
 */
function createSpineData (data, callback) {
  let e = property.event;
  let currentLength = 0;
  let filenameMap = {};
  let eventCallback = callback;
  console.log('createSpineData');
  console.log(data);

  // spine progress
  let progress = (loader) => {
    let currentProgress = loader.progress;
    if (currentProgress > 100) {
      currentProgress = 100;
    }

    let totalProgress = property.baseProgress + currentProgress * property.base;

    let value = {
      currentProgress: currentProgress,
      totalProgress: totalProgress,
      state: property.state
    };
    console.log(JSON.stringify(value));
    if (e.sceneResLoading) {
      e.sceneResLoading(value);
    }
  };

  // spine 讀取完成
  let complete = (loader) => {
    let spines = {};
    if (!loader || !loader.resources) {
      eventCallback(spines);
      return;
    }

    let resource = loader.resources;

    let completeSpine = (info) => {
      console.log(info);
      let res = null;
      if (resource[info] && resource[info].spineData) {
        res = resource[info].spineData;
      } else {
        console.error('unknown spine data ');
      }
      return res;
    };

    let completeArray = (infoList, dataList, create) => {
      infoList.forEach(info => {
        dataList.push(create(info));
      });
    };

    let completeObject = (infoList, dataObjMap, create) => {
      let nameList = Object.getOwnPropertyNames(infoList);
      let child;
      nameList.forEach(name => {
        let info = infoList[name];
        if (typeof info === 'string') {

          // create object
          dataObjMap[name] = create(info);
        } else if (Array.isArray(info)) {

          // create array object
          child = [];
          completeArray(info, child, create);
          dataObjMap[name] = child;
        } else if (typeof info === 'object') {

          // create child object
          child = {};
          completeObject(info, child, create);
          dataObjMap[name] = child;
        } else {
          console.log(' no found : ' + name);
        }
      });
    };
    if (data && data.spines && data.atlas && data.spineDataMap) {
      completeObject(data.spineDataMap.spines, spines, completeSpine);
    } else if (data && data.spines) {
      completeObject(data.spines, spines, completeSpine);
    }

    if (e.sceneResEnd) {
      e.sceneResEnd(ID_CREATE_SPINE);
    }

    property.spines = spines;
    eventCallback(spines);
  };

  let procSpine = (info) => {
    filenameMap[info] = info;
  };

  let procArray = (infoList, create) => {
    infoList.forEach(info => {
      create(info);
    });
  };

  let procObject = (infoMap, create) => {

    let names = Object.getOwnPropertyNames(infoMap);
    names.forEach(name => {
      let info = infoMap[name];
      if (typeof info === 'string') {
        create(info);
      } else if (Array.isArray(info)) {
        procArray(info, create);
      } else if (typeof info === 'object') {
        procObject(info, create);
      }

    });
  };

  let proc = () => {
    console.log('-------------------------------');
    if (e.sceneResBegin) {
      e.sceneResBegin(ID_CREATE_SPINE);
    }
    let TextureAtlasReader = (function () {
      function TextureAtlasReader (text) {
        this.index = 0;
        this.lines = text.split(/\r\n|\r|\n/);
      }
      TextureAtlasReader.prototype.readLine = function () {
        if (this.index >= this.lines.length) {return null;}
        return this.lines[this.index++];
      };
      TextureAtlasReader.prototype.readValue = function () {
        var line = this.readLine();
        var colon = line.indexOf(':');
        if (colon === -1) {throw new Error('Invalid line: ' + line);}
        return line.substring(colon + 1).trim();
      };
      TextureAtlasReader.prototype.readTuple = function (tuple) {
        var line = this.readLine();
        var colon = line.indexOf(':');
        if (colon === -1) {throw new Error('Invalid line: ' + line);}
        var i = 0, lastMatch = colon + 1;
        for (; i < 3; i++) {
          var comma = line.indexOf(',', lastMatch);
          if (comma === -1) {break;}
          tuple[i] = line.substr(lastMatch, comma - lastMatch).trim();
          lastMatch = comma + 1;
        }
        tuple[i] = line.substring(lastMatch).trim();
        return i + 1;
      };
      return TextureAtlasReader;
    }());

    if (data && data.spines && data.atlas) {
      let resources = {};
      let filenameMap = {};
      let atlasMap = data.atlas;
      let names = Object.getOwnPropertyNames(atlasMap);
      console.log('========================');
      names.forEach(name => {
        let atlas = atlasMap[name];
        let info = utils.filenameInfo(name);
        if (!atlas) {
          return;
        }
        let reader = new TextureAtlasReader(atlas);
        let iterateParser = function () {
          let isImage = true;
          for (;;) {
            let line = reader.readLine();
            if (line === null) {
              return;
            }
            if (line.length === 0) {
              isImage = true;
              continue;
            } else if ((line.length <= 2) && (line.indexOf(' ') >= 0)) {
              isImage = true;
              continue;
            }
            if (isImage) {
              isImage = false;
              let filename = info.dir + line;
              console.log('filename : ', filename);
              filenameMap[filename] = 1;
            }
          }
        };
        iterateParser();
      });

      let filenames = Object.getOwnPropertyNames(filenameMap);
      let Loader = null;
      if (PIXI.Loader) {
        Loader = PIXI.Loader;
      } else {
        Loader = PIXI.loaders.Loader;
      }
      let loader = new Loader(property.baseURL, 50);
      loader.onProgress.add(progress);

      loader.add(filenames);

      loader.load((loader) => {
        console.log('[atlas texture] finish !!');

        names.forEach(name => {
          let atlas = atlasMap[name];
          let info = utils.filenameInfo(name);
          if (!atlas) {
            return;
          }

          let textureAtlas = new PIXI.spine.core.TextureAtlas(atlas, (line, callback) => {
            let filename = info.dir + line;
            let res = loader.resources[filename];
            let texture;
            if (res) {
              texture = res.texture;
            } else {
              texture = PIXI.Texture.EMPTY;
            }
            callback(texture.baseTexture);
          });

          let spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(textureAtlas);
          let spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);

          let filename = `${info.dir}${info.name}.json`;
          let json = data.spines[filename];
          console.log('spineData : ' + filename);
          if (json) {
            let spineData = spineJsonParser.readSkeletonData(json);
            resources[filename] = {
              spineData
            };
          }
        });

        complete({
          resources
        });
      });

    } else if (data && data.spines) {
      procObject(data.spines, procSpine);

      let names = Object.getOwnPropertyNames(filenameMap);
      currentLength = names.length;
      if (currentLength === 0) {
        complete();
      } else {
        let Loader = null;
        if (PIXI.Loader) {
          Loader = PIXI.Loader;
        } else {
          Loader = PIXI.loaders.Loader;
        }
        let loader = new Loader(property.baseURL, 50);
        names.forEach(name => {
          loader.add(name, name);
          console.log('load : ' + name);
        });
        loader.onProgress.add(progress);
        loader.load(complete);
      }
    } else {
      complete();
    }
  };

  proc();
}

/**
 * 建立 DragonBones 動畫用
 * @param data {Object} 動畫資訊
 * @param callback {Function} callback event
 */
function createBonesData (data, callback) {
  let e = property.event;

  let filenameMap = {};
  let eventCallback = callback;

  // 更新進度
  let progress = (loader) => {
    let progress = loader.progress;
    if (progress > 100) {
      progress = 100;
    }

    progress = property.baseProgress + progress * property.base;

    if (e.sceneResLoading) {
      e.sceneResLoading({
        current: progress,
        length: 100,
        state: property.state
      });
    }
  };

  // 讀取完成
  let complete = (loader) => {
    let factory = null;
    if (dragon) {
      factory = new dragon.dragonBones.PixiFactory();
    }

    if (!loader) {
      eventCallback(factory);
      return;
    }

    let resource = loader.resources;

    let completeBones = (info) => {
      console.log('completeBones : ' + info);
      let res = resource[info].data;
      if (factory) {
        factory.parseDragonBonesData(res);
      }
      return res;
    };

    let completeAtlas = (info) => {
      console.log('completeAtlas : ' + JSON.stringify(info));
      let res = resource[info.atlas] && resource[info.atlas].data;
      res = JSON.parse(res);
      if (factory) {
        let textures = getTextureGroup$1(property.textures, info.texture.group);
        let te = textures && textures[info.texture.name];
        if (te) {
          factory.parseTextureAtlasData(res, te);
        }
      }
      return res;
    };

    let completeArray = (infoList, dataList, create) => {
      infoList.forEach(info => {
        dataList.push(create(info));
      });
    };

    let dataList = [];
    completeArray(data.bones.data, dataList, completeBones);
    let resList = [];
    completeArray(data.bones.resource, resList, completeAtlas);

    if (e.sceneResEnd) {
      e.sceneResEnd(ID_CREATE_BONES);
    }

    property.bonesFactory = factory;
    Bone.setFactory(factory);
    eventCallback(factory);
  };

  let procBones = (info) => {
    filenameMap[info] = info;
  };

  let procAtlas = (info) => {
    filenameMap[info.atlas] = info.atlas;
  };

  let procArray = (infoList, create) => {
    infoList.forEach(info => {
      create(info);
    });
  };

  let procObject = (infoMap, create) => {

    let names = Object.getOwnPropertyNames(infoMap);
    names.forEach(name => {
      let info = infoMap[name];
      if (typeof info === 'string') {
        create(info);
      } else if (Array.isArray(info)) {
        procArray(info, create);
      } else if (typeof info === 'object') {
        procObject(info, create);
      }

    });
  };

  let proc = () => {
    console.log('-------------------------------');
    if (e.sceneResBegin) {
      e.sceneResBegin(ID_CREATE_BONES);
    }

    if (data && data.bones && data.bones.data) {
      procObject(data.bones.data, procBones);
      procArray(data.bones.resource, procAtlas);

      let names = Object.getOwnPropertyNames(filenameMap);
      if (names.length === 0) {
        complete();
      } else {
        let Loader = null;
        if (PIXI.Loader) {
          Loader = PIXI.Loader;
        } else {
          Loader = PIXI.loaders.Loader;
        }
        let loader = new Loader(property.baseURL, 50);
        names.forEach(name => {
          loader.add(name, name);
          console.log('load : ' + name);
        });
        loader.onProgress.add(progress);
        loader.load(complete);
      }
    } else {
      complete();
    }
  };

  proc();
}

/**
 * 建立物件用
 * @param data {Object} 物件資訊
 * @param callback {Function} callback event
 */
function createObject (data, callback) {
  let infoList = data.objects,
    objectFactory = property.objectFactory,
    obj,
    objList = [],
    index = 0,
    cnts = 0,
    e = property.event,
    nullTypeList = [];

  //--
  console.log('-------------------------------');
  if (e.sceneResBegin) {
    e.sceneResBegin(ID_CREATE_OBJECT);
  }

  //--
  cnts = infoList.length;
  infoList.forEach(info => {
    let func = objectFactory[info.type];
    if (func) {
      console.log('  create "' + info.type + '" name:"' + info.name + '" objName:"' + info.objName + '"');
      obj = func(info, property.game);
      if (obj) {
        objList.push(obj);
      } else {
        console.error('create object error !');
      }
    } else {
      nullTypeList.push(info);
    }

    //--
    index += 1;
    let currentProgress = index / cnts * 100;
    let totalProgress = property.baseProgress + currentProgress * property.base;

    let value = {
      currentProgress: currentProgress,
      totalProgress: totalProgress,
      state: property.state
    };

    if (e.sceneResLoading) {
      e.sceneResLoading(value);
    }
  });

  //--
  if (e.sceneResEnd) {
    e.sceneResEnd(ID_CREATE_OBJECT);
  }

  if (callback) {
    callback(objList, nullTypeList);
  }
}

/**
 * 建立材質
 * @param data {Object} 材質資訊
 * @param callback {Function} callback event
 * @return {Object} 傳回材質
 */
function createTexture (data, callback) {
  let textures = {},
    isEnd = false,
    filenameMap = {},
    e = property.event,
    ref = {};
  property.textures = null;
  let baseValue = 0;
  let value = {
    currentProgress: 0,
    totalProgress: property.baseProgress,
    state: property.state
  };
  console.log('[createTexture]');
  console.log(JSON.stringify(value));

  if (e.sceneResLoading) {
    e.sceneResLoading(value);
  }

  // progress
  let progress = (loader) => {

    let currentProgress = loader.progress;
    if (currentProgress > 100) {
      currentProgress = 100;
    }
    let totalProgress = 0;
    if (baseValue > 0) {
      totalProgress = baseValue * 100 + property.baseProgress + currentProgress * baseValue;
    } else {
      totalProgress = property.baseProgress + currentProgress * property.base;
    }

    let value = {
      currentProgress: currentProgress,
      totalProgress: totalProgress,
      state: property.state
    };

    if (e.sceneResLoading) {
      e.sceneResLoading(value);
    }
  };

  // 材質建立完成
  let complete = (loader) => {
    let resource = loader.resources;

    //    console.info(resource);

    // 建立材質名稱對照表
    let completeImage = (info) => {
      return resource[info].texture;

      // return PIXI.utils.TextureCache[property.baseURL + info];

      // let te = PIXI.Texture.from(property.baseURL + info, true);
      // te.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      // return te;
    };

    let completeArray = (infoList, teList, create) => {
      infoList.forEach(info => {
        teList.push(create(info));
      });
    };

    let completeObject = (infoList, images, create) => {
      let subNames = Object.getOwnPropertyNames(infoList), subImgs;
      subNames.forEach(name => {
        let info = infoList[name];
        if (typeof info === 'string') {
          images[name] = create(info);
        } else if (Array.isArray(info))        {
          subImgs = [];
          completeArray(info, subImgs, create);
          images[name] = subImgs;
        } else if (typeof info === 'object')        {
          subImgs = {};
          completeObject(info, subImgs, create);
          images[name] = subImgs;
        }
      });
    };

    let imageNames;
    imageNames = Object.getOwnPropertyNames(data.images);
    imageNames.forEach(name => {
      let info, images = textures[name];
      info = data.images[name];
      if (Array.isArray(info)) {
        if (!images) {
          images = [];
          completeArray(info, images, completeImage);
          textures[name] = images;
        } else {
          completeArray(info, images, completeImage);
        }
      } else if (typeof info === 'object') {
        if (!images) {
          images = {};
          completeObject(info, images, completeImage);
          textures[name] = images;
        } else {
          completeObject(info, images, completeImage);
        }
      } else if (typeof info === 'string') {
        textures[name] = completeImage(info);
      } else {
        console.log(' no found : ' + name);
      }

    });

    //----
    if (e.sceneResEnd) {
      e.sceneResEnd(ID_CREATE_TEXTURE);
    }

    property.textures = textures;
    if (callback) {
      callback(textures);
    }
  };

  // assetProgress
  let assetProgress = (loader) => {
    let currentProgress = loader.progress;
    if (currentProgress > 100) {
      currentProgress = 100;
    }
    let totalProgress = 0;
    if (baseValue > 0) {
      totalProgress = property.baseProgress + currentProgress * baseValue;
    } else {
      totalProgress = property.baseProgress + currentProgress * property.base;
    }

    let value = {
      currentProgress: currentProgress,
      totalProgress: totalProgress,
      state: property.state
    };

    if (e.sceneResLoading) {
      e.sceneResLoading(value);
    }
  };

  let proc = null;

  // asset 建立完成
  let assetJsonComplete = () => {
    if (e.sceneResEnd) {
      e.sceneResEnd(ID_CREATE_ASSET);
    }
    proc(data);
  };

  let assetImageComplete = (loader) => {
    let resources = loader.resources;
    let names = loader.assetNames;
    console.log(resources);
    let assets = data.assets;
    names.forEach(name => {
      let asset = assets[name];
      let texture = resources[asset.meta.filename].texture;

      if (texture && asset) {
        const spritesheet = new PIXI.Spritesheet(texture.baseTexture, asset);

        spritesheet.parse(() => {
          console.log(`Spritesheet : ${name}`);
          console.log(spritesheet);
        });
      }

      // for (let prop in frames) {
      //   let obj = frames[prop];
      //   console.log(obj);
      //   let frame = new PIXI.Rectangle(obj.frame.x, obj.frame.y, obj.frame.w, obj.frame.h);

      //   let te = new PIXI.Texture(texture.baseTexture,
      //     frame);

      //   console.log('texture info : ' + prop);
      //   console.log(te);
      //   PIXI.Texture.addToCache(te, prop);
      // }

    });


    if (e.sceneResEnd) {
      e.sceneResEnd(ID_CREATE_ASSET);
    }
    proc(data);
  };

  let procImage = (info) => {
    filenameMap[info] = info;
  };

  let procArray = (infoList, create) => {
    infoList.forEach(info => {
      create(info);
    });
  };

  let procObject = (infoList, create) => {
    if (!infoList) {
      return;
    }

    let subNames = Object.getOwnPropertyNames(infoList);
    subNames.forEach(name => {
      let info = infoList[name];
      if (typeof info === 'string') {
        create(info);
      } else if (Array.isArray(info)) {
        procArray(info, create);
      } else if (typeof info === 'object') {
        procObject(info, create);
      }
    });
  };

  let procFrame = (info) => {
    return PIXI.utils.TextureCache[info];

    //return PIXI.Texture.fromFrame(info);
  };

  let procFrameArray = (infoList, teList, create) => {
    infoList.forEach(info => {
      teList.push(create(info));
    });
  };

  let procFrameObject = (infoList, images, create) => {
    let subNames = Object.getOwnPropertyNames(infoList);
    subNames.forEach(name => {
      let info = infoList[name], subImgs = [];
      if (typeof info === 'string') {
        images[name] = create(info);
      } else if (Array.isArray(info)) {
        procFrameArray(info, subImgs, create);
        images[name] = subImgs;
      } else if (typeof info === 'object') {
        images[name] = subImgs;
        procFrameObject(info, subImgs, create);
      }
    });
  };

  proc = (data) => {
    let imageNames, filenames, frameNames;

    //---- 取得材質檔案清單
    if (data.images) {
      imageNames = Object.getOwnPropertyNames(data.images);
      imageNames.forEach(name => {
        let info;
        info = data.images[name];
        if (Array.isArray(info)) {
          procArray(info, procImage);
        } else if (typeof info === 'object') {
          procObject(info, procImage);
        } else if (typeof info === 'string') {
          procImage(info);
        } else        {
          console.log('  no found : ' + name);
        }

      });

      filenames = Object.getOwnPropertyNames(filenameMap);
      if (e.sceneResBegin) {
        e.sceneResBegin(ID_CREATE_TEXTURE);
      }
      let Loader = null;
      if (PIXI.Loader) {
        Loader = PIXI.Loader;
      } else {
        Loader = PIXI.loaders.Loader;
      }
      let loader = new Loader(property.baseURL, 50);
      filenames.forEach(filename => {
        loader.add(filename, filename);
      });
      loader.onProgress.add(progress);
      loader.load(complete);
    } else {
      isEnd = true;
    }

    //----建立 frame 名稱對照表
    if (data.frames)    {
      frameNames = Object.getOwnPropertyNames(data.frames);
      frameNames.forEach(name => {
        let info, frames = textures[name];
        info = data.frames[name];
        if (Array.isArray(info)) {
          if (!frames) {
            frames = [];
            procFrameArray(info, frames, procFrame);
            textures[name] = frames;
          } else {
            procFrameArray(info, frames, procFrame);
          }
        } else if (typeof info === 'object') {
          if (!frames) {
            frames = [];
            procFrameObject(info, frames, procFrame);
            textures[name] = frames;
          } else {
            procFrameObject(info, frames, procFrame);
          }
        } else if (typeof info === 'string') {
          textures[name] = procFrame(info);
        } else {
          console.log('  no found : ' + name);
        }
      });
    }

    //----
    if (isEnd) {
      property.textures = textures;
      if (callback) {
        callback(textures);
      }
    }
  };

  //----
  if (data && data.assets) {
    if (data.images) {
      baseValue = property.base * 0.5;
    }
    console.log('-------------------------------');
    let assets = data.assets;
    if (Array.isArray(assets)) {
      if (e.sceneResBegin) {
        e.sceneResBegin(ID_CREATE_ASSET);
      }

      //--
      let Loader = null;
      if (PIXI.Loader) {
        Loader = PIXI.Loader;
      } else {
        Loader = PIXI.loaders.Loader;
      }
      let loader = new Loader(property.baseURL, 50);
      assets.forEach(asset => {
        loader.add(asset);
      });
      loader.onProgress.add(assetProgress);
      loader.load(assetJsonComplete);
    } else if (typeof assets === 'object') {

      let Loader = null;
      if (PIXI.Loader) {
        Loader = PIXI.Loader;
      } else {
        Loader = PIXI.loaders.Loader;
      }
      let loader = new Loader(property.baseURL, 50);
      let names = Object.getOwnPropertyNames(assets);
      loader.assetNames = names;
      names.forEach(name => {
        let path;
        let filename;
        let ext;
        let idx = name.lastIndexOf('/');
        if (idx > 0) {
          idx += 1;
          path = name.slice(0, idx);
          filename = name.slice(idx);
        }
        idx = filename.lastIndexOf('.');
        if (idx > 0) {
          idx += 1;
          ext = filename.slice(idx);
        }
        let asset = assets[name];

        console.log(`    path : ${path}`);
        console.log(`filename : ${filename}`);
        console.log(`     ext : ${ext}`);

        filename = path + (asset.meta && asset.meta.image);
        asset.meta.filename = filename;

        loader.add(filename);
      });
      loader.onProgress.add(assetProgress);
      loader.load(assetImageComplete);
    }
  } else {
    proc(data);
    ref.textures = textures;
  }

  return ref;
}

/**
 * 設定材質群組
 * @param textures {Object} 材質清單
 */
function setTextures (textures) {
  property.textures = textures;
}
function setSpineData (spines) {
  property.spines = spines;
}

/**
 * 設定 base URL
 * @param url
 */
function setBaseURL (url) {
  property.baseURL = url || '';
}

function getBaseURL () {
  return property.baseURL;
}

/**
 * 取得材質群組
 * @param textures {Object} 材質清單
 * @param groupName {String} 群組名稱
 * @return {Object} 傳回材質
 */
function getTextures (textures, groupName) {
  let group = textures, subGroup, groupNameList = groupName.split('.');
  groupNameList.every(function (groupName)  {
    subGroup = group[groupName];
    if (subGroup)    {
      group = subGroup;
      return true;
    } else    {
      return false;
    }
  });

  return group;
}

/**
 * 建立音效
 * @param data {Object} sound config list
 * @param callback {Function} callback event
 * @return {boolean} 是否建立成功
 */
function createSound (data, callback) {
  let snd, names, index = 0, length = 0, infoList, e = property.event;
  let sndMap = {};
  let soundMapList = property.soundMapList;
  console.log('create sound');

  //--
  if (!globalThis.Howl || !data.sounds)  {
    if (callback) {
      callback(null);
    }

    return false;
  }

  names = Object.getOwnPropertyNames(data.sounds);
  console.log('-------------------------------');
  if (e.sceneResBegin) {
    e.sceneResBegin(ID_CREATE_SOUND);
  }
  let currentProgress = 0;
  let currentLength = 0;
  index = 0;
  let baseURL = property.baseURL;

  names.forEach(name => {
    let snds = {};
    infoList = data.sounds[name];
    length = infoList.length;
    currentLength += length;
    infoList.forEach(info => {
      let src = info.config.src;
      if (Array.isArray(info.config.src)) {
        let s = [];
        info.config.src.forEach(name => {
          s.push(baseURL + name);
        });
        info.config.src = s;
      }
      snd = new Howl(info.config);
      info.config.src = src;
      snds[info.objName] = snd;
      index = index + 1;
      currentProgress = index / currentLength * 100;
      console.log('  load sound : ' + info.objName);
      let totalProgress = property.baseProgress + currentProgress * property.base;
      let value = {
        currentProgress: currentProgress,
        totalProgress: totalProgress,
        state: property.state
      };
      console.log(JSON.stringify(value));
      if (e.sceneResLoading) {
        e.sceneResLoading(value);
      }
    });

    if (infoList.length > 0) {
      sndMap[name] = snds;
    } else {
      sndMap[name] = null;
    }
  });

  if (e.sceneResEnd) {
    e.sceneResEnd(ID_CREATE_SOUND);
  }

  soundMapList.push(sndMap);
  if (callback) {
    callback(sndMap);
  }

  return true;
}

/**
 * 釋放指定的音效
 * @param snds {Object} 音效清單
 */
function destroySound (snds) {
  console.log('destroy sound');
  let names = Object.getOwnPropertyNames(snds);
  names.forEach(name => {
    let snd = snds[name];
    if (snd && snd.stop) {
      snd.stop();
      snd.unload();
      console.log('  unload sound : ' + name);
    } else {
      destroySound(snd);
    }

    delete snds[name];
  });
}

/**
 * 釋放全部的音效
 */
function destroyAllSound () {
  let soundMapList = property.soundMapList;
  console.log('destroy all sound');
  soundMapList.forEach(sndMap => {
    let names = Object.getOwnPropertyNames(sndMap);
    names.forEach(name => {
      console.log('name : ' + name);
      let snds = sndMap[name];
      destroySound(snds);
      delete sndMap[name];
    });
  });
}

class Scene {
  constructor (game) {
    this.game = game;
    this.isInScene = false;
  }
  show (layer) {
    let self = this;
    let game = self.game;
    if (self.isInScene) {
      return;
    }
    self.isInScene = true;
    if (!layer) {
      layer = game.layer.main;
    }
    if (self.objs) {
      self.objs.forEach(obj => {
        if (obj) {
          obj._game = game;
          if (obj.isInScene) {
            if (obj.addToScene) {
              obj.addToScene(layer);
            } else {
              layer.addChild(obj);
            }
          }
        }
      });
    }
  }
  hide () {
    let self = this;
    if (!self.isInScene) {
      return;
    }
    self.isInScene = false;
    if (self.objs) {
      self.objs.forEach(obj => {
        if (obj) {
          if (obj.removeFromScene) {
            obj.removeFromScene();
          } else {
            if (obj.parent) {
              obj.parent.removeChild(obj);
            }
          }
        }
      });
    }
  }
  init (objs) {
    let self = this;

    let entity = {};
    self.entity = entity;

    function initGroup (group) {

      group.childList.forEach(obj => {
        if (obj) {
          let conf = obj.conf;
          if (conf.objName) {
            group[conf.objName] = obj;
            let msg = 'set group child name"' + obj.objName + '"';
            console.log(msg);
            if (OBJ_TYPE.GROUP === obj.type) {
              initGroup(obj);
            }
          }
        }
      });
    }

    // 物件設定
    objs.forEach(obj => {
      let msg = '';
      if (obj) {
        if (obj.objName) {
          entity[obj.objName] = obj;
          msg = 'set entity name"' + obj.objName + '"';
          console.log(msg);
          if (OBJ_TYPE.GROUP === obj.type) {
            initGroup(obj);
          }
        }
      }
    });
  }
}

/**
 * 場景管理
 * @param config {Object} 設定
 * @return {Promise} 是否完成申請建立場景
 */
function createScene (config, event) {
  let promise = new Promise((resolve, reject)=>{
    if (property.isBusy) {
      reject('忙碌中');
      return;
    }
    let game = config.game;
    let infoList = config.infoList;
    let loading = config.loading;
    let loadingEvent = config.loadingEvent;
    let scene = new Scene(game);

    let eventMap = {

      // 取得原始資訊
      data: {
        proc: createRawData,
        callback (data) {

          scene.data = data;
          if (event && event.eventRawData) {
            event.eventRawData(data);
          }

        }
      },

      // 取得聲音
      sound: {
        proc: createSound,
        callback (sounds) {

          scene.sounds = sounds;
          if (event && event.eventSound) {
            event.eventSound(sounds);
          }
        }
      },

      // 取得材質
      texture: {
        proc: createTexture,
        callback (textures) {

          scene.textures = textures;
          if (event && event.eventTexture) {
            event.eventTexture(textures);
          }
        }
      },

      // 取得 spine 動畫
      spine: {
        proc: createSpineData,
        callback (spines) {

          scene.spines = spines;
          if (event && event.eventSpine) {
            event.eventSpine(spines);
          }
        }
      },

      // 取得物件
      object: {
        proc: createObject,
        callback (objs) {

          if (!scene.objs) {
            scene.objs = objs;
          } else {
            objs.forEach(obj => {
              scene.objs.push(obj);
            });
          }
          scene.init(objs);

          if (event && event.eventObject) {
            event.eventObject(objs);
          }
        }
      }
    };
    if (loadingEvent && loadingEvent.start) {
      loadingEvent.start();
    }

    // 完成
    function createFinish () {
      if (loading) {
        loading.setState(true);
      }
      if (event && event.finish) {
        event.finish(scene);
      }
      if (loadingEvent && loadingEvent.finish) {
        loadingEvent.finish(scene);
      }

      resolve(scene);
    }


    //-----------------------------
    let conf = {
      game,
      objData: [],
      proc: [],
      callback: [],
      finish: createFinish
    };
    if (infoList && Array.isArray(infoList)) {
      infoList.forEach((info) => {
        let event = eventMap[info.eventName];
        if (event && info.obj && event.proc) {
          conf.objData.push(info.obj);
          conf.proc.push(event.proc);
        } else {
          console.error('eventName  : ' + info.eventName + ' init error !');
        }
        conf.callback.push(event.callback);
      });
    } else {
      console.log('error : infoList');
    }
    if (loading) {
      loading.go({
        loadingEvent,
        game,
        layer: game.layer && game.layer.overlay,
        load () {
          loadSceneEx(conf);
        }
      });
    } else {
      loadSceneEx(conf);
    }

  });

  return promise;
}

var sceneManager = /*#__PURE__*/Object.freeze({
  __proto__: null,
  OBJ_TYPE: OBJ_TYPE,
  createDebugTxeture: createDebugTxeture,
  createGroup: createGroup,
  init: init$c,
  registerFactory: registerFactory,
  loadScene: loadScene,
  loadSceneEx: loadSceneEx,
  setEvent: setEvent,
  setState: setState,
  createRawData: createRawData,
  createSpineData: createSpineData,
  createBonesData: createBonesData,
  createObject: createObject,
  createTexture: createTexture,
  setTextures: setTextures,
  setSpineData: setSpineData,
  setBaseURL: setBaseURL,
  getBaseURL: getBaseURL,
  getTextures: getTextures,
  createSound: createSound,
  destroySound: destroySound,
  destroyAllSound: destroyAllSound,
  createScene: createScene
});

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * 讀取事件管理
 */
let properties = {
  isBusy: false,
  game: null,
  loading: null,
  useLobbyState: false,
  state: {
    currentIndex: 0,
    totals: 0
  }
};

/**
 * 開始載入資料
 * @param configList {Object} 設定需要讀取的資料
 * @param finish {function} 設定讀取完成後需要做的事情
 * @return {boolean} 是否開始載入資料
 */
function go (configList, finish) {
  if (properties.isBusy || !properties.game || !Array.isArray(configList)) {
    return false;
  }

  let game = properties.game;
  let loading = properties.loading;
  let currentIndex = 0;
  let totals = configList.length;
  let checkScene;
  let proc;
  let eventFinish = finish;
  let sceneConfigList = configList;

  console.log('go sceneConfigList : ');
  console.log(sceneConfigList);
  setState(properties.state);

  checkScene = () => {
    console.log('================================================');
    if (currentIndex < totals) {
      let config = sceneConfigList[currentIndex];
      let scene = config.scene;
      currentIndex += 1;
      if (scene) {
        console.log('=======================');
        console.log('開始建立場景');
        return proc(scene);
      } else {
        checkScene();
      }
    } else {
      properties.isBusy = false;
      if (!properties.useLobbyState) {
        if (loading) {
          loading.setState(true);
        }
      }

      console.log('=======================');
      console.log('建立場景完成');
      if (eventFinish) {
        eventFinish();
      }
      return false;
    }
  };

  proc = (scene) => {
    properties.state.currentIndex = currentIndex;
    properties.state.totals = totals;
    let state = false;
    if (!scene.isCreate() && scene.createScene) {
      state = true;
      scene.createScene(checkScene);
    } else {
      checkScene();
    }
    return state;
  };

  //--
  properties.isBusy = true;
  if (!properties.useLobbyState) {
    loading.go({
      game: game,
      layer: game.layer && game.layer.overlay,
      load () {
        checkScene();
      }
    });
  } else {
    checkScene();
  }

  return true;
}

/**
 * 設定是否使用 lobby 顯示讀取進度
 * @param enable {Boolean} 是否使用
 */
function setUseLobbyState (enable) {
  properties.useLobbyState = enable;

  if (enable && properties.game && properties.game.scene) {
    console.log('setUseLobbyState');

    setEvent(properties.game.scene.loadingEvent);
  } else {
    properties.useLobbyState = false;
    setEvent(null);
  }
}

/**
 * set game
 * @param game {Object} game
 */
function setGame (game) {
  properties.game = game;
}

/**
 * 設定顯示畫面
 * @param loading {Loading} 指定顯示讀取進度物件
 */
function setDisplayLoading (loading)    {
  properties.loading = loading;
}

var loadingManager = /*#__PURE__*/Object.freeze({
  __proto__: null,
  go: go,
  setUseLobbyState: setUseLobbyState,
  setGame: setGame,
  setDisplayLoading: setDisplayLoading
});

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * 讀取事件
 *
 *
 */
let scene = {
  init: null,
  release: null,
  resource: null,
  eventResBegin: null,
  eventResCheck: null,
  eventResEnd: null,
  eventStart: null,
  eventEnter: null,
  eventLeave: null
};
let currentUpdate = null;
let eventFinish = null;

/**
 *
 */
function refresh$1 (offsetTime) {
  if (currentUpdate) {
    currentUpdate(offsetTime);
  }
}

class Loading {

  /**
   *
   */
  static resCreate (offsetTime) {
    if (scene.resource) {
      scene.resource(offsetTime);
    }
  }

  /**
   *
   */
  static frameStart (offsetTime) {
    if (scene.eventStart) {
      scene.eventStart(offsetTime);
    }

    currentUpdate = Loading.frameEnter;
  }

  /**
   *
   */
  static frameFinish (offsetTime) {
    if (scene.release) {
      scene.release(offsetTime);
    }

    currentUpdate = null;

    //----
    if (eventFinish)    {
      eventFinish();
      eventFinish = null;
    }
  }

  /**
   *
   */
  static frameEnter (offsetTime) {
    let state = true;
    if (scene.eventEnter) {
      state = scene.eventEnter(offsetTime);
    }

    if (state) {
      currentUpdate = Loading.resBegin;
    }
  }

  /**
   *
   */
  static frameLeave (offsetTime) {
    let state = true;
    if (scene.eventLeave) {
      state = scene.eventLeave(offsetTime);
    }

    if (state) {
      currentUpdate = Loading.frameFinish;
    }
  }

  /**
   *
   */
  static resBegin (offsetTime) {
    if (scene.eventResBegin) {
      scene.eventResBegin(offsetTime);
    }

    Loading.resCreate();
    currentUpdate = Loading.resLoading;
  }

  /**
   *
   */
  static resLoading (offsetTime) {
    if (scene.eventResCheck) {
      if (scene.eventResCheck(offsetTime)) {
        currentUpdate = Loading.resEnd;
      }
    } else {
      currentUpdate = Loading.resEnd;
    }
  }

  /**
   *
   */
  static resEnd (offsetTime) {
    if (scene.eventResEnd) {
      scene.eventResEnd(offsetTime);
    }

    currentUpdate = Loading.frameLeave;
  }

}

/**
 * 啟動讀取事件
 * @param event {Event}
 * @return {boolean} 是否開始讀取
 */
function go$1 (event) {
  if (currentUpdate) {
    return true;
  }
  if (typeof event === 'object')  {
    scene.init = event.init;
    scene.release = event.release;
    scene.resource = event.resource;
    scene.eventResBegin = event.resBegin;
    scene.eventResCheck = event.resCheck;
    scene.eventResEnd = event.resEnd;
    scene.eventStart = event.start;
    scene.eventEnter = event.enter;
    scene.eventLeave = event.leave;
    eventFinish = event.finish;
  }

  if (scene.init) {
    scene.init();
  }

  currentUpdate = Loading.frameStart;
  return true;
}

// export {
//   refresh,
//   go
// };

var loading = /*#__PURE__*/Object.freeze({
  __proto__: null,
  refresh: refresh$1,
  go: go$1
});

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * 定義
 *
 */

let properties$1 = {
  event: null,
  scene: {
    anim: null,
    message: null,
    percent: null
  },
  isInit: false,
  strings: null,
  resList: null,
  state: false
};
let sceneEvent = null;


function init$d (/*conf*/) {
}

/**
 * 設定讀取狀態是否完成
 * @param state
 */
function setState$1 (state) {
  properties$1.state = state;
}

/**
 * 設定多語用文字物件
 * @param state
 */
function setStrings (strings) {
  properties$1.strings = strings;
}

function setPosition (pos) {
  let anim = properties$1.scene.anim;
  if (anim) {
    anim.x = pos.x;
    anim.y = pos.y;
  }
  if (properties$1.pos) {
    properties$1.pos.x = pos.x;
    properties$1.pos.y = pos.y;
  } else {
    properties$1.pos = {
      x: pos.x,
      y: pos.y
    };
  }
}

/**
 * 設定讀取畫面
 * @param resList {PIXI.Texture} 材質清單
 */
function setScene (resList) {
  properties$1.resList = resList;
  properties$1.isInit = false;
}

/**
 * 設定顯示訊息
 * @param str {String} 訊息
 */
/*
export function setMessage (str) {
  if (properties.message) {
    properties.message.text = str;
  }
}
*/
/**
 * 啟動
 * @param conf {Object} 讀取事件設定檔
 * @return {boolean} 是否啟動成功
 */
function go$2 (conf) {
  if (!globalThis.PIXI) {
    return false;
  }
  let PIXI = globalThis.PIXI;

  let loadingEvent = conf.loadingEvent || {};
  let game = conf.game;
  let strings = properties$1.strings;
  let event = {
    resBegin (index) {
      if (loadingEvent.resBegin) {
        loadingEvent.resBegin(index);
      }
    },

    resEnd (index) {
      if (loadingEvent.resEnd) {
        loadingEvent.resEnd(index);
      }
    },

    sceneResBegin (id) {
      let msg = id;
      if (strings && strings.get) {
        msg = strings.get(id);
      }

      console.log('sceneResBegin:' + msg);
      if (loadingEvent.sceneResBegin) {
        loadingEvent.sceneResBegin(id);
      }
    },

    sceneResLoading (value) {
      let s = value.state;
      let totalProgress = value.totalProgress;
      if (s) {
        let baseValue = (s.currentIndex - 1) / s.totals * 100;
        totalProgress = baseValue + totalProgress / s.totals;
      }
      let str = totalProgress.toFixed(0) + '%';
      if (loadingEvent.sceneResLoading) {
        loadingEvent.sceneResLoading(value);
      }

      if (properties$1.percent) {
        properties$1.percent.text = str;
      }
    },

    sceneResEnd (id) {
      let msg = id;
      if (strings && strings.get) {
        msg = strings.get(id);
      }

      console.log('sceneResEnd:' + msg);
      if (loadingEvent.sceneResEnd) {
        loadingEvent.sceneResEnd(id);
      }
    }
  };
  sceneEvent = event;

  setEvent(sceneEvent);

  let e = {
    name: 'loading',

    screen: {
      width: (game.screen && game.screen.width) || 1024,
      height: (game.screen && game.screen.height) || 768
    },
    movieClip: null,
    layer: conf.layer || null,
    load: conf.load
  };
  e.init = () => {
    if (!properties$1.isInit) {
      properties$1.isInit = true;

      //---- 讀取事件用
      let loadingRes = properties$1.resList;
      let te, textureList = [];
      loadingRes.forEach(res => {
        te = PIXI.Texture.from(res);
        textureList.push(te);
      });

      let anim = null;
      if (PIXI.AnimatedSprite) {
        anim = new PIXI.AnimatedSprite(textureList);
      } else {
        anim = new PIXI.extras.AnimatedSprite(textureList);
      }
      anim.animationSpeed = 0.33;
      anim.anchor.x = 0.5;
      anim.anchor.y = 0.5;
      properties$1.scene.anim = anim;

      //--
      let message = new PIXI.Text('message');
      message.style.fill = '#FFFFFF';
      message.style.stroke = '#006600';
      message.style.strokeThickness = 1;
      message.anchor.x = 0.5;
      message.anchor.y = 0.5;
      message.x = 0;
      message.y = -44;
      properties$1.message = message;

      //--
      let percent = new PIXI.Text('init');
      percent.style.fill = '#FFFFFF';
      percent.style.stroke = '#aa0000';
      percent.style.strokeThickness = 1;
      percent.anchor.x = 0.5;
      percent.anchor.y = 0.5;
      percent.x = 0;
      percent.y = 24;
      properties$1.percent = percent;

      /*
       //--
       e.net = new PIXI.Text("net");
       e.net.style.fill = '#FFFFFF';
       e.net.style.stroke = '#0000bb';
       e.net.style.strokeThickness = 1;
       e.net.anchor.x = 0.5;
       e.net.anchor.y = 0.5;
       e.net.x = 0;
       e.net.y = 54;
       */

      //--
      //        e.movieClip.addChild(e.net);
      anim.addChild(message);
      anim.addChild(percent);
      if (!properties$1.pos) {
        properties$1.pos = {
          x: e.screen.width / 2,
          y: e.screen.height / 2
        };
      }
      properties$1.anchor = new PIXI.Point(0.5, 0.5);
    }

    //--
    game.addRefresh(e.name, refresh$1);
  };

  e.release = (/*offsetTime*/) => {
    if (e.layer !== null && properties$1.scene.anim !== null) {
      e.layer.removeChild(properties$1.scene.anim);
    }

    //--
    game.removeRefresh(e.name);
  };

  e.resource = () => {
    if (e.load) {
      e.load();
    }
  };

  e.resBegin = (/*offsetTime*/) => {
    //            e.message.text = e.game.strings.createScene;
  };

  e.resCheck = (/*offsetTime*/) => {
    return properties$1.state;
  };

  e.resEnd = (/*offsetTime*/) => {
    //            e.message.text = e.game.strings.startGame;
  };

  e.start = (/*offsetTime*/) => {
    if (e.layer !== null && properties$1.scene.anim !== null) {
      if (properties$1.percent) {
        properties$1.percent.text = 'start';
      }

      //                e.net.text = e.game.strings.checkNet;
      let anim = properties$1.scene.anim;
      anim.x = properties$1.pos.x;
      anim.y = properties$1.pos.y;
      anim.anchor.x = properties$1.anchor.x;
      anim.anchor.y = properties$1.anchor.y;
      anim.alpha = 0.0;
      anim.gotoAndPlay(0);
      e.layer.addChild(anim);
    }
  };

  e.enter = (/*offsetTime*/) => {
    let state = false;
    let anim = properties$1.scene.anim;
    if (anim !== null) {
      if (anim.alpha >= 1.00)      {
        anim.alpha = 1.0;
        state = true;
      } else      {
        anim.alpha += 0.05;
      }
    } else {
      state = true;
    }

    return state;
  };

  e.leave = (/*offsetTime*/) => {
    let state = false;
    let anim = properties$1.scene.anim;
    if (anim !== null)    {
      if (anim.alpha <= 0.00)      {
        anim.alpha = 0.0;
        state = true;
      }

      anim.alpha -= 0.05;
      if (anim.alpha <= 0.00) {
        anim.alpha = 0.0;
      }
    } else    {
      state = true;
    }

    return state;
  };

  e.finish = (/*offsetTime*/) => {
  };

  properties$1.event = e;
  properties$1.state = false;
  return go$1(properties$1.event);
}

var uiLoading = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$d,
  setState: setState$1,
  setStrings: setStrings,
  setPosition: setPosition,
  setScene: setScene,
  go: go$2
});

/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */


class Base {
  constructor () {

    let self = this;
    let stats = null;
    let property = {
      debug: false,
      timeBase: 1.0,
      currentTime: -1,
      renderer: null,
      pause: true,
      isInit: false
    };
    let engine = null;
    let updateNames = [];
    let updateObjList = [];
    let updateRefreshMap = {};

    // 自行定義
    self.custom = {};

    self.setEngine = obj => {
      engine = obj;
    };
    self.setElement = element => {
      property.element = element;
    };

    //-------------------------------------------------------------
    /**
     * 刷新遊戲畫面
     * @param offsetTime {Integer} 經過總時間
     */
    self.update = offsetTime => {

      //
      if (property.debug && stats) {
        stats.begin();
      }

      //
      if (property.currentTime < 0) {
        offsetTime = 0.0;
        property.currentTime = 1;
      }
      offsetTime = offsetTime * property.timeBase;

      //--
      updateNames.forEach(name => {
        let obj = updateRefreshMap[name];
        if (obj.update) {
          obj.update(offsetTime);
        } else {
          obj(offsetTime);
        }
      });

      updateObjList.forEach(obj => {
        if (obj.update) {
          obj.update(offsetTime);
        }
      });

      if (!property.pause && engine) {
        engine.render(offsetTime);
      }

      if (property.debug && stats) {
        stats.end();
      }
    };
    property.debug = false;

    //----
    /**
     * 從更新清單中增加指定的名稱的事件
     * @param name {String} 名稱
     * @param obj {Object}  物件或涵式
     */
    self.addRefresh = (name, obj) => {
      console.log('addRefresh name : ' + name);
      updateRefreshMap[name] = obj;
      updateNames = Object.getOwnPropertyNames(updateRefreshMap);
    };

    /**
     * 從更新清單中移除指定的名稱的事件
     * @param name {String} 名稱
     */
    self.removeRefresh = (name) => {
      console.log('removeRefresh name : ' + name);
      if (Object.prototype.hasOwnProperty.call(updateRefreshMap, name)) {
        delete updateRefreshMap[name];
        updateNames = Object.getOwnPropertyNames(updateRefreshMap);
      }
    };

    /**
     * 增加 update 物件
     * @param obj {Object} 物件
     * @return {boolean} 是否加入成功
     */
    self.addUpdate = (obj) => {
      let state = false;
      if (obj && obj.update && !Object.prototype.hasOwnProperty.call(obj, '__updateIndex')) {
        obj.__updateIndex = updateObjList.length;
        updateObjList[obj.__updateIndex] = obj;
        state = true;
      }

      return state;
    };

    /**
     * 刪除 update 物件
     * @param obj {Object} 物件
     */
    self.removeUpdate = (obj) => {
      let idx;
      let length = updateObjList.length;
      let tmp;
      if (typeof obj.__updateIndex === 'number') {
        idx = obj.__updateIndex;
        if (idx >= 0 && idx < length) {
          let lastIdx = length - 1;
          tmp = updateObjList[lastIdx];
          updateObjList[idx] = tmp;
          tmp.__updateIndex = idx;

          // remove
          updateObjList.splice(lastIdx, 1);
        }

        delete obj.__updateIndex;
      }
    };

    /**
     * 重設 update
     */
    self.resetUpdate = () => {
      updateObjList.forEach(obj => {
        delete obj.__updateIndex;
      });
      updateObjList = [];
    };

    self.setTimeout = (func, seconds) => {
      let t = {
        currentTime: 0.0,
        func: func
      };
      t.update = (offsetTime) => {
        if (t.currentTime.toFixed(2) >= seconds) {
          self.removeUpdate(t);
          if (t.func) {
            t.func(t.currentTime);
          }
        }
        t.currentTime += offsetTime;
      };
      self.addUpdate(t);

      return t;
    };
    self.idle = (seconds) => {
      return new Promise((resolve/*, reject*/) => {
        function done () {
          console.log('done');
          resolve();
        }
        self.setTimeout(done, seconds);
      });
    };

    self.setInterval = (func, seconds) => {
      let currentTime = 0.0;

      let t = {
        func: func
      };
      t.update = (offsetTime) => {
        currentTime += offsetTime;
        if (currentTime.toFixed(2) >= seconds) {
          if (t.func) {
            t.func(currentTime);
          }
          currentTime = 0.0;
        }
      };
      self.addUpdate(t);
      return t;
    };
    self.clearInterval = (t) => {
      self.removeUpdate(t);
    };

    /**
     * 是否暫停
     * @return {boolean} 傳回目前狀態
     */
    self.isPause = () => {
      return property.pause;
    };

    /**
     * 播放
     */
    self.play = () => {
      if (!property.pause) {
        return;
      }
      property.pause = false;
      property.currentTime = -1;
      add(self);
    };

    /**
     * 更新一次
     */
    self.once = () => {
      property.pause = false;
      property.currentTime = -1;
      once(self);
    };

    /**
     * 暫停
     */
    self.pause = () => {
      if (property.pause) {
        return;
      }
      property.pause = true;
      remove(self);
    };

    /**
     * 停止
     */
    self.stop = () => {
      property.pause = true;
      remove(self);
      self.resetUpdate();
    };

    /**
     * 加速 (最快 10.0)
     * @param value
     */
    self.add = (value) => {
      if (property.timeBase < 1.0) {
        property.timeBase = 1.0;
      }
      property.timeBase += value;
      if (property.timeBase > 4.00) {
        property.timeBase = 4.00;
      }
    };

    /**
     * 減速 (最慢 0.1)
     * @param value
     */
    self.dec = (value) => {
      if (property.timeBase > 1.0) {
        property.timeBase = 1.0;
      }
      property.timeBase -= value;
      if (property.timeBase < 0.10) {
        property.timeBase = 0.10;
      }
    };

    /**
     * 重設
     *
     */
    self.reset = () => {
      property.timeBase = 1.00;
    };
    self.getTimeBase = () => {
      return property.timeBase;
    };
    self.setTimeBase = value => {
      property.timeBase = value;
      if (property.timeBase < 0.10) {
        property.timeBase = 0.10;
      } else if (property.timeBase > 4.00) {
        property.timeBase = 4.00;
      }
    };


    /**
     * 初始化遊戲引擎
     * @param conf {Object} 遊戲引擎設定
     */
    self.init = (conf) => {
      if (property.isInit) {
        return false;
      }

      console.log('game init');
      property.isInit = true;

      property.element = conf.element;
      property.currentTime = -1.0;
      let screen = {
        width: conf.width,
        height: conf.height
      };

      self.pause();
      self.screen = screen;
      console.log('init ok');

      return true;
    };

    self.getRenderer = () => {
      return engine && engine.renderer;
    };

    //--
    Object.defineProperty(self, 'layer', {
      get () {
        return engine && engine.layer;
      }
    });
    Object.defineProperty(self, 'debug', {
      set (state) {
        if (!stats) {
          if (Base.Stats) {
            stats = new Base.Stats();
            self.stats = stats;
          }
        }
        if (state) {
          if (stats && property.element) {
            stats.dom.style.position = 'absolute';
            property.element.appendChild(stats.dom);
          }
        } else {
          if (stats && property.element && stats.dom.parentElement) {
            property.element.removeChild(stats.dom);
          }
        }

        property.debug = state;
      },
      get () {
        return property.debug;
      }
    });

    self.stats = null;
  }
}

Base.Stats = null;
Base.isInitial = false;

/**
 * 初始化
 * @param conf
 */
function init$e (conf) {
  if (Base.isInitial) {
    return false;
  }
  if (conf.Stats) {
    Base.Stats = conf.Stats.default || conf.Stats;
  }

  Base.isInitial = true;
  return true;
}

let isInit$1 = false;

function init$f (/*config*/) {

  if (isInit$1) {
    return;
  }
  isInit$1 = true;
  let PIXI = globalThis.PIXI;

  if (PIXI) {

    // 動態產生材質用
    PIXI.Texture.Draw = (cb) => {
      let canvas = document.createElement('canvas');
      if (typeof cb === 'function') {
        cb(canvas);
      }

      return PIXI.Texture.fromCanvas(canvas);
    };
  }
}


/**
 * 初始化遊戲引擎,建立 loading 所須物件
 * @param config
 * @returns {}
 */
function create (config) {
  if (!globalThis.PIXI) {
    return null;
  }
  let stage, renderer, layer = {};
  let options = config;
  // let PIXI = globalThis.PIXI;

  // create a renderer instance
  if (PIXI.Renderer) {
    renderer = new PIXI.Renderer(options);
  } else {
    renderer = new PIXI.WebGLRenderer(options);
  }
  console.log('建立 pixijs');
  console.log(renderer);
  //--

  stage = new PIXI.Container();
  layer.stage = stage;

  //----建立圖層
  layer.overlay = new PIXI.Container();
  layer.foreground = new PIXI.Container();
  layer.main = new PIXI.Container();
  layer.background = new PIXI.Container();
  stage.addChildAt(layer.overlay, 0);
  stage.addChildAt(layer.foreground, 0);
  stage.addChildAt(layer.main, 0);
  stage.addChildAt(layer.background, 0);

  //--
  let engine = {
    renderer,
    stage,
    layer,
    render (/*offsetTime*/) {
      renderer.render(stage);
    }
  };

  return engine;
}

let m = null;
function init$g (config) {
  m = config.m;
  init$f();
}

let canvasStyle = {
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};
let baseStyle = {
  zIndex: 10,
  position: 'absolute',
  left: '0%',
  top: '0%',
  width: '100%',
  height: '100%'
};
let Component = {
  oninit (vnode) {
    let self = this;
    let attrs = vnode.attrs;
    let config = vnode.attrs.config;

    self.config = config;
    self.game = config.game;
    self.style = attrs.style || baseStyle;
    self.ready = attrs.ready;
  },

  oncreate (vnode) {
    let self = this;
    let config = self.config;
    config.view = vnode.instance.children[0].dom;
    config.element = vnode.dom;
    console.info('oncreate : ');
    console.info(config);

    let game = self.game;
    if (!game) {
      game = new Base();
      self.game = game;
    }
    game.init(config);

    let engine = create(config);
    game.setEngine(engine);

    if (config && config.ready) {
      config.ready(game);
    }
    if (self.ready) {
      self.ready(game);
    }
  },

  onremove (/*vnode*/) {
    console.log('game onremove');
    let game = this.game;
    if (game) {
      game.stop();
    }
  },
  view (/*vnode*/) {
    let self = this;
    return m('.', {style: self.style},
      m('canvas', {style: canvasStyle})
    );
  }
};

/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

function init$h (conf) {
  init$e(conf);
  init$g(conf);
}

/**
 * 啟動
 * @param config {Object} 設定檔
 * @return {Object} 傳回遊戲物件
 */
function run (config) {
  console.log('!!!! game.run !!!!');

  let game;
  game = new Base();

  //--
  if (window.parent && (window.parent !== window)) {
    console.log('init parent !');
    let scene;
    let event;

    window.Howl = window.parent.Howl;
    window.Howler = window.parent.Howler;

    //--
    if (window.parent.scene) {
      let id = config.id;
      let e = config.event || {};
      scene = window.parent.scene[id];
      Object.defineProperty(game, 'scene', {
        get () {
          return scene;
        }
      });
      console.log('scene : ' + scene);

      if (scene && scene.event) {
        event = {

          // 建立場景
          create (conf) {
            console.log('game event create');
            if (window.parent.lobby) {
              game.table = window.parent.lobby.table[conf.id];
              game.currentUser = window.parent.lobby.currentUser;
              game.command = window.parent.lobby.net.gameCommand;
              game.lobby = {
                setEvent: window.parent.lobby.setEvent,
                setCommand: window.parent.lobby.net.setLobbyCommand,
                CMD: window.parent.lobby.net.CMD
              };
            }

            if (e.create) {
              conf.game = game;
              e.create(conf);
            }
          },

          // 更新場景
          play (conf) {
            game.play();
            if (e.play) {
              conf.game = game;
              e.play(conf);
            }
          },

          // 暫停場景
          pause (conf) {
            game.pause();
            if (e.pause) {
              conf.game = game;
              e.pause(conf);
            }
          },

          // 進入場景
          enter (conf) {
            if (e.enter) {
              conf.game = game;
              e.enter(conf);
            }
          },

          // 離開場景
          leave (conf) {
            if (e.leave) {
              conf.game = game;
              e.leave(conf);
            }
          },

          // 焦點
          focus () {
            if (e.focus) {
              e.focus();
            }
          },

          // 模糊
          blur () {
            if (e.blur) {
              e.blur();
            }
          },

          // 鎖定畫面比例
          lock (state) {
            if (e.lock) {
              e.lock(state);
            }
          },

          // 全螢幕事件
          fullscreen (state) {
            if (e.fullscreen) {
              e.fullscreen(state);
            }
          },

          // 尺寸改變事件
          resize (state) {
            if (e.resize) {
              e.resize(state);
            }
          },

          // 音樂事件
          music (state) {
            if (e.music) {
              e.music(state);
            }
          },

          // 音效事件
          sound (state) {
            if (e.sound) {
              e.sound(state);
            }
          }
        };
        scene.setEvent(event);
        scene.game = game;
      }
    }
  }

  return game;
}

var game = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$h,
  run: run
});

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * 場景基底物件
 *
 */
class Base$1 {

  /**
   * 建立
   * @param root {Object} 舊專案用
   * @param name {String} 名稱
   */
  constructor (name) {
    let self = this;

    // properties
    let properties = {

      /**
       * name
       */
      name: name,

      /**
       * root
       */
      root: null,

      /**
       * game
       */
      game: null,

      /**
       * center
       */
      center: {
        entity: {}
      },

      /**
       * 初始化對照表
       */
      initMap: null,

      /**
       * 目前花費時間(從 addToScene 開始歸零重新計時)
       */
      currentTime: 0.0,

      /**
       * 是否建立完成
       */
      isCreate: false,

      /**
       * 是否加入場景中
       */
      isInScene: false
    };
    self.properties = properties;

    // 設定屬性
    Object.defineProperty(self, 'center', {
      get: () => properties.center
    });
    Object.defineProperty(self, 'entity', {
      get: () => properties.center.entity
    });
  }

  /**
   * 取得場景名稱
   * @return {string} 傳回場景名稱
   */
  getName () {
    return this.properties.name;
  }

  /**
   * 取得 game
   * @return {string} 傳回 game
   */
  getGame () {
    return this.properties.game;
  }

  /**
   * 是否建立場景完成
   * @return {Boolean} 是否建立場景完成
   */
  isCreate () {
    return this.properties.isCreate;
  }

  /**
   * 是否被加入場景中
   * @return {Boolean} 是否被加入場景中
   */
  isInScene () {
    return this.properties.isInScene;
  }

  /**
   * 取得目前時間, 從呼叫 addToScene 開始歸零計時
   * @return {Number} 傳回花費時間
   */
  getCurrentTime () {
    return this.properties.currentTime;
  }

  /**
   * center
   * @return {Object} 傳回 center
   */
  getCenter () {
    return this.properties.center;
  }

  /**
   * root
   * @return {Object} 傳回 root
   */
  getRoot () {
    return this.properties.root;
  }

  /**
   * 設定 root
   * @param root {Object} root
   */
  setRoot (root) {
    let properties = this.properties;
    properties.root = root;
    properties.center = root.center;
  }

  /**
   * 設定初始化對照表
   * @param initMap {Function} 初始化對照表函式
   */
  setInitMap (initMap) {
    let properties = this.properties;
    properties.initMap = initMap;
  }

  /**
   * set layer
   * @param layer {Object} layer
   */
  setLayer (layer) {
    this.properties.center.layer = layer;
  }

  /**
   * layer
   * @return {Object} 傳回 layer
   */
  getLayer () {
    return this.properties.center.layer;
  }

  /**
   * 取得原生資料
   * @return {Object} 傳回原生資料
   */
  getRawData () {
    return this.properties.center.rawdata;
  }

  /**
   * 取得音樂音效
   * @param group {string} 群組名稱, 沒有指定時,傳回主要物件
   * @return {Object} 傳回音樂音效
   */
  getSound (group) {
    let sounds = this.properties.center.sounds;
    if (sounds && typeof group === 'string') {
      sounds = sounds[group];
    }

    return sounds;
  }

  /**
   * 靜音
   * @param state
   */
  mute (group, state) {
    let sounds = this.properties.center.sounds;
    let snds = sounds[group];
    if (snds) {
      let names = Object.getOwnPropertyNames(snds);
      names.forEach(name => {
        let snd = snds[name];
        snd.mute(state);
      });
    }
  }

  /**
   * 取得材質
   * @param group {string} 群組名稱, 沒有指定時,傳回主要物件
   * @return {Object} 傳回材質
   */
  getTexture (group) {
    let textures = this.properties.center.textures;
    if (textures && typeof group === 'string') {
      textures = textures[group];
    }

    return textures;
  }

  /**
   * 取得物件
   * @return {Object} 傳回物件
   */
  getObject () {
    return this.properties.center.objs;
  }

  /**
   * 取得 entity
   * @return {Object} 傳回entity
   */
  getEntity () {
    return this.properties.center.entity;
  }

  /**
   * 場景建立完成呼叫用
   */
  eventFinish ()  {
    let self = this;
    let properties = self.properties;
    let center = properties.center;
    if (center.textures) {
      setTextures(center.textures);
    }
    if (center.spines) {
      setSpineData(center.spines);
    }

    if (properties.initMap) {
      properties.initMap(self);
    }
  }

  /**
   * 處理原始資料
   * @param data {Object} 原始資料
   */
  eventRawData (data) {
    console.log('superclass event : raw data ');
    console.log(data);
  }

  /**
   * 處理音樂音效
   * @param sounds {Object} sound
   */
  eventSound (sounds) {
    console.log('superclass event : sound ');
    console.log(sounds);

  }

  /**
   * 處理材質
   * @param textures {Object} texture
   */
  eventTexture (textures) {
    console.log('superclass event : texture ');
    console.log(textures);

  }

  /**
   * 處理動畫
   * @param spines {Object} spine
   */
  eventSpine (spines) {
    console.log('superclass event : spine ');
    console.log(spines);
  }

  /**
   * 處理動畫
   * @param spines {Object} spine
   */
  eventBones (bonesFactory) {
    console.log('superclass event : eventBones ');
    console.log(bonesFactory);
  }

  /**
   * 處理物件
   * @param objs {Object} object
   */
  eventObject (objs) {
    console.log('superclass event : object ');
    console.log(objs);
  }

  /**
   * 更新畫面用
   * @param offsetTime {Number} 時間偏移量
   */
  refresh (offsetTime) {

    // 更新畫面
    let center = this.getCenter();
    if (center && center.update) {
      center.update(offsetTime);
    }
  }

  setGame (game, layerName) {
    let p = this.properties;
    p.game = game;
    if (game.layer && layerName) {
      if (Object.prototype.hasOwnProperty.call(game.layer, layerName)) {
        p.center.layer = game.layer[layerName];
      }
    }
  }

  /**
   * 場景管理
   * @return {Boolean} 是否加入成功
   */
  addToScene (game) {
    console.log(this.getName() + ' addToScene');
    let self = this;
    let properties = self.properties;
    if (properties.isInScene) {
      return false;
    }

    properties.isInScene = true;
    let center = properties.center;

    properties.currentTime = -1.0;
    function refresh (offsetTime) {

      // 保存時間與計算時間偏移量
      // is first frame
      if (properties.currentTime < 0.0) {
        properties.currentTime = 0.0;
        offsetTime = 0.0;
      } else {
        self.currentTime += offsetTime;
      }

      self.refresh(offsetTime);
    }

    properties.game = game || properties.game;
    if (properties.game) {
      properties.game.addRefresh(properties.name, refresh);
    }

    let layer = center.layer;
    if (!center || !center.objs) {
      return true;
    }

    center.objs.forEach(obj => {
      if (obj) {
        obj._game = properties.game || obj._game;
        if (obj.isInScene) {
          if (obj.addToScene) {
            obj.addToScene(layer);
          } else {
            layer.addChild(obj);
          }
        }
      }
    });

    return true;
  }

  /**
   * 場景管理
   * @return {Boolean} 是否完成將物件從場景中移出
   */
  removeFromScene () {
    console.log(this.getName() + ' removeFromScene');
    let properties = this.properties;
    if (!properties.isInScene) {
      return false;
    }

    properties.isInScene = false;
    if (properties.game) {
      properties.game.removeRefresh(properties.name);
    }

    let center = properties.center;
    if (!center || !center.objs) {
      return true;
    }

    center.objs.forEach(obj => {
      if (obj) {
        if (obj.removeFromScene) {
          obj.removeFromScene();
        } else {
          if (obj.parent) {
            obj.parent.removeChild(obj);
          }
        }
      }
    });

    return true;
  }

  /**
   * 初始化
   */
  init (config) {
    console.log('場景物件設定 : ');
    let properties = this.properties;
    let center = properties.center;
    const OBJ_TYPE$1 = OBJ_TYPE;

    if (!center || !center.objs) {
      return;
    }

    let entity = center.entity;
    let set = {};

    // 群組
    // 群組子物件名稱設定
    let setChildsName = (group) => {
      group.childList.forEach(obj => {
        if (obj) {
          obj._game = properties.game || obj._game;
          let conf = obj.conf;
          if (conf.objName) {
            group[conf.objName] = obj;
            let msg = 'set group child name"' + obj.objName + '"';
            console.log(msg);
          }

          if (OBJ_TYPE$1.GROUP === obj.type) {
            setChildsName(obj);
          }
        }
      });
    };

    // 物件設定
    center.objs.forEach(obj => {
      let msg = '';
      if (obj) {
        obj._game = properties.game || obj._game;
        if (obj.objName) {
          entity[obj.objName] = obj;
          msg = 'set entity name"' + obj.objName + '"';
          console.log(msg);
        }
        if (OBJ_TYPE$1.GROUP === obj.type) {
          setChildsName(obj);
        }
      }
    });


    if (config) {
      set = config.set || {};
    } else {
      return;
    }

    // 群組子物件初始化用
    let setupGroup = (group) => {
      group.childList.forEach(obj => {
        if (obj) {
          let conf = obj.conf;
          if (OBJ_TYPE$1.GROUP === obj.type) {
            set.setupGroup(obj);
          }
          if (conf && Object.prototype.hasOwnProperty.call(set, conf.init)) {
            console.log((obj.name || obj.objName) + ' init : ' + conf.init);
            set[conf.init](obj);
          }
        }
      });
    };

    set.setupGroup = set.setupGroup || setupGroup;

    console.log('----');
    center.objs.forEach(obj => {
      let conf;
      let msg = '';
      if (obj) {
        conf = obj.conf;
        if (OBJ_TYPE$1.GROUP === obj.type) {
          set.setupGroup(obj);
        }

        if (conf && Object.prototype.hasOwnProperty.call(set, conf.init)) {
          msg = (obj.name || obj.objName) + ' init : ' + conf.init;
          console.log(msg);
          set[conf.init](obj, conf);
        }
      }
    });
  }

  /**
   * 場景管理
   * @param finish {Function} 建立完成後需要執行的工作
   * @param config {Object} 設定
   * @return {Boolean} 是否完成申請建立場景
   */
  createScene (finish, config) {
    console.log(this.getName() + ' createScene');
    let self = this;
    let properties = self.properties;
    if (properties.isCreate) {
      if (finish) {
        finish();
      }
      return false;
    }

    let infoList = config.infoList;
    let center = properties.center;
    let eventMap = {

      // 取得原始資訊
      data: {
        proc: createRawData,
        callback: (data) => {
          if (center) {
            center.rawdata = data;
          }

          self.eventRawData(data);
        }
      },

      // 取得聲音
      sound: {
        proc: createSound,
        callback: (soundMap) => {
          if (center) {
            center.sounds = soundMap;
          }

          self.eventSound(soundMap);
        }
      },

      // 取得材質
      texture: {
        proc: createTexture,
        callback: (textures) => {
          if (center) {
            center.textures = textures;
          }

          self.eventTexture(textures);
        }
      },

      // 取得 spine 動畫
      spine: {
        proc: createSpineData,
        callback: (spines) => {
          if (center) {
            center.spines = spines;
          }

          self.eventSpine(spines);
        }
      },

      // 取得 dragon bones 動畫
      bone: {
        proc: createBonesData,
        callback: (bonesFactory) => {
          if (center) {
            center.bonesFactory = bonesFactory;
          }

          self.eventBones(bonesFactory);
        }
      },

      // 取得物件
      object: {
        proc: createObject,
        callback: (objs) => {
          if (center) {
            if (!center.objs) {
              center.objs = objs;
            } else {
              objs.forEach(obj => {
                center.objs.push(obj);
              });
            }

          }

          self.eventObject(objs);
        }
      }
    };

    // 完成
    function createFinish () {
      properties.isCreate = true;

      //--
      if (center && center.createFinish) {
        center.createFinish();
      }
    }

    if (center) {
      center.createFinish = finish;
    }

    //-----------------------------
    if (config.isObject) {
      let conf = {
        game: properties.game,
        objData: [],
        proc: [],
        callback: [],
        finish: createFinish
      };
      if (infoList && Array.isArray(infoList)) {
        infoList.forEach(info => {
          let event = eventMap[info.eventName];
          if (event && info.obj && event.proc) {
            conf.objData.push(info.obj);
            conf.proc.push(event.proc);
          } else {
            console.error('eventName  : ' + info.eventName + ' init error !');
          }
          conf.callback.push(event.callback);
        });
      } else {
        console.log('error : infoList');
      }

      loadSceneEx(conf);
    } else {
      let conf = {
        game: properties.game,
        filename: [],
        proc: [],
        callback: [],
        finish: createFinish
      };
      if (infoList && Array.isArray(infoList)) {
        infoList.forEach((info) => {
          let event = eventMap[info.eventName];
          if (event && info.filename) {
            conf.filename.push(info.filename);
          }
          conf.proc.push(event.proc);
          conf.callback.push(event.callback);
        });
      } else {
        console.log('error : infoList');
      }

      loadScene(conf);
    }

    return true;
  }

  /**
   * 場景管理
   * @return {Boolean} 是否釋放場景成功
   */
  destroyScene () {
    console.log(this.getName() + ' destroyScene');
    this.removeFromScene();
    let properties = this.properties;
    let center = properties.center;
    if (!properties.isCreate) {
      return false;
    }

    if (center) {
      if (center.bonesFactory) {
        center.bonesFactory.clear();
        center.bonesFactory = null;
      }

      if (center.sounds) {
        let sounds = center.sounds;
        destroySound(sounds);
      }
    }
    if (center.objs) {
      center.objs.forEach((obj, index) => {
        if (obj) {
          delete center.objs[index];
        }
      });
      center.objs = null;
    }

    properties.isCreate = false;

    return true;
  }
}

//import 'src/vendor';

let scene$1 = {
  utils: utils,
  Base: Base$1,
  sceneManager: sceneManager,
  loadingManager: loadingManager,
  loading: loading
};

let ui = {
  loading: uiLoading,
  base: base
};
let components = {
  game: {
    pixi: Component
  }
};
let isInit$2 = false;

function init$i (conf) {
  let config = conf || {};
  let pluginList = config.plugin || [];
  if (!Array.isArray(pluginList)) {
    pluginList = [];
  }
  console.log('nuts init ...');
  if (!globalThis.PIXI && conf.PIXI) {
    globalThis.PIXI = conf.PIXI;
  }

  return new Promise((resolve) => {
    if (isInit$2) {
      resolve('!! init finish again !!');
    }
    function checkPlugin (lib) {
      if (lib && lib.Spine) {
        if (globalThis.PIXI) {
          globalThis.PIXI.spine = lib;
        }
      }

      if (pluginList.length > 0) {
        let lib = pluginList.shift();
        if (window.System) {
          System.import(lib).then(checkPlugin);
        } else {
          checkPlugin();
        }
      } else {
        config.sceneManager = sceneManager;

        if (globalThis.PIXI) {
          init$2();
          init$3();
          init$4(config);
          init$5();
          init$8();
          init$9();
          init$6();
          init$7();
          init$a();
          init$b();

          ui.Animation = Animation;
          ui.Button = Button;
          ui.Group = Group;
          ui.Image = Image;
          ui.Number = Digit;
          ui.Scrollbar = Scrollbar;
          ui.Spine = Spine;
          ui.Bone = Bone;
          ui.Text = Text;
          ui.Particle = Particle;
          init$c(config);
        }
        init$h(config);
        init$1();
        play();

        init(config);

        // finish
        isInit$2 = true;
        resolve('!! init finish !!');
      }
    }
    checkPlugin(null);
  });
}
console.log('!!!! nuts !!!!');


// export default {
//   init,
//   updateManager,
//   Lobby,
//   game,
//   scene,
//   ui,
//   components,
//   client
// };

export { Lobby, client, components, game, init$i as init, scene$1 as scene, ui, updateManager };
//# sourceMappingURL=nuts.js.map
