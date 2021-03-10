import pino from 'pino';
import uws from 'uWebSockets.js';

import server from 'src/server';

const logger = pino({
  redact: ['key', 'token'],
  remove: true,
  prettyPrint: {
    colorize: true,
    translateTime:'SYS:yyyy-mm-dd HH:MM:ss.l o'
  }
});

server.init(logger);


let PORT = 3500;
let App = uws.App;
App({
  passphrase: 'abcd1234'
}).ws('/*', {
  /* Options */
  compression: 0,
  maxPayloadLength: 4 * 1024 * 1024,
  idleTimeout: 0,
  /* Handlers */
  open(ws, req) {
    logger.info('A WebSocket connected via URL: ' + req.getUrl() + '!');

    let info = {
      cmdIndex: 0
    };
    ws.info = info;
  },
  message(ws, message, isBinary) {

    // 接收到資料
    logger.info('收到訊息');
    let view = new Uint8Array(message);
    let buf = Buffer.from(view);
    let obj = server.request(buf, ws);
    console.log(`packet size : ${buf.length}`);
    console.log(obj);

    buf = server.response(obj, ws);
    if(buf) {
      logger.info('送出結果');
      console.log(`packet size : ${buf.length}`);
      ws.send(buf, true);
    } else {
      logger.info('沒有資料了');
    }
  },
  drain(ws) {
    logger.info('WebSocket backpressure: ' + ws.getBufferedAmount());
  },
  close(ws, code, message) {
    logger.info(`${ws.info.key} websocket closed`);
  }
}).any('/*', (res, req) => {
  console.log('[any]');
  console.log(req);
  res.end('Nothing to see here!');
}).listen(PORT, (token) => {
  if (token) {
    logger.info('Listening to port ' + PORT);
  } else {
    logger.info('Failed to listen to port ' + PORT);
  }
});