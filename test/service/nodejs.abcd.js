'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lightFormat = _interopDefault(require('date-fns/lightFormat'));
var uws = _interopDefault(require('uWebSockets.js'));
var pino = _interopDefault(require('pino'));
var fs = _interopDefault(require('fs'));
var jsyaml = _interopDefault(require('js-yaml'));
var path = _interopDefault(require('path'));
var avro = _interopDefault(require('avsc'));
var grunt = _interopDefault(require('grunt'));
var hash = _interopDefault(require('hash-it'));
var io = _interopDefault(require('socket.io-client'));
var WebSocket = _interopDefault(require('ws'));
var protobuf = _interopDefault(require('protobufjs'));

var GAME;
(function (GAME) {
    GAME["REQUEST"] = "request";
    GAME["RESPONSE"] = "response";
})(GAME || (GAME = {}));
var logger = {
    error: function () { },
    info: function () { }
};
var typeCache = {};
/**
 * 共用命令清單
 */
var commonSchema = {};
function init(config, log) {
    logger = log.child({ module: 'schema manager' });
    logger.info('init');
    if (config) {
        preload(config);
    }
}
function getCurrent(info) {
    var group = null;
    var current = null;
    if (info.group) {
        if (typeCache[info.group]) {
            group = typeCache[info.group];
        }
        else {
            group = {};
            typeCache[info.group] = group;
        }
    }
    var object = null;
    if (info.name) {
        if (group[info.name]) {
            object = group[info.name];
        }
        else {
            object = {};
            object.types = {};
            object.schemas = {};
            group[info.name] = object;
        }
    }
    if (info.sub) {
        current = object[info.sub];
        if (!current) {
            current = {};
            current.types = {};
            current.schemas = {};
            object[info.sub] = current;
        }
    }
    else {
        current = object;
    }
    return current;
}
function save(info, data) {
    var id = null;
    var value = data;
    if (typeof data === 'string') {
        if (data[0] === '{') {
            try {
                value = JSON.parse(data);
                var ids = Object.getOwnPropertyNames(value);
                if (ids.length === 0) {
                    return id;
                }
            }
            catch (err) {
                logger.error(err);
            }
        }
        else {
            return id;
        }
    }
    try {
        var type = avro.Type.forValue(value);
        // const schema = JSON.stringify(type.schema(), null, 2);
        var schema = JSON.stringify(type.schema());
        var filename = "" + hash(type);
        id = filename;
        var current = getCurrent(info);
        if (current.types) {
            current.types[filename] = type;
        }
        if (current.schemas) {
            current.schemas[filename] = schema;
        }
        var dir = 'schema';
        if (info.group) {
            dir += "/" + info.group;
        }
        if (info.name) {
            dir += "/" + info.name;
        }
        if (info.sub) {
            dir += "/" + info.sub;
        }
        // 是否存檔
        if (process.env.APP_ENABLE_SAVEFILE) {
            // 確認是否有資料夾
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                    recursive: true
                });
            }
            filename = dir + "/" + filename + ".json";
            console.log('[save schema]' + filename);
            //  fs.writeFileSync(filename, JSON.stringify(schema), 'utf8');
            fs.writeFileSync(filename, schema, 'utf8');
        }
        if (info.group === 'common') {
            commonSchema[info.name] = current;
        }
    }
    catch (e) {
        console.error('[schemaManager save]');
        console.error(e);
    }
    return id;
}
function preload(config) {
    logger.info('preload');
    var list = config.preloads || [];
    list.forEach(function (info) {
        load(info);
    });
    //  console.log(commonSchema);
}
function load(info) {
    var srcDir = null;
    var filenames = null;
    var current = null;
    function loadSchema(filename) {
        console.log("filename : " + filename);
        try {
            var schema = fs.readFileSync(filename, 'utf8');
            var obj = JSON.parse(schema);
            var fmt = path.parse(filename);
            var id = fmt.name;
            var type = avro.Type.forSchema(obj);
            current.types[id] = type;
            current.schemas[id] = schema;
        }
        catch (err) {
            logger.error(err);
        }
    }
    current = getCurrent(info);
    current.schemas = {};
    current.types = {};
    srcDir = 'schema';
    if (info.group) {
        srcDir += "/" + info.group;
    }
    if (info.name) {
        srcDir += "/" + info.name;
    }
    if (info.sub) {
        srcDir += "/" + info.sub;
    }
    filenames = grunt.file.expand(srcDir + "/*.json");
    filenames.forEach(loadSchema);
    if (info.isCommon) {
        commonSchema[info.name] = current;
    }
    return current;
}
function checkBuffer(types, buf, config) {
    if (config === void 0) { config = {}; }
    var data = null;
    if (types) {
        console.log('[checkBuffer types]');
        var idList = Object.getOwnPropertyNames(types);
        console.log(idList);
        for (var i = 0; i < idList.length; i += 1) {
            var id = idList[i];
            var type = types[id];
            try {
                console.log("[buf]" + id);
                data = type.fromBuffer(buf);
                if (config.useJSON && (typeof data !== 'string')) {
                    data = JSON.stringify(data);
                }
                console.log("checkBuffer id is : " + id);
                return data;
            }
            catch (e) {
                console.log("[checkBuffer error id]" + id);
                //        console.error(e);
            }
        }
        /*
        idList.some(id => {
          const type = types[id];
          try {
            data = type.fromBuffer(buf);
            if(config.useJSON && (typeof data !== 'string')) {
              data = JSON.stringify(data);
            }
            return true;
          } catch (e) {
            return false;
          }
        });
        */
    }
    return data;
}
function checkObject(types, obj) {
    var format = {
        buf: null
    };
    if (!obj) {
        return format;
    }
    if (!types) {
        return format;
    }
    try {
        console.log('[checkObject types]');
        //    console.log(types);
        var idList = Object.getOwnPropertyNames(types);
        console.log(idList);
        for (var i = idList.length - 1; i >= 0; i -= 1) {
            var id = idList[i];
            console.log("check type id :" + id);
            var type = types[id];
            //      console.log(type);
            var state = type.isValid(obj, { noUndeclaredFields: true });
            if (state) {
                console.log("checkObject type id : " + id);
                format.buf = type.toBuffer(obj);
                format.id = id;
                return format;
                ;
            }
        }
        /*
        idList.some(id => {
          console.log(`check id:${id}`);
          const type = types[id];
          //      console.log(type);
          if(type.isValid(obj, {
            noUndeclaredFields:true
            })) {
            console.log(`schema id : ${id}`);
            format.buf = type.toBuffer(obj);
            format.id = id;
            return true;
          } else {
            return false;
          }
        });
        */
    }
    catch (e) {
        logger.error('checkObject');
        console.error(e);
    }
    return format;
}
function checkData(types, data, info, updateSchema) {
    var format = {
        buf: null
    };
    var obj = data;
    if (!obj) {
        return format;
    }
    if (typeof obj === 'string') {
        if (obj[0] === '{') {
            try {
                obj = JSON.parse(obj);
                format = checkObject(types, obj);
            }
            catch (err) {
                logger.error(err);
            }
        }
    }
    else {
        format = checkObject(types, obj);
    }
    if (!format.buf) {
        var id = save(info, obj);
        if (id) {
            info.schemas = [id];
            updateSchema(info);
            var current = getCurrent(info);
            format = checkObject(current.types, obj);
        }
    }
    return format;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var namespace = "game.agent.avro";
var name = "LoginRequest";
var type = "record";
var doc = "登入命令 (傳送)";
var fields = [
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "認證碼",
		name: "fingerprint",
		type: "string"
	},
	{
		doc: "指紋",
		name: "token",
		type: "string"
	},
	{
		doc: "視訊用",
		name: "tablekey",
		type: [
			"null",
			"string"
		],
		"default": null
	}
];
var LoginRequest = {
	namespace: namespace,
	name: name,
	type: type,
	doc: doc,
	fields: fields
};

var namespace$1 = "game.agent.avro";
var name$1 = "LoginResponseGti";
var type$1 = "record";
var doc$1 = "登入命令 (接收)";
var fields$1 = [
	{
		doc: "玩家資訊 (目前沒使用)",
		name: "userInfo",
		type: [
			"null",
			{
				name: "UserInfo",
				type: "record",
				fields: [
					{
						name: "nickname",
						type: "string"
					},
					{
						name: "coin",
						type: [
							"null",
							"int"
						],
						"default": null
					}
				]
			}
		],
		"default": null
	},
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "認證碼",
		name: "token",
		type: [
			"null",
			"string"
		],
		"default": null
	},
	{
		doc: "結果代碼",
		name: "resultCode",
		type: "int"
	}
];
var LoginResponseGti = {
	namespace: namespace$1,
	name: name$1,
	type: type$1,
	doc: doc$1,
	fields: fields$1
};

var namespace$2 = "game.agent.avro";
var name$2 = "LoginResponseVideo";
var type$2 = "record";
var doc$2 = "登入命令 (接收)";
var fields$2 = [
	{
		name: "resultCode",
		type: "int"
	},
	{
		name: "loginKey",
		type: "string"
	},
	{
		name: "userInfo",
		type: {
			type: "record",
			fields: [
				{
					name: "id",
					type: "string"
				},
				{
					name: "platform",
					type: "string"
				},
				{
					name: "currency",
					type: "string"
				},
				{
					name: "userID",
					type: "string"
				},
				{
					name: "nickname",
					type: "string"
				},
				{
					name: "house",
					type: "string"
				},
				{
					name: "agent",
					type: "string"
				},
				{
					name: "gameData",
					type: {
						type: "record",
						fields: [
							{
								name: "roomID",
								type: "string"
							}
						]
					}
				},
				{
					name: "aboId",
					type: "string"
				}
			]
		}
	},
	{
		name: "funcIndex",
		type: "int"
	}
];
var LoginResponseVideo = {
	namespace: namespace$2,
	name: name$2,
	type: type$2,
	doc: doc$2,
	fields: fields$2
};

var typeRequest = avro.Type.forSchema(LoginRequest);
var typeResponseGti = avro.Type.forSchema(LoginResponseGti);
var typeResponseVideo = avro.Type.forSchema(LoginResponseVideo);

var namespace$3 = "game.agent.avro";
var name$3 = "InGameRequest";
var type$3 = "record";
var doc$3 = "進入遊戲 (傳送)";
var fields$3 = [
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "名稱",
		name: "name",
		type: "string"
	},
	{
		doc: "群組",
		name: "group",
		type: "string"
	},
	{
		doc: "遊戲代碼",
		name: "gid",
		type: "string"
	}
];
var InGameRequest = {
	namespace: namespace$3,
	name: name$3,
	type: type$3,
	doc: doc$3,
	fields: fields$3
};

var namespace$4 = "game.agent.avro";
var name$4 = "InGameResponse";
var type$4 = "record";
var doc$4 = "進入遊戲 (接收)";
var fields$4 = [
	{
		doc: "遊戲代碼",
		name: "gid",
		type: "string"
	},
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		name: "updateSchemaList",
		type: {
			type: "array",
			items: {
				name: "UpdateSchemaRequest",
				type: "record",
				fields: [
					{
						doc: "名稱",
						name: "name",
						type: "string"
					},
					{
						doc: "群組",
						name: "group",
						type: "string"
					},
					{
						doc: "訂閱",
						name: "sub",
						type: {
							type: "enum",
							symbols: [
								"request",
								"response"
							]
						}
					},
					{
						name: "schemas",
						type: {
							type: "array",
							items: "string"
						}
					}
				]
			}
		}
	},
	{
		name: "resultCode",
		type: "int"
	}
];
var InGameResponse = {
	namespace: namespace$4,
	name: name$4,
	type: type$4,
	doc: doc$4,
	fields: fields$4
};

var typeRequest$1 = avro.Type.forSchema(InGameRequest);
var typeResponse = avro.Type.forSchema(InGameResponse);

var namespace$5 = "game.agent.avro";
var name$5 = "ToGameRequest";
var type$5 = "record";
var doc$5 = "遊戲命令 (傳送)";
var fields$5 = [
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "遊戲代碼",
		name: "gid",
		type: "string"
	},
	{
		doc: "封包",
		name: "packet",
		type: {
			name: "packet",
			type: "record",
			fields: [
				{
					doc: "命令",
					name: "command",
					type: [
						"string",
						"null"
					]
				},
				{
					doc: "資料",
					name: "data",
					type: [
						"bytes",
						"string"
					]
				}
			]
		}
	}
];
var ToGameRequest = {
	namespace: namespace$5,
	name: name$5,
	type: type$5,
	doc: doc$5,
	fields: fields$5
};

var namespace$6 = "game.agent.avro";
var name$6 = "ToGameResponse";
var type$6 = "record";
var doc$6 = "遊戲命令 (接收)";
var fields$6 = [
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "遊戲代碼",
		name: "gid",
		type: "string"
	},
	{
		doc: "結果代碼",
		name: "resultCode",
		type: "int"
	},
	{
		doc: "資料",
		name: "packet",
		type: [
			"null",
			"bytes"
		]
	},
	{
		name: "schemas",
		doc: "資料描述",
		type: {
			type: "array",
			items: {
				name: "schema",
				type: "record",
				fields: [
					{
						name: "name",
						type: "string"
					},
					{
						name: "hash",
						type: "string"
					}
				]
			}
		}
	}
];
var ToGameResponse = {
	namespace: namespace$6,
	name: name$6,
	type: type$6,
	doc: doc$6,
	fields: fields$6
};

var typeRequest$2 = avro.Type.forSchema(ToGameRequest);
var typeResponse$1 = avro.Type.forSchema(ToGameResponse);

var namespace$7 = "game.agent.avro";
var name$7 = "BroadcastResponse";
var doc$7 = "廣播用 (接收)";
var type$7 = "record";
var fields$7 = [
	{
		doc: "種類",
		name: "proto",
		type: "string"
	},
	{
		doc: "內容",
		name: "json",
		type: "string"
	}
];
var BroadcastResponse = {
	namespace: namespace$7,
	name: name$7,
	doc: doc$7,
	type: type$7,
	fields: fields$7
};

var typeResponse$2 = avro.Type.forSchema(BroadcastResponse);

var logger$1 = {
    error: function () { },
    info: function () { }
};
var GAME$1 = GAME;
/**
 * 共用命令清單
 */
