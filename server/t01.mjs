import {spawn} from 'child_process';
import uWS from 'uWebSockets.js';
import WebSocket from 'ws';

import pino from 'pino';

import Splitter from 'stream-split';

const NALseparator    = Buffer.from([0,0,0,1]);//NAL break




const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: true,
      colorize: true
    }
  }
});

// console.log(uWS);
const port = 9001;

let streamList = [
  {
    ch: 1,
    path: '/b1',
    url: 'ws://172.16.102.5:8080/',
    ws: null
  },
  // {
  //   ch: 2,
  //   path: '/b2',
  //   url: 'wss://sevideo.sempire8.com:9323/b2',
  //   ws: null
  // },
  // {
  //   ch: 3,
  //   path: '/b3',
  //   url: 'wss://sevideo.sempire8.com:9323/b3',
  //   ws: null
  // },
  // {
  //   ch: 4,
  //   path: '/b4',
  //   url: 'wss://sevideo.sempire8.com:9323/b4',
  //   ws: null
  // },
  // {
  //   ch: 5,
  //   path: '/b5',
  //   url: 'wss://sevideo.sempire8.com:9323/b5',
  //   ws: null
  // },
];

let app = uWS.SSLApp({
  key_file_name: 'keys/test/server.key',
  cert_file_name: 'keys/test/server.crt',
  passphrase: '1234'
});

app.any('/*', (res, req) => {
  logger.info('[uws.any]', req);
  res.end('[uws.any] Nothing to see here!');
}).get('/*', (res, req) => {
  logger.info('[uws.get]', req);
  res.end('[uws.get] Nothing to see here!');
}).listen(port, (token) => {
  if (token) {
    logger.info('[uws.listen] port ' + port);
  } else {
    logger.error('[uws.listen] Failed to listen to port ' + port);
  }
});







let testLog = 2;
const toHexString = (bytes) => {
  let cnts = 32;
  return Array.from(bytes, (byte) => {
    cnts--;
    let str = ('0' + (byte & 0xff).toString(16)).slice(-2);
    if(cnts<0) {
      cnts = 32;
      str += '\n';
      return str;
    } else {
      return str + ' ';
    }
  }).join('');
};

