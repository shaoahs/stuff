'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

function _interopNamespace(e) {
    if (e && e.__esModule) { return e; } else {
        var n = {};
        if (e) {
            Object.keys(e).forEach(function (k) {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            });
        }
        n['default'] = e;
        return n;
    }
}

var pino = _interopDefault(require('pino'));
var uws = _interopDefault(require('uWebSockets.js'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var protobuf = _interopDefault(require('protobufjs'));

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

var nested = {
	Game: {
		nested: {
			Server: {
				nested: {
					CustomFormat: {
						values: {
							"JSON": 0,
							RAW: 1,
							PROTOBUF: 2
						}
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
var json = {
	nested: nested
};

var logger = null;
var root = protobuf.Root.fromJSON(json);
var Server = root.Game.Server;
// 命令格式
var CustomFormat = Server.CustomFormat;
// console.log(CustomFormat);
var GameRequest = Server.GameRequest;
var GameResponse = Server.GameResponse;
var demo = null;
function init(config) {
    return __awaiter(this, void 0, void 0, function () {
        var v, src, dest, filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v = new Date().getTime();
                    src = path.resolve(__dirname + ("./../project/" + config.group + "/" + config.name + "/test/demo.js"));
                    dest = path.resolve(__dirname + ("./../project/" + config.group + "/" + config.name + "/test/demo." + v + ".js"));
                    fs.copyFileSync(src, dest);
                    filename = "./../project/" + config.group + "/" + config.name + "/test/demo." + v + ".js";
                    return [4 /*yield*/, Promise.resolve().then(function () { return _interopNamespace(require(filename)); })];
                case 1:
                    demo = _a.sent();
                    logger = config.logger;
                    demo.init({
                        group: config.group,
                        name: config.name,
                        logger: logger,
                        CustomFormat: CustomFormat
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function request(buf, ws) {
    var value = GameRequest.decode(buf);
    var obj = GameRequest.toObject(value, {
        defaults: true,
        arrays: false,
        objects: false,
        oneofs: false
    });
    return obj;
}
function response(obj, ws) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, cmd, object, err, value;
        return __generator(this, function (_a) {
            buf = null;
            cmd = demo.get(ws);
            if (cmd) {
                object = cmd.generate(obj);
                object.funcIndex = parseInt(obj.funcIndex) || 0;
                err = GameResponse.verify(object);
                if (err) {
                    console.error(err);
                }
                else {
                    value = GameResponse.create(object);
                    buf = GameResponse.encode(value).finish();
                    logger.info('送出結果');
                    console.log("packet size : " + buf.length);
                    ws.send(buf, true);
                }
            }
            return [2 /*return*/];
        });
    });
}
var server = {
    init: init,
    request: request,
    response: response
};

// import  sjcl from 'sjcl';
// console.log(sjcl.random);
var logger$1 = pino({
    redact: ['key', 'token'],
    remove: true,
    prettyPrint: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o'
    }
});
var PORT = 3500;
var App = uws.App;
App({
    passphrase: 'abcd1234'
}).ws('/*', {
    /* Options */
    compression: 0,
    maxPayloadLength: 4 * 1024 * 1024,
    idleTimeout: 0,
    /* Handlers */
    open: function (ws) {
        logger$1.info('A WebSocket connected via URL: ' + ws.url + '!');
        var config = {
            logger: logger$1
        };
        var url = ws.url || '';
        var list = url.split('/', 5);
        config.group = list[1];
        config.name = list[2];
        server.init(config);
        var info = {
            cmdIndex: 0
        };
        ws.info = info;
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
        // 接收到資料
        logger$1.info('收到訊息');
        var view = new Uint8Array(message);
        var buf = Buffer.from(view);
        var obj = server.request(buf, ws);
        console.log("packet size : " + buf.length);
        console.log(obj);
        server.response(obj, ws);
    },
    drain: function (ws) {
        logger$1.info('WebSocket backpressure: ' + ws.getBufferedAmount());
    },
    close: function (ws, code, message) {
        logger$1.info(ws.info.key + " websocket closed");
    }
}).any('/*', function (res, req) {
    console.log('[any]');
    console.log(req);
    res.end('Nothing to see here!');
}).listen(PORT, function (token) {
    if (token) {
        logger$1.info('Listening to port ' + PORT);
    }
    else {
        logger$1.info('Failed to listen to port ' + PORT);
    }
});