var commonSchema$1 = null;
function init$1(config) {
    logger$1 = config.logger.child({ proxy: 'ioGti' });
    logger$1.info('init');
    commonSchema$1 = commonSchema;
    var procList = [
        // 傳送遊戲命令
        {
            name: 'toGame',
            type: typeRequest$2,
            func: toGame
        },
        // 登入命令
        {
            name: 'login',
            type: typeRequest,
            func: login
        },
        // 進入遊戲命令
        {
            name: 'inGame',
            type: typeRequest$1,
            func: inGame
        }
    ];
    return procList;
}
//====================================================
function login(ws, data) {
    return __awaiter(this, void 0, void 0, function () {
        var funcIndex, socketio, info;
        return __generator(this, function (_a) {
            funcIndex = data.funcIndex;
            delete data.funcIndex;
            socketio = ws.socketio;
            if (socketio) {
                if (!socketio.curLoginData) {
                    socketio.curLoginData = data;
                    socketio.loginFuncIndex = funcIndex;
                    info = ws.info;
                    info.index = info.generateIndex();
                    console.log("index:" + info.index + " is " + data.token);
                    socketio.emit('login', data);
                }
                else {
                    logger$1.error('重複收到登入命令');
                }
            }
            else {
                logger$1.error('disconnect');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function inGame(ws, data) {
    return __awaiter(this, void 0, void 0, function () {
        var socketio, info, funcIndex;
        return __generator(this, function (_a) {
            socketio = ws.socketio;
            info = ws.info;
            funcIndex = data.funcIndex;
            if ((data.group.length > 32) || (data.name.length > 64)) ;
            delete data.funcIndex;
            info.game = data;
            if (socketio) {
                if (!socketio.curInGameData) {
                    socketio.curInGameData = data;
                    info.inGameFuncIndex = funcIndex;
                    socketio.emit('inGame', data);
                }
                else {
                    logger$1.error('重複收到進入遊戲命令');
                }
            }
            else {
                logger$1.error('disconnect');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function toGame(ws, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var game, buf, id, info, types;
        return __generator(this, function (_b) {
            if ((_a = data === null || data === void 0 ? void 0 : data.packet) === null || _a === void 0 ? void 0 : _a.data) {
                game = ws.info.game;
                buf = data.packet.data;
                if (buf) {
                    if (typeof buf === 'string') {
                        game.sub = GAME$1.REQUEST;
                        id = save(game, buf);
                        if (id) {
                            info = {
                                name: game.name,
                                group: game.group,
                                sub: game.sub,
                                schemas: [id]
                            };
                            ws.updateSchema(info);
                        }
                    }
                    else if (Buffer.isBuffer(buf)) {
                        types = ws.info.typesRequest;
                        data.packet.data = checkBuffer(types, buf, {
                            useJSON: true
                        });
                    }
                }
            }
            if (ws.socketio) {
                ws.socketio.emit('toGame', data);
            }
            else {
                logger$1.error('disconnect');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function close(ws) {
    if (ws && ws.socketio) {
        ws.socketio.close();
        delete ws.socketio;
    }
}
//====================================================
function open(ws, message) {
    var socketio = new io(process.env.PROXY_SERVER, {
        forceNew: false,
        reconnection: false,
        transports: ['websocket']
    });
    ws.socketio = socketio;
    ws.isConnected = false;
    socketio.on('connect', function () {
        logger$1.info('connect');
        ws.isConnected = true;
        if (ws.firstBuf) {
            message(ws, null);
        }
    });
    socketio.on('disconnect', function () {
        logger$1.info('disconnect');
        ws.isConnected = false;
        delete ws.socketio;
        if (ws.close) {
            ws.close();
        }
    });
    socketio.on('connect_error', function (error) {
        logger$1.info('connect_error');
        console.log(error);
    });
    socketio.on('error', function (error) {
        logger$1.info('error');
        console.log(error);
    });
    socketio.on('connect_timeout', function () {
        logger$1.info('connect_timeout');
        if (ws.close) {
            ws.close();
        }
    });
    socketio.on('login', function (data) {
        var info = ws.info;
        logger$1.info(info.index + "[result]login");
        var funcIndex = -1;
        if (socketio.curLoginData) {
            socketio.curLoginData = null;
            funcIndex = socketio.loginFuncIndex;
            delete socketio.loginFuncIndex;
        }
        if (data) {
            data.funcIndex = funcIndex;
            if (data.userData) {
                delete data.userData;
            }
            var check = true;
            if (typeResponseGti.isValid(data)) {
                var buffer = typeResponseGti.toBuffer(data);
                ws.send(buffer);
            }
            else {
                check = false;
                logger$1.error('格式錯誤');
                console.log(data);
            }
            if (check) {
                info.user = data.userInfo;
            }
        }
        else {
            logger$1.error('login data is undefined');
        }
    });
    socketio.on('inGame', function (data) {
        var info = ws.info;
        logger$1.info(info.index + "[result]inGame");
        var funcIndex = -1;
        if (socketio.curInGameData) {
            socketio.curInGameData = null;
            funcIndex = info.inGameFuncIndex;
            delete info.inGameFuncIndex;
        }
        var type = typeResponse;
        if (data) {
            delete data.packet;
            data.funcIndex = funcIndex;
            var current = null;
            var schemas = null;
            var updateSchemaList = [];
            data.updateSchemaList = updateSchemaList;
            // 請求
            info.game.sub = GAME$1.REQUEST;
            current = getCurrent(info.game);
            schemas = current.schemas;
            info.typesRequest = current.types;
            schemas = schemas && Object.getOwnPropertyNames(schemas);
            if (schemas && (schemas.length > 0)) {
                var obj = {
                    name: info.game.name,
                    group: info.game.group,
                    sub: GAME$1.REQUEST,
                    schemas: schemas
                };
                updateSchemaList.push(obj);
            }
            // 回應
            info.game.sub = GAME$1.RESPONSE;
            current = getCurrent(info.game);
            info.typesResponse = current.types;
            schemas = current.schemas;
            schemas = schemas && Object.getOwnPropertyNames(schemas);
            if (schemas && (schemas.length > 0)) {
                var obj = {
                    name: info.game.name,
                    group: info.game.group,
                    sub: GAME$1.RESPONSE,
                    schemas: schemas
                };
                updateSchemaList.push(obj);
            }
            // 主封包
            current = getCurrent({
                group: info.game.group,
                name: 'packet',
                sub: GAME$1.RESPONSE
            });
            schemas = current.schemas;
            schemas = schemas && Object.getOwnPropertyNames(schemas);
            if (schemas && (schemas.length > 0)) {
                var obj = {
                    group: info.game.group,
                    name: 'packet',
                    sub: GAME$1.RESPONSE,
                    schemas: schemas
                };
                updateSchemaList.push(obj);
            }
            // JP 資訊
            if (commonSchema$1.jackpot && commonSchema$1.jackpot.schemas) {
                schemas = Object.getOwnPropertyNames(commonSchema$1.jackpot.schemas);
                if (schemas.length > 0) {
                    var obj = {
                        name: 'jackpot',
                        group: 'common',
                        sub: GAME$1.RESPONSE,
                        schemas: schemas
                    };
                    updateSchemaList.push(obj);
                }
            }
            // 遊戲資訊
            if (commonSchema$1.info && commonSchema$1.info.schemas) {
                schemas = Object.getOwnPropertyNames(commonSchema$1.info.schemas);
                if (schemas.length > 0) {
                    var obj = {
                        name: 'info',
                        group: 'common',
                        sub: GAME$1.RESPONSE,
                        schemas: schemas
                    };
                    updateSchemaList.push(obj);
                }
            }
            // 遊戲設定
            if (commonSchema$1.setting && commonSchema$1.setting.schemas) {
                schemas = Object.getOwnPropertyNames(commonSchema$1.setting.schemas);
                if (schemas.length > 0) {
                    var obj = {
                        name: 'setting',
                        group: 'common',
                        sub: GAME$1.RESPONSE,
                        schemas: schemas
                    };
                    updateSchemaList.push(obj);
                }
            }
            console.log(data);
            if (type.isValid(data, { noUndeclaredFields: true })) {
                var buffer = type.toBuffer(data);
                ws.send(buffer);
            }
            else {
                logger$1.error('格式錯誤');
            }
        }
        else {
            logger$1.error('inGame data is undefined');
        }
    });
    socketio.on('toGame', function (data) {
        var info = ws.info;
        logger$1.info(info.index + "[result]toGame");
        var game = info.game;
        var type = typeResponse$1;
        if (!game) {
            logger$1.error('未執行 inGame 命令');
            return;
        }
        console.log(data);
        var packet = data.packet;
        data.funcIndex = -1;
        data.packet = null;
        data.schemas = [];
        if (type.isValid(data)) {
            var format_1 = null;
            var names = [];
            if (packet) {
                // 處理子封包
                names = Object.getOwnPropertyNames(packet);
                names.forEach(function (name) {
                    console.log("packet." + name);
                    var obj = packet[name];
                    if (typeof obj === 'string') {
                        if (obj[0] !== '{') {
                            return true;
                        }
                    }
                    var info = {
                        group: game.group,
                        name: name,
                        sub: GAME$1.RESPONSE
                    };
                    if (name === 'data') {
                        info.name = game.name;
                    }
                    var types = getCurrent(info).types;
                    format_1 = checkData(types, obj, info, ws.updateSchema);
                    if (format_1.buf) {
                        packet[name] = format_1.buf;
                        data.schemas.push({
                            name: name,
                            hash: format_1.id
                        });
                    }
                });
                // 處理主要封包
                var obj = packet;
                var info_1 = {
                    group: game.group,
                    name: 'packet',
                    sub: GAME$1.RESPONSE
                };
                var types = getCurrent(info_1).types;
                format_1 = checkData(types, obj, info_1, ws.updateSchema);
                if (format_1.buf) {
                    data.packet = format_1.buf;
                    data.schemas.push({
                        name: 'packet',
                        hash: format_1.id
                    });
                }
            }
            //--------------------------------------------
            // 傳送資料
            var buffer = type.toBuffer(data);
            ws.send(buffer);
        }
        else {
            logger$1.error('格式錯誤');
            console.log(data);
        }
    });
    socketio.on('broadCastMsg', function (data) {
        var info = ws.info;
        logger$1.info(info.index + "[result]broadcast");
        var type = typeResponse$2;
        if (typeof data === 'string') {
            var cmd = JSON.parse(data);
            if (type.isValid(cmd, { noUndeclaredFields: true })) {
                var buffer = type.toBuffer(cmd);
                ws.send(buffer);
            }
            else {
                logger$1.error('廣播封包格式不正確');
            }
        }
        else {
            logger$1.error('廣播封包格式不正確 (不是 json 字串)');
        }
    });
    logger$1.info('open');
}

var socketioGti = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$1,
  login: login,
  inGame: inGame,
  toGame: toGame,
  close: close,
  open: open
});

var nested = {
	Game: {
		nested: {
			Agent: {
				nested: {
					ActionType: {
						values: {
							LOGIN: 0,
							INGAME: 1,
							TOGAME: 2,
							BROADCAST: 3
						}
					},
					CheckAction: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							}
						},
						reserved: [
							[
								2,
								2
							]
						]
					},
					BroadcastResponse: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							format: {
								type: "CustomFormat",
								id: 2
							},
							proto: {
								type: "string",
								id: 3
							},
							json: {
								type: "string",
								id: 4
							},
							data: {
								type: "bytes",
								id: 5
							}
						},
						reserved: [
							[
								6,
								6
							]
						]
					},
					LoginRequest: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 3
							},
							token: {
								type: "string",
								id: 4
							},
							tablekey: {
								type: "string",
								id: 5
							},
							fingerprint: {
								type: "string",
								id: 6
							},
							formatBroadcast: {
								type: "CustomFormat",
								id: 7
							}
						},
						reserved: [
							[
								2,
								2
							]
						]
					},
					LoginResponse: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 3
							},
							userInfo: {
								type: "UserInfo",
								id: 4
							},
							token: {
								type: "string",
								id: 5
							},
							resultCode: {
								type: "int32",
								id: 7
							}
						},
						reserved: [
							[
								2,
								2
							],
							[
								6,
								6
							]
						]
					},
					UserInfo: {
						fields: {
							nickname: {
								type: "string",
								id: 1
							},
							coin: {
								type: "int64",
								id: 3
							}
						},
						reserved: [
							[
								2,
								2
							],
							[
								6,
								6
							]
						]
					},
					InGameRequest: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 3
							},
							gid: {
								type: "string",
								id: 4
							},
							name: {
								type: "string",
								id: 6
							},
							group: {
								type: "string",
								id: 7
							}
						},
						reserved: [
							[
								2,
								2
							],
							[
								5,
								5
							]
						]
					},
					Custom: {
						fields: {
							name: {
								type: "string",
								id: 1
							}
						}
					},
					InGameResponse: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 3
							},
							gid: {
								type: "string",
								id: 4
							},
							resultCode: {
								type: "int32",
								id: 5
							}
						},
						reserved: [
							[
								2,
								2
							]
						]
					},
					CustomFormat: {
						values: {
							"JSON": 0,
							RAW: 1,
							PROTOBUF: 2
						}
					},
					CustomType: {
						values: {
							A: 0,
							B: 1
						}
					},
					ToGameRequest: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 3
							},
							gid: {
								type: "string",
								id: 4
							},
							packet: {
								type: "GameRequest",
								id: 5
							}
						},
						reserved: [
							[
								2,
								2
							],
							[
								6,
								6
							]
						]
					},
					GameRequest: {
						fields: {
							format: {
								type: "CustomFormat",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 2
							},
							command: {
								type: "string",
								id: 3
							},
							data: {
								type: "bytes",
								id: 4
							}
						},
						reserved: [
							[
								6,
								6
							]
						]
					},
					ToGameResponse: {
						fields: {
							actionType: {
								type: "ActionType",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 3
							},
							gid: {
								type: "string",
								id: 4
							},
							resultCode: {
								type: "int32",
								id: 5
							},
							packet: {
								type: "GameResponse",
								id: 7
							}
						},
						reserved: [
							[
								2,
								2
							],
							[
								6,
								6
							]
						]
					},
					GameResponse: {
						fields: {
							format: {
								type: "CustomFormat",
								id: 1
							},
							funcIndex: {
								type: "int32",
								id: 2
							},
							command: {
								type: "string",
								id: 3
							},
							data: {
								type: "bytes",
								id: 4
							},
							jackpot: {
								type: "Jackpot",
								id: 6
							},
							info: {
								type: "Info",
								id: 7
							},
							setting: {
								type: "Setting",
								id: 8
							},
							errorCode: {
								type: "string",
								id: 9
							}
						},
						reserved: [
							[
								5,
								5
							]
						]
					},
					Jackpot: {
						fields: {
							format: {
								type: "CustomFormat",
								id: 1
							},
							data: {
								type: "bytes",
								id: 3
							}
						},
						reserved: [
							[
								2,
								2
							]
						]
					},
					Setting: {
						fields: {
							format: {
								type: "CustomFormat",
								id: 1
							},
							data: {
								type: "bytes",
								id: 3
							}
						},
						reserved: [
							[
								2,
								2
							]
						]
					},
					Info: {
						fields: {
							format: {
								type: "CustomFormat",
								id: 1
							},
							data: {
								type: "bytes",
								id: 3
							}
						},
						reserved: [
							[
								2,
								2
							]
						]
					}
				}
			}
		}
	}
};
var protocol = {
	nested: nested
};