streamList.forEach((stream) => {
  try {
    const log = logger.child({
      ch: stream.ch,
      module: 'stream'
    });
    let frameQueue = null;
    let clientList = [];
    let isFirstRect = true;
    let isFirstFrame = true;
    let report = {
      timeConnect:  Math.round(performance.now()),
      timeRecv: Math.round(performance.now()),
      timeFirstFrame: Math.round(performance.now())
    };

    let testCnts = 6;

    function createSocket() {
      isFirstRect = true;
      isFirstFrame = true;
      log.info({event: 'init', msg: '初始化'});
    
      let ws = new WebSocket(stream.url, {
        // perMessageDeflate: false,
        // rejectUnauthorized: false
      });

      ws.on('open', () => {
        report.timeConnect = Math.round(performance.now()) - report.timeConnect;
        log.info({event: 'open', msg: '打開', timeConnect: report.timeConnect});
      });
      
      ws.on('close', () => {
        log.info({event: 'close', msg: '關閉'});
        setTimeout(()=> {
          createSocket();
        },
        1000);
        
      });
  
      ws.on('message', (data) => {
        
        if(isFirstRect) {
          isFirstRect = false;
          report.timeRecv = Math.round(performance.now()) - report.timeRecv;
          log.info({event: 'message', msg: data.toString(), timeRecv: report.timeRecv});
  
        } else {
  
          const arr = new Uint8Array(data);
          
          if(arr[0] === 0 && arr[1] === 0 && arr[2] === 0 && arr[3] === 1) {
            
            if( arr[4] === 103 ) {
              console.log('[recv.iframe] ', arr);

              if (isFirstFrame) {
                isFirstFrame = false;

                frameQueue = [];
                stream.frameQueue = frameQueue;
  
                report.timeFirstFrame = Math.round(performance.now()) - report.timeFirstFrame;
                log.info({event: 'message', msg: 'recv iframe', timeFirstFrame: report.timeFirstFrame});
                report.timeFirstFrame = Math.round(performance.now());
              }

              // logger.info('[frame id] ', arr[4]);
              // logger.info('[clean] frameQueue');
            } else {

              if(testCnts>0) {
                testCnts--;
                console.log('[recv.NAL] ', arr);
              }
  
            }

            if(frameQueue) {
              frameQueue.push(data);
              // console.log('[frameQueue]', frameQueue.length);

              clientList.forEach(client => {
  
                if(client) {
                  if(client.isFirst) {
                    for(let i=0; i < frameQueue.length; i++) {
                      let frame = frameQueue[i];
                      client.send(frame, true);
                    }
                    client.isFirst = false;
                  }
                  client.send(data, true);
                }
      
              });
  
            }
  
          } else {
            // console.log('[unknow]');
            // console.log(arr);
            if(testLog > 0) {
              console.log(toHexString(arr));
              testLog--;
            }
  
          }
          // logger.info(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[8]);
        }
  
      });
  
      ws.on('error', (e) => {
        // log.error(e);
      });

      stream.ws = ws;
    }

    //createSocket();


    function createStream() {
      let args = [
        "-f", "x11grab",
        "-i",  ":1" ,
        "-framerate", 1,
        "-video_size", 1920 + 'x' + 1080,
        '-vf',  'crop=640:480:460:300',
        '-pix_fmt',  'yuv420p',
        '-c:v',  'libx264',
//          '-b:v', '600k',
//          '-bufsize', '600k',
        '-vprofile', 'baseline',
        '-tune', 'zerolatency',
        '-f' ,'rawvideo',
        '-'
      ];

      console.log("ffmpeg " + args.join(' '));
      let cmd = spawn('./ffmpeg', args, {
        cwd: "/home/dott/tmp/ffmpeg-6.1-amd64-static/"
      });

      //streamer.stderr.pipe(process.stderr);

      cmd.on("exit", (code) => {
        console.log("Failure", code);
      });

      let ffmpeg = cmd.stdout;
      
      ffmpeg = ffmpeg.pipe(new Splitter(NALseparator));
      ffmpeg.on("data", (data)=> {

        //test
        cnts--;
        if(cnts<0) {
          ffmpeg.end();
          return;
        }
        const arr = new Uint8Array(data);
        console.log('[recv.NAL]', arr);

        if( arr[0] === 103 ) {
          console.log('[recv.iframe] ');

          if (isFirstFrame) {
            isFirstFrame = false;

            frameQueue = [];
            stream.frameQueue = frameQueue;

            report.timeFirstFrame = Math.round(performance.now()) - report.timeFirstFrame;
            log.info({event: 'message', msg: 'recv iframe', timeFirstFrame: report.timeFirstFrame});
            report.timeFirstFrame = Math.round(performance.now());
          }

          // logger.info('[frame id] ', arr[4]);
          // logger.info('[clean] frameQueue');
        } 

        let frame = Buffer.concat([NALseparator, data]);
        if(frameQueue) {
          frameQueue.push(frame);
          // console.log('[frameQueue]', frameQueue.length);

        }

        clientList.forEach(client => {

          if(client) {
            if(client.isFirst) {
              for(let i=0; i < frameQueue.length; i++) {
                let frame = frameQueue[i];
                client.send(frame, true);
              }
              client.isFirst = false;
            } else {
              client.send(frame, true);
            }
          }

        });

      });


    }
    createStream();


    app.ws(stream.path, {
      /* Options */
      // compression: uWS.SHARED_COMPRESSOR,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 60,
      /* Handlers */
      open: (ws) => {
        let index = clientList.length;
       
        ws.index = index;
        ws.isFirst = true;
    
        clientList[index] = ws;

        log.info({
          event: 'open',
          client: ws.index,
        });

        if(stream.frameQueue && stream.frameQueue.length>0) {
          for(let i=0; i < stream.frameQueue.length; i++) {
            let frame = stream.frameQueue[i];
            ws.send(frame, true);
          }
        }
      },
      message: (ws, message, isBinary) => {
        log.info({
          event: 'message',
          client: ws.index,
          msg: '接收'
        });

        /* Ok is false if backpressure was built up, wait for drain */
        // let ok = ws.send(message, isBinary);
      },
      drain: (ws) => {
        log.info({
          event: 'drain',
          client: ws.index,
          msg: 'drain'
        });
        log.info('[uws.drain] backpressure: ' + ws.getBufferedAmount());
      },
      close: (ws, code, message) => {
        log.info({
          event: 'close',
          client: ws.index,
          code: code,
          msg: '斷線'
        });
        clientList[ws.index] = null;
      }
    });
  } catch(e) {
    log.error(e);
  }
});