var logger$2 = {
    error: function () { },
    info: function () { }
};
var utf8Decoder = null;
var utf8Encoder = null;
var GAME$2 = GAME;
var Agent = null;
// 命令種類
var ActionType = null;
// 自定義的格式
var CustomFormat = null;
// 登入
var LoginRequest$1 = null;
var LoginResponse = null;
// 進入遊戲
var InGameRequest$1 = null;
var InGameResponse$1 = null;
// 遊戲資料
var ToGameRequest$1 = null;
var ToGameResponse$1 = null;
// 廣播
var BroadcastResponse$1 = null;
//---------------------------------------------------
function init$2(config) {
    logger$2 = config.logger.child({ proxy: 'wsGti' });
    logger$2.info('init');
    utf8Decoder = new TextDecoder();
    utf8Encoder = new TextEncoder();
    var root = protobuf.Root.fromJSON(protocol);
    Agent = root.Game.Agent;
    // 命令種類
    ActionType = Agent.ActionType;
    // 自定義的格式
    CustomFormat = Agent.CustomFormat;
    LoginRequest$1 = Agent.LoginRequest;
    LoginResponse = Agent.LoginResponse;
    InGameRequest$1 = Agent.InGameRequest;
    InGameResponse$1 = Agent.InGameResponse;
    ToGameRequest$1 = Agent.ToGameRequest;
    ToGameResponse$1 = Agent.ToGameResponse;
    BroadcastResponse$1 = Agent.BroadcastResponse;
    // 設定遊戲命令
    var procList = [
        // 傳送遊戲命令
        {
            name: 'toGame',
            type: typeRequest$2,
            func: toGame$1
        },
        // 登入命令
        {
            name: 'login',
            type: typeRequest,
            func: login$1
        },
        // 進入遊戲命令
        {
            name: 'inGame',
            type: typeRequest$1,
            func: inGame$1
        }
    ];
    return procList;
}
//====================================================
function sendBroadcast(ws, data) {
    var info = ws.info;
    logger$2.info(info.index + "[send]broadcast");
    var type = typeResponse$2;
    if (type.isValid(data, { noUndeclaredFields: true })) {
        var buffer = type.toBuffer(data);
        ws.send(buffer);
    }
    else {
        logger$2.error('格式錯誤');
        console.log(data);
    }
}
//====================================================
function sendLogin(ws, data) {
    var info = ws.info;
    logger$2.info(info.index + "[send]login");
    data.funcIndex =  data.funcIndex;
    delete data.actionType;
    if (typeResponseGti.isValid(data, { noUndeclaredFields: true })) {
        var buffer = typeResponseGti.toBuffer(data);
        ws.send(buffer);
        info.user = data.userInfo;
    }
    else {
        logger$2.error('格式錯誤');
        console.log(data);
    }
}
//====================================================
function login$1(ws, data) {
    return __awaiter(this, void 0, void 0, function () {
        var service, err, value, buffer, info;
        return __generator(this, function (_a) {
            service = ws.service;
            if (!service) {
                logger$2.error('service is undefined');
                return [2 /*return*/];
            }
            if (!ws.curLoginData) {
                ws.curLoginData = data;
                data.actionType = ActionType.LOGIN;
                err = LoginRequest$1.verify(data);
                if (err) {
                    logger$2.error(err);
                }
                else {
                    value = LoginRequest$1.create(data);
                    buffer = LoginRequest$1.encode(value).finish();
                    service.send(buffer);
                    info = ws.info;
                    info.index = info.generateIndex();
                    console.log("index:" + info.index + " is " + data.token);
                }
            }
            else {
                logger$2.error('重複收到登入命令');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function sendInGame(ws, data) {
    var info = ws.info;
    logger$2.info(info.index + "[send]inGame");
    if (!info.game) {
        logger$2.error('info.game is null');
        return;
    }
    data.funcIndex =  data.funcIndex;
    delete data.actionType;
    var current = null;
    var schemas = null;
    var updateSchemaList = [];
    data.updateSchemaList = updateSchemaList;
    // 請求
    info.game.sub = GAME$2.REQUEST;
    current = getCurrent(info.game);
    schemas = current.schemas;
    info.typesRequest = current.types;
    schemas = schemas && Object.getOwnPropertyNames(schemas);
    if (schemas && (schemas.length > 0)) {
        var obj = {
            name: info.game.name,
            group: info.game.group,
            sub: GAME$2.REQUEST,
            schemas: schemas
        };
        updateSchemaList.push(obj);
    }
    // 回應
    info.game.sub = GAME$2.RESPONSE;
    current = getCurrent(info.game);
    info.typesResponse = current.types;
    schemas = current.schemas;
    schemas = schemas && Object.getOwnPropertyNames(schemas);
    if (schemas && (schemas.length > 0)) {
        var obj = {
            name: info.game.name,
            group: info.game.group,
            sub: GAME$2.RESPONSE,
            schemas: schemas
        };
        updateSchemaList.push(obj);
    }
    var nameList = [
        'packet',
        'jackpot',
        'info',
        'setting' // 遊戲設定
    ];
    nameList.forEach(function (name) {
        current = getCurrent({
            group: info.game.group,
            name: name,
            sub: GAME$2.RESPONSE
        });
        schemas = current.schemas;
        schemas = schemas && Object.getOwnPropertyNames(schemas);
        if (schemas && (schemas.length > 0)) {
            var obj = {
                group: info.game.group,
                name: name,
                sub: GAME$2.RESPONSE,
                schemas: schemas
            };
            updateSchemaList.push(obj);
        }
    });
    console.log(data);
    if (typeResponse.isValid(data, { noUndeclaredFields: true })) {
        var buffer = typeResponse.toBuffer(data);
        ws.send(buffer);
    }
    else {
        logger$2.error('格式錯誤');
        console.log(data);
    }
}
//====================================================
function inGame$1(ws, data) {
    return __awaiter(this, void 0, void 0, function () {
        var service, info, err, value, buffer;
        return __generator(this, function (_a) {
            service = ws.service;
            if (!service) {
                logger$2.error('service is undefined');
                return [2 /*return*/];
            }
            info = ws.info;
            info.game = data;
            data.actionType = ActionType.INGAME;
            err = InGameRequest$1.verify(data);
            if (err) {
                logger$2.error(err);
            }
            else {
                value = InGameRequest$1.create(data);
                buffer = InGameRequest$1.encode(value).finish();
                service.send(buffer);
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function sendToGame(ws, data) {
    var _a, _b, _c, _d, _e, _f, _g;
    var info = ws.info;
    logger$2.info(info.index + "[send]toGame");
    var game = info.game;
    if (!game) {
        logger$2.error('未執行 inGame 命令');
        return;
    }
    console.log(data);
    var packet = data.packet;
    data.funcIndex = -1;
    data.packet = null;
    data.schemas = [];
    delete data.actionType;
    var type = typeResponse$1;
    if (type.isValid(data, { noUndeclaredFields: true })) {
        var format_1 = null;
        var names = [];
        if (packet) {
            // JP
            if (((_b = (_a = packet.jackpot) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length) && (packet.jackpot.data.length > 0)) {
                switch (packet.jackpot.format) {
                    case CustomFormat.JSON:
                        packet.jackpot = utf8Decoder.decode(packet.jackpot.data);
                        break;
                }
            }
            // setting
            if (((_d = (_c = packet.setting) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.length) && (packet.setting.data.length > 0)) {
                switch (packet.setting.format) {
                    case CustomFormat.JSON:
                        packet.setting = utf8Decoder.decode(packet.setting.data);
                        break;
                }
            }
            // info
            if (((_f = (_e = packet.info) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.length) && (packet.info.data.length > 0)) {
                switch (packet.info.format) {
                    case CustomFormat.JSON:
                        packet.info = utf8Decoder.decode(packet.info.data);
                        break;
                }
            }
            // data
            if (((_g = packet.data) === null || _g === void 0 ? void 0 : _g.length) && (packet.data.length > 0)) {
                switch (packet.format) {
                    case CustomFormat.JSON:
                        packet.data = utf8Decoder.decode(packet.data);
                        break;
                }
            }
            // 處理子封包
            names = Object.getOwnPropertyNames(packet);
            names.forEach(function (name) {
                console.log("packet." + name);
                var obj = packet[name];
                if (typeof obj === 'string') {
                    if (obj[0] !== '{') {
                        return true;
                    }
                }
                var info = {
                    group: game.group,
                    name: name,
                    sub: GAME$2.RESPONSE
                };
                if (name === 'data') {
                    info.name = game.name;
                }
                var types = getCurrent(info).types;
                format_1 = checkData(types, obj, info, ws.updateSchema);
                if (format_1.buf) {
                    packet[name] = format_1.buf;
                    data.schemas.push({
                        name: name,
                        hash: format_1.id
                    });
                }
            });
            // 處理主要封包
            var obj = packet;
            var info_1 = {
                group: game.group,
                name: 'packet',
                sub: GAME$2.RESPONSE
            };
            var types = getCurrent(info_1).types;
            format_1 = checkData(types, obj, info_1, ws.updateSchema);
            if (format_1.buf) {
                data.packet = format_1.buf;
                data.schemas.push({
                    name: 'packet',
                    hash: format_1.id
                });
            }
            else {
                console.error('無法處理主要封包');
            }
        }
        try {
            var buffer = type.toBuffer(data);
            ws.send(buffer);
        }
        catch (err) {
            logger$2.error('type.toBuffer has problem');
        }
    }
    else {
        logger$2.error('格式錯誤');
    }
}
//====================================================
function toGame$1(ws, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var service, game, buf, id, info, types, err, value, buffer;
        return __generator(this, function (_b) {
            service = ws.service;
            if (!service) {
                logger$2.error('service is undefined');
            }
            console.log(data);
            game = ws.info.game;
            if (game && ((_a = data === null || data === void 0 ? void 0 : data.packet) === null || _a === void 0 ? void 0 : _a.data)) {
                buf = data.packet.data;
                if (typeof buf === 'string') {
                    game.sub = GAME$2.REQUEST;
                    id = save(game, buf);
                    if (id) {
                        info = {
                            name: game.name,
                            group: game.group,
                            sub: game.sub,
                            schemas: [id]
                        };
                        ws.updateSchema(info);
                    }
                }
                else if (Buffer.isBuffer(buf)) {
                    types = ws.info.typesRequest;
                    data.packet.data = checkBuffer(types, buf, {
                        useJSON: true
                    });
                }
                data.actionType = ActionType.TOGAME;
                data.packet.data = utf8Encoder.encode(data.packet.data);
                err = ToGameRequest$1.verify(data);
                if (err) {
                    logger$2.error(err);
                }
                else {
                    value = ToGameRequest$1.create(data);
                    buffer = ToGameRequest$1.encode(value).finish();
                    service.send(buffer);
                }
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function close$1(ws) {
    if (ws && ws.service) {
        ws.service.terminate();
        delete ws.service;
    }
}
//====================================================
function open$1(ws, message) {
    logger$2.info('open');
    var service = new WebSocket(process.env.PROXY_SERVER);
    service.binaryType = 'arraybuffer';
    ws.service = service;
    ws.isConnected = false;
    service.on('open', function () {
        logger$2.info('service connect');
        ws.isConnected = true;
        if (ws.firstBuf) {
            message(ws, null);
        }
    });
    service.on('error', function (err) {
        logger$2.error('service error');
        console.log(err);
    });
    service.on('close', function () {
        logger$2.info('service disconnect');
        ws.isConnected = false;
        delete ws.service;
        if (ws.close) {
            ws.close();
        }
    });
    service.on('message', function (data) {
        var view = new Uint8Array(data);
        var buf = Buffer.from(view);
        try {
            var value = ToGameResponse$1.decode(buf);
            if (value && (value.actionType === ActionType.TOGAME)) {
                sendToGame(ws, value);
                return;
            }
        }
        catch (e) {
        }
        try {
            var value = BroadcastResponse$1.decode(buf);
            if (value && (value.actionType === ActionType.BROADCAST)) {
                sendBroadcast(ws, value);
                return;
            }
        }
        catch (e) {
        }
        try {
            var value = InGameResponse$1.decode(buf);
            if (value && (value.actionType === ActionType.INGAME)) {
                sendInGame(ws, value);
                return;
            }
        }
        catch (e) {
        }
        try {
            var value = LoginResponse.decode(buf);
            if (value && (value.actionType === ActionType.LOGIN)) {
                sendLogin(ws, value);
                return;
            }
        }
        catch (e) {
        }
        logger$2.error('!!!! unknown format !!!!');
        console.log(view);
    });
}

var websocketGti = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$2,
  login: login$1,
  inGame: inGame$1,
  toGame: toGame$1,
  close: close$1,
  open: open$1
});

var logger$3 = {
    error: function () { },
    info: function () { }
};
var GAME$3 = GAME;
function init$3(config) {
    logger$3 = config.logger.child({ proxy: 'ioVideo' });
    logger$3.info('init');
    var procList = [
        // 傳送遊戲命令
        {
            name: 'toGame',
            type: typeRequest$2,
            func: toGame$2
        },
        // 登入命令
        {
            name: 'login',
            type: typeRequest,
            func: login$2
        },
        // 進入遊戲命令
        {
            name: 'inGame',
            type: typeRequest$1,
            func: inGame$2
        }
    ];
    return procList;
}
//====================================================
function login$2(ws, data) {
    return __awaiter(this, void 0, void 0, function () {
        var funcIndex, socketio, info;
        return __generator(this, function (_a) {
            funcIndex = data.funcIndex;
            delete data.funcIndex;
            socketio = ws.socketio;
            if (socketio) {
                if (!socketio.curLoginData) {
                    socketio.curLoginData = data;
                    socketio.loginFuncIndex = funcIndex;
                    info = ws.info;
                    info.index = info.generateIndex();
                    console.log("index:" + info.index + " is " + data.token);
                    socketio.emit('login', data);
                }
                else {
                    logger$3.error('重複收到登入命令');
                }
            }
            else {
                logger$3.error('disconnect');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function inGame$2(ws, data) {
    return __awaiter(this, void 0, void 0, function () {
        var info, socketio;
        return __generator(this, function (_a) {
            info = ws.info;
            if (info.game) {
                return [2 /*return*/];
            }
            info.game = data;
            socketio = ws.socketio;
            if (socketio) {
                socketio.emit('inGame', data);
            }
            else {
                logger$3.error('disconnect');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function toGame$2(ws, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var game, buf, id, info, types;
        return __generator(this, function (_b) {
            if ((_a = data === null || data === void 0 ? void 0 : data.packet) === null || _a === void 0 ? void 0 : _a.data) {
                game = ws.info.game;
                buf = data.packet.data;
                if (buf) {
                    if (typeof buf === 'string') {
                        game.sub = GAME$3.REQUEST;
                        id = save(game, buf);
                        if (id) {
                            info = {
                                name: game.name,
                                group: game.group,
                                sub: game.sub,
                                schemas: [id]
                            };
                            ws.updateSchema(info);
                        }
                    }
                    else if (Buffer.isBuffer(buf)) {
                        types = ws.info.typesRequest;
                        data.packet.data = checkBuffer(types, buf, {
                            useJSON: true
                        });
                    }
                }
            }
            if (ws.socketio) {
                ws.socketio.emit('toGame', data);
            }
            else {
                logger$3.error('disconnect');
            }
            return [2 /*return*/];
        });
    });
}
//====================================================
function close$2(ws) {
    if (ws && ws.socketio) {
        ws.socketio.close();
        delete ws.socketio;
    }
}
//====================================================
function open$2(ws, message) {
    var socketio = new io(process.env.PROXY_SERVER, {
        forceNew: false,
        reconnection: false,
        transports: ['websocket']
    });
    ws.socketio = socketio;
    ws.isConnected = false;
    socketio.on('connect', function () {
        logger$3.info('connect');
        ws.isConnected = true;
        if (ws.firstBuf) {
            message(ws, null);
        }
    });
    socketio.on('disconnect', function () {
        logger$3.info(ws.info.index + " disconnect");
        ws.isConnected = false;
        delete ws.socketio;
        if (ws.close) {
            ws.close();
        }
    });
    socketio.on('connect_error', function (error) {
        logger$3.info('connect_error');
        console.log(error);
    });
    socketio.on('error', function (error) {
        logger$3.info('error');
        console.log(error);
    });
    socketio.on('connect_timeout', function () {
        logger$3.info('connect_timeout');
        if (ws.close) {
            ws.close();
        }
    });
    socketio.on('login', function (data) {
        logger$3.info(ws.info.index + "[result]login");
        var funcIndex = -1;
        if (socketio.curLoginData) {
            socketio.curLoginData = null;
            funcIndex = socketio.loginFuncIndex;
            delete socketio.loginFuncIndex;
        }
        if (data) {
            data.funcIndex = funcIndex;
            if (data.userData) {
                delete data.userData;
            }
            var check = true;
            if (typeResponseVideo.isValid(data)) {
                var buffer = typeResponseVideo.toBuffer(data);
                ws.send(buffer);
            }
            else {
                check = false;
                logger$3.error('格式錯誤');
                //        console.log(data);
            }
            if (check) {
                ws.info.user = data.userInfo;
            }
        }
        else {
            logger$3.error('login data is undefined');
        }
    });
    socketio.on('inGame', function (data) {
        var info = ws.info;
        logger$3.info(info.index + "[result]inGame");
        var funcIndex = info.game.funcIndex;
        var type = typeResponse;
        if (data) {
            delete data.packet;
            data.funcIndex = funcIndex;
            var current = null;
            var schemas = null;
            var updateSchemaList = [];
            data.updateSchemaList = updateSchemaList;
            // 請求
            info.game.sub = GAME$3.REQUEST;
            current = getCurrent(info.game);
            schemas = current.schemas;
            info.typesRequest = current.types;
            schemas = schemas && Object.getOwnPropertyNames(schemas);
            if (schemas && (schemas.length > 0)) {
                var obj = {
                    name: info.game.name,
                    group: info.game.group,
                    sub: GAME$3.REQUEST,
                    schemas: schemas
                };
                updateSchemaList.push(obj);
            }
            // 回應
            info.game.sub = GAME$3.RESPONSE;
            current = getCurrent(info.game);
            info.typesResponse = current.types;
            schemas = current.schemas;
            schemas = schemas && Object.getOwnPropertyNames(schemas);
            if (schemas && (schemas.length > 0)) {
                var obj = {
                    name: info.game.name,
                    group: info.game.group,
                    sub: GAME$3.RESPONSE,
                    schemas: schemas
                };
                updateSchemaList.push(obj);
            }
            // 主封包
            current = getCurrent({
                group: info.game.group,
                name: 'packet',
                sub: GAME$3.RESPONSE
            });
            schemas = current.schemas;
            schemas = schemas && Object.getOwnPropertyNames(schemas);
            if (schemas && (schemas.length > 0)) {
                var obj = {
                    group: info.game.group,
                    name: 'packet',
                    sub: GAME$3.RESPONSE,
                    schemas: schemas
                };
                updateSchemaList.push(obj);
            }
            //      console.log(data);
            if (type.isValid(data, { noUndeclaredFields: true })) {
                var buffer = type.toBuffer(data);
                ws.send(buffer);
            }
            else {
                logger$3.error('格式錯誤');
            }
        }
        else {
            logger$3.error('inGame data is undefined');
        }
    });
    socketio.on('toGame', function (data) {
        logger$3.info(ws.info.index + "[result]toGame");
        var game = ws.info.game;
        if (!game) {
            logger$3.error('未執行 inGame 命令');
            return;
        }
        //    console.log(data);
        var type = typeResponse$1;
        var packet = data.packet;
        data.funcIndex = -1;
        data.packet = null;
        data.schemas = [];
        if (type.isValid(data)) {
            var format_1 = null;
            var names = [];
            if (packet) {
                // 處理子封包
                names = Object.getOwnPropertyNames(packet);
                names.forEach(function (name) {
                    console.log("packet." + name);
                    var obj = packet[name];
                    if (typeof obj === 'string') {
                        if (obj[0] !== '{') {
                            return true;
                        }
                    }
                    var info = {
                        group: game.group,
                        name: name,
                        sub: GAME$3.RESPONSE
                    };
                    if (name === 'data') {
                        info.name = game.name;
                    }
                    var types = getCurrent(info).types;
                    format_1 = checkData(types, obj, info, ws.updateSchema);
                    if (format_1.buf) {
                        packet[name] = format_1.buf;
                        data.schemas.push({
                            name: name,
                            hash: format_1.id
                        });
                    }
                });
                // 處理主要封包
                var obj = packet;
                var info = {
                    group: game.group,
                    name: 'packet',
                    sub: GAME$3.RESPONSE
                };
                var types = getCurrent(info).types;
                format_1 = checkData(types, obj, info, ws.updateSchema);
                if (format_1.buf) {
                    data.packet = format_1.buf;
                    data.schemas.push({
                        name: 'packet',
                        hash: format_1.id
                    });
                }
            }
            //--------------------------------------------
            // 傳送資料
            var buffer = type.toBuffer(data);
            ws.send(buffer);
        }
        else {
            logger$3.error('格式錯誤');
            console.log(data);
        }
    });
    logger$3.info('open');
}

var socketioVideo = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$3,
  login: login$2,
  inGame: inGame$2,
  toGame: toGame$2,
  close: close$2,
  open: open$2
});

var namespace$8 = "game.agent.avro";
var name$8 = "UpdateSchemaRequest";
var type$8 = "record";
var doc$8 = " 更新 schema (請求)";
var fields$8 = [
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "名稱",
		name: "name",
		type: "string"
	},
	{
		doc: "群組",
		name: "group",
		type: "string"
	},
	{
		doc: "訂閱",
		name: "sub",
		type: {
			type: "enum",
			symbols: [
				"request",
				"response"
			]
		}
	},
	{
		name: "schemas",
		type: {
			type: "array",
			items: "string"
		}
	}
];
var UpdateSchemaRequest = {
	namespace: namespace$8,
	name: name$8,
	type: type$8,
	doc: doc$8,
	fields: fields$8
};

var namespace$9 = "game.agent.avro";
var name$9 = "UpdateSchemaResponse";
var type$9 = "record";
var doc$9 = " 更新 schema (回應)";
var fields$9 = [
	{
		doc: "索引",
		name: "funcIndex",
		type: "int"
	},
	{
		doc: "名稱",
		name: "name",
		type: "string"
	},
	{
		doc: "群組",
		name: "group",
		type: "string"
	},
	{
		doc: "訂閱",
		name: "sub",
		type: {
			type: "enum",
			symbols: [
				"request",
				"response"
			]
		}
	},
	{
		name: "schemas",
		doc: "資料描述",
		type: {
			type: "array",
			items: {
				name: "schema",
				type: "record",
				fields: [
					{
						name: "json",
						type: "string"
					},
					{
						name: "id",
						type: "string"
					}
				]
			}
		}
	}
];
var UpdateSchemaResponse = {
	namespace: namespace$9,
	name: name$9,
	type: type$9,
	doc: doc$9,
	fields: fields$9
};

var typeRequest$3 = avro.Type.forSchema(UpdateSchemaRequest);
var typeResponse$3 = avro.Type.forSchema(UpdateSchemaResponse);

var logger$4 = {
    error: function () { },
    info: function () { }
};
var proxy = null;
var procList = null;
var procCounts = 0;
function updateSchema(ws, info) {
    logger$4.info(ws.info.index + "[update schema] " + info.group + " " + info.name + " " + info.sub);
    if (typeof info.funcIndex !== 'number') {
        info.funcIndex = -1;
    }
    var type = typeResponse$3;
    var current = getCurrent(info);
    if (!(info.schemas && Array.isArray(info.schemas))) {
        return false;
    }
    var schemas = [];
    if (current.schemas) {
        for (var i = 0; i < info.schemas.length; i += 1) {
            var id = info.schemas[i];
            var schema = current.schemas[id];
            if (schema && (typeof schema === 'string')) {
                schemas.push({
                    id: id,
                    json: schema
                });
            }
            else {
                console.error("schema " + id + " is " + typeof schema);
            }
        }
        info.schemas = schemas;
    }
    else {
        info.schemas = [];
    }
    try {
        if (type.isValid(info, { noUndeclaredFields: true })) {
            var buffer = type.toBuffer(info);
            ws.send(buffer);
        }
        else {
            logger$4.error('unknown format');
            console.log(info);
        }
    }
    catch (err) {
        logger$4.error(err);
    }
    return true;
}
function init$4(config) {
    logger$4 = config.logger.child({ module: 'avro' });
    var filename = process.env.APP_CONFIG || 'config/base.yml';
    console.log("config filename : " + filename);
    var baseConfig = null;
    // 確認是否有資料夾
    if (fs.existsSync(filename)) {
        try {
            var data = fs.readFileSync(filename, 'utf8');
            baseConfig = jsyaml.safeLoad(data);
        }
        catch (err) {
            logger$4.error(err);
        }
    }
    init(baseConfig, logger$4);
    var moduleName = process.env.PROXY_MODULE || 'ioVideo';
    if (moduleName === 'ioGti') {
        proxy = socketioGti;
    }
    else if (moduleName === 'ioVideo') {
        proxy = socketioVideo;
    }
    else if (moduleName === 'wsGti') {
        proxy = websocketGti;
    }
    if (proxy) {
        procList = proxy.init(config);
        // 更新 schema
        procList.push({
            name: 'updateSchema',
            type: typeRequest$3,
            func: updateSchema
        });
        procCounts = procList.length;
    }
    else {
        logger$4.error("\u672A\u77E5\u7684\u6A21\u7D44\u540D\u7A31 moduleName : " + moduleName);
    }
}
function open$3(ws) {
    ws.updateSchema = function (info) {
        updateSchema(ws, info);
    };
    proxy.open(ws, message);
}
function message(ws, view, isBinary) {
    var buf = null;
    if (view) {
        buf = Buffer.from(view);
        if (!(ws.isConnected || ws.firstBuf)) {
            ws.firstBuf = buf;
            return;
        }
    }
    else {
        buf = ws.firstBuf;
    }
    var info = ws.info;
    for (var i = 0; i < procCounts; i += 1) {
        var proc = procList[i];
        try {
            var type = proc.type;
            var value = type.fromBuffer(buf);
            if (proc.name) {
                logger$4.info(info.index + "[recv]" + proc.name);
            }
            proc.func(ws, value, buf);
            return;
        }
        catch (e) {
        }
    }
    //---------------------------------
    logger$4.error('[recv]未知的格式');
    console.log(buf);
}
function close$3(ws, code, msg) {
    proxy.close(ws);
}

var cmdAvro = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$4,
  open: open$3,
  close: close$3,
  message: message
});

var Agent$1 = null;
// 命令種類
var ActionType$1 = null;
// 自定義的格式
var CustomFormat$1 = null;
var logger$5 = {
    error: function () { },
    info: function () { }
};
var LoginRequest$2 = null;
var LoginResponse$1 = null;
var InGameRequest$2 = null;
var InGameResponse$2 = null;
var ToGameRequest$2 = null;
var ToGameResponse$2 = null;
var GameRequest = null;
var GameResponse = null;
var BroadcastResponse$2 = null;
var utf8Decoder$1 = null;
var utf8Encoder$1 = null;
function init$5(config) {
    return __awaiter(this, void 0, void 0, function () {
        var root;
        return __generator(this, function (_a) {
            logger$5 = config.logger;
            utf8Decoder$1 = new TextDecoder();
            utf8Encoder$1 = new TextEncoder();
            root = protobuf.Root.fromJSON(protocol);
            Agent$1 = root.Game.Agent;
            // 命令種類
            ActionType$1 = Agent$1.ActionType;
            // 自定義的格式
            CustomFormat$1 = Agent$1.CustomFormat;
            LoginRequest$2 = Agent$1.LoginRequest;
            LoginResponse$1 = Agent$1.LoginResponse;
            InGameRequest$2 = Agent$1.InGameRequest;
            InGameResponse$2 = Agent$1.InGameResponse;
            ToGameRequest$2 = Agent$1.ToGameRequest;
            ToGameResponse$2 = Agent$1.ToGameResponse;
            GameRequest = Agent$1.GameRequest;
            GameResponse = Agent$1.GameResponse;
            BroadcastResponse$2 = Agent$1.BroadcastResponse;
            return [2 /*return*/];
        });
    });
}
var testTimeIndex = 0;
var testTimeoutList = [
    // 5000,
    // 4000,
    // 3000,
    // 2000,
    // 1000,
    50
];
//====================================================
function proxyLogin(ws, value) {
    return __awaiter(this, void 0, void 0, function () {
        var obj;
        return __generator(this, function (_a) {
            obj = LoginRequest$2.toObject(value, {
                defaults: true,
                arrays: false,
                objects: false,
                oneofs: false
            });
            console.log(obj);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var data = {
                        token: 'abcd1234',
                        resultCode: 1
                    };
                    data.actionType = ActionType$1.LOGIN;
                    data.funcIndex = obj.funcIndex;
                    var err = LoginResponse$1.verify(data);
                    if (err) {
                        logger$5.error(err);
                        reject();
                    }
                    else {
                        var val = LoginResponse$1.create(data);
                        var buffer_1 = LoginResponse$1.encode(val).finish();
                        var timeout = testTimeoutList[testTimeIndex];
                        testTimeIndex += 1;
                        if (testTimeIndex >= testTimeoutList.length) {
                            testTimeIndex = 0;
                        }
                        setTimeout(function () {
                            logger$5.info("\u50B3\u9001\u767B\u5165\u547D\u4EE4 data.funcIndex : " + data.funcIndex);
                            ws.send(buffer_1, true);
                            resolve();
                        }, timeout);
                    }
                })];
        });
    });
}
//====================================================
function proxyInGame(ws, value) {
    return __awaiter(this, void 0, void 0, function () {
        var obj, info;
        return __generator(this, function (_a) {
            obj = InGameRequest$2.toObject(value, {
                defaults: true,
                arrays: false,
                objects: false,
                oneofs: false
            });
            info = ws.info;
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var data = {
                        resultCode: 1
                    };
                    data.actionType = ActionType$1.INGAME;
                    data.gid = obj.gid;
                    data.funcIndex = obj.funcIndex;
                    var game = {};
                    info[obj.gid] = game;
                    game.gid = obj.gid;
                    if (ws.service) {
                        ws.service.close();
                        delete ws.service;
                    }
                    var service = new WebSocket("ws://127.0.0.1:3500/" + obj.group + "/" + obj.name);
                    service.binaryType = 'arraybuffer';
                    ws.service = service;
                    service.on('open', function () {
                        logger$5.info('connect to game server');
                        var err = InGameResponse$2.verify(data);
                        if (err) {
                            logger$5.error(err);
                            service.close();
                            delete ws.service;
                            reject();
                        }
                        else {
                            var val = InGameResponse$2.create(data);
                            var buffer = InGameResponse$2.encode(val).finish();
                            ws.send(buffer, true);
                            resolve();
                        }
                    });
                    service.on('error', function (err) {
                        logger$5.error('service error');
                        logger$5.error(err);
                        reject();
                    });
                    service.on('close', function () {
                        logger$5.info('service disconnect');
                        delete ws.service;
                    });
                    service.on('message', function (rawData) {
                        var view = new Uint8Array(rawData);
                        var buf = Buffer.from(view);
                        var value = GameResponse.decode(buf);
                        var packet = GameResponse.toObject(value, {
                            defaults: true,
                            arrays: false,
                            objects: false,
                            oneofs: false
                        });
                        logger$5.info('收到遊戲結果');
                        // console.log('[packet]');
                        // console.log(packet);
                        var data = {};
                        data.actionType = ActionType$1.TOGAME;
                        data.funcIndex = parseInt(packet.funcIndex) || 0;
                        data.gid = game.gid;
                        data.resultCode = 1;
                        data.packet = packet;
                        var err = ToGameResponse$2.verify(data);
                        if (err) {
                            logger$5.error(err);
                        }
                        else {
                            var value_1 = ToGameResponse$2.create(data);
                            var buffer_2 = ToGameResponse$2.encode(value_1).finish();
                            console.log("data size : " + buffer_2.length + " data.packet size : " + buf.length);
                            console.log(data);
                            setTimeout(function () {
                                ws.send(buffer_2, true);
                                logger$5.info("\u50B3\u9001\u904A\u6232\u7D50\u679C");
                            }, 2000);
                        }
                    });
                })];
        });
    });
}
//====================================================
function proxyToGame(ws, value) {
    return __awaiter(this, void 0, void 0, function () {
        var obj, packet;
        return __generator(this, function (_a) {
            obj = ToGameRequest$2.toObject(value, {
                defaults: true,
                arrays: false,
                objects: false,
                oneofs: false
            });
            console.log(obj);
            packet = obj.packet;
            if (packet) {
                packet.funcIndex = parseInt(obj.funcIndex) || 0;
                function sendToGame() {
                    if (ws === null || ws === void 0 ? void 0 : ws.service) {
                        var value_2 = GameRequest.create(packet);
                        var buf = GameRequest.encode(value_2).finish();
                        console.log("data.packet size : " + buf.length);
                        ws.service.send(buf);
                    }
                }
                sendToGame();
            }
            return [2 /*return*/];
        });
    });
}
function open$4( /*ws*/) {
    logger$5.info('use protobuf');
}
function message$1(ws, view, isBinary) {
    var buf = Buffer.from(view);
    try {
        var value = ToGameRequest$2.decode(buf);
        if (value) {
            if (value.actionType === ActionType$1.TOGAME) {
                logger$5.info('收到遊戲命令');
                proxyToGame(ws, value);
                return;
            }
        }
        else {
        }
    }
    catch (e) {
    }
    try {
        var value = LoginRequest$2.decode(buf);
        if (value) {
            if (value.actionType === ActionType$1.LOGIN) {
                logger$5.info('收到登入命令');
                proxyLogin(ws, value);
                return;
            }
        }
        else {
        }
    }
    catch (e) {
    }
    try {
        var value = InGameRequest$2.decode(buf);
        if (value) {
            if (value.actionType === ActionType$1.INGAME) {
                logger$5.info('收到進入遊戲命令');
                proxyInGame(ws, value);
            }
        }
        else {
        }
        return;
    }
    catch (e) {
    }
}
function close$4(ws, code, message) {
    if (ws.service) {
        ws.service.close();
        delete ws.service;
    }
}

var cmdProtobuf = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init$5,
  open: open$4,
  close: close$4,
  message: message$1
});

var _a;
//import Fastify from 'fastify';
var logger$6 = pino({
    redact: ['key', 'token'],
    remove: true,
    prettyPrint: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o'
    }
});
var currentIndex = 0;
var currentDay = lightFormat(new Date(), 'dd');
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
function generateIndex() {
    var day = lightFormat(new Date(), 'dd');
    if (currentDay !== day) {
        // console.log(`currentDay : ${typeof currentDay}`);
        // console.log(`day : ${typeof day}`);
        currentIndex = 0;
        currentDay = day;
    }
    currentIndex += 1;
    //  logger.info(`generateIndex ${currentIndex}`);
    return "" + currentDay + currentIndex;
}
/*
io.metric({
  name    : 'realtime user',
  value() {
    return totalUsers;
  }
});
let meterSend = io.meter({
  name      : 'client send counts/min',
  samples   : 60,
  timeframe : 60
});
let meterRecv = io.meter({
  name      : 'client recv counts/min',
  samples   : 60,
  timeframe : 60
});

let histogramSend = io.histogram({
  name        : 'client send/bytes',
  measurement : 'mean'
});
let histogramRecv = io.histogram({
  name        : 'client recv/bytes',
  measurement : 'mean'
});
*/
init$4({
    logger: logger$6
});
init$5({
    logger: logger$6
});
//====================================================
//const port = 4321;
var port = parseInt(process.env.PORT) || 4321;
if (!process.env.PROXY_SERVER) {
    process.env.PROXY_SERVER = "http://localhost:11102/1.00.0";
}
// console.log('[env]');
// console.log(process.env);
var App = uws.App;
if (process.env.APP_USE_SSL && (process.env.APP_USE_SSL === 'true')) {
    App = uws.SSLApp;
}
// let data = fs.readFileSync(process.env.APP_KEY);
// console.log(data);
var listenSocket = null;
var app = App({
    ssl_prefer_low_memory_usage: false,
    key_file_name: process.env.APP_KEY || 'keys/test/server.key',
    cert_file_name: process.env.APP_CERT || 'keys/test/server.crt',
    passphrase: process.env.APP_PASSPHRASE || 'abcd1234'
})
    .get('/*', function (res, req) {
    console.log('[get]', res);
    console.log('[get]', req);
})
    .ws('/*', {
    /* Options */
    compression: parseInt((_a = process.env.APP_COMPRESSION) !== null && _a !== void 0 ? _a : uws.SHARED_COMPRESSOR),
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: parseInt(process.env.APP_IDLE_TIMEOUT || '0'),
    /* Handlers */
    open: function (ws) {
        logger$6.info('A WebSocket connected via URL: ' + ws.url + '!');
        // let view = new DataView(ws.getRemoteAddress());
        // logger.info(`client : ${view.getUint8(12)}.${view.getUint8(13)}.${view.getUint8(14)}.${view.getUint8(15)}`);
        var channel = ws.url;
        var info = {
            generateIndex: generateIndex,
            index: 0
        };
        ws.info = info;
        if (channel === '/avro') {
            ws.cmdProxy = cmdAvro;
        }
        else if (channel === '/protobuf') {
            ws.cmdProxy = cmdProtobuf;
        }
        if (ws.cmdProxy) {
            var websocket = {
                info: info,
                send: function (buf) {
                    ws.send(buf, true);
                },
                close: function () {
                    logger$6.info(ws.info.index + " close");
                    if (!ws.info.isClosed) {
                        ws.info.isClosed = true;
                        try {
                            ws.close();
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            };
            ws.websocket = websocket;
            ws.cmdProxy.open(websocket);
        }
    },
    upgrade: function (res, req, context) {
        console.log('[upgrade]', res, req, context);
        console.log('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');
        /* This immediately calls open handler, you must not use res after this call */
        res.upgrade({
            url: req.getUrl()
        }, 
        /* Spell these correctly */
        req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
    },
    message: function (ws, message, isBinary) {
        var view = new Uint8Array(message);
        console.log('[msg ws.url]', ws.url);
        if ((view.length < 3) || (view.length >= 4096)) {
            logger$6.error('收到指定範圍之外的資料');
            return;
        }
        var websocket = ws.websocket;
        if (ws.cmdProxy) {
            ws.cmdProxy.message(websocket, view, isBinary);
        }
    },
    drain: function (ws) {
        logger$6.info('WebSocket backpressure: ' + ws.getBufferedAmount());
    },
    close: function (ws, code, message) {
        logger$6.info(ws.info.index + " websocket closed");
        ws.info.isClosed = true;
        var websocket = ws.websocket;
        if (ws.cmdProxy) {
            ws.cmdProxy.close(websocket, code, message);
        }
    }
}).any('/*', function (res, req) {
    console.log('[any]');
    console.log(req);
    res.end('Nothing to see here!');
}).listen(port, function (token) {
    listenSocket = token;
    if (token) {
        logger$6.info('Listening to port ' + port);
        if (!process.connected && process.send) {
            process.send('ready');
        }
    }
    else {
        logger$6.info('Failed to listen to port ' + port);
    }
});
process.on('SIGINT', function () {
    if (listenSocket) {
        uws.us_listen_socket_close(listenSocket);
        listenSocket = null;
    }
    process.exit(0);
});
console.log(app);
//# sourceMappingURL=main.js.map
