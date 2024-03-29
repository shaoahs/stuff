'use strict';
const fs = require('fs');
const logger = require('pino')({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: true,
      colorize: true
    }
  }
});

const cors  = require('@fastify/cors');

//------------------------------------------
let corsOptions = {
  // origin: '*',
  credentials: true,
  // allowedHeaders: [
  //   'Access-Control-Allow-Origin', '*'
  // ],
  origin: [
    // 'https://game.wllon.com/',
    // 'https://34.80.49.231/',
    'http://ip-api.com/',
    'http://127.0.0.1:3000',
    'wss://172.16.102.5:4301',
    'http://172.16.65.127:3000',
    'http://127.0.0.1:4000'
  ],
  methods:['GET', 'POST', 'PUT', 'OPTIONS']
};

const path = require('path');
const fastify = require('fastify')({
  http2: true,
  https:{
    allowHTTP1: true,
    key: fs.readFileSync('server/keys/test/server.key'),
    cert: fs.readFileSync('server/keys/test/server.crt')
  }
});

// const authenticate = {realm: 'Westeros'};
// fastify.register(require('fastify-basic-auth'), { validate, authenticate })
// // `this` inside validate is `fastify`
// function validate (username, password, req, reply, done) {
//   if (username === 'Tyrion' && password === 'wine') {
//     done()
//   } else {
//     done(new Error('Winter is coming'))
//   }
// }
// fastify.register(
//   require('fastify-compress'),
//   { 
//     brotli: require('iltorb'),
//     inflateIfDeflated: true
//   }
//   // { /*inflateIfDeflated: true*/}
// );
fastify.register(require('@fastify/websocket'));
fastify.register(require('fastify-socket.io'), {
  allowEIO3: true
})
  .ready(()=>{
    logger.info('[init] socket.io');
    let io = fastify.io;
    //----
    let net = {};
    net.users = {};

    /**
     * 建立未登入的使用者（有連線的使用者清單）
     * @param socket {Object} socket.io 網路物件
     */
    function createUser(socket) {
      let command = require("./command/command.js");
      let user = {};
      user.socket = socket;
      user.game = {};
      //  user.token;

      //--------------
      // 設定命令對照表
      user.cmdList = command.list;
      user.cmdList.forEach(function(cmd){
        logger.debug("register command : " + cmd.id);
        let conf = {
          user:user,
          net : net,
          io : io
        };
        let event = cmd.init(conf);
        socket.on(cmd.id, event.proc);
      });
      //--------------
      //---建立新使用者
      return user;
    }
    net.eventConnect = function(socket){
      logger.info('eventConnect');
    //  console.log(socket);
      let user = createUser(socket);
      net.users[socket] = user;
    };
    //--------------
    io.of('/1.00.0').on('connection', net.eventConnect);
    io.of('/develop').on('connection', net.eventConnect);


  });


var send = require('send');

send.mime.define({
  ' text/javascript ': ['js', 'mjs'],
  'application/wasm': ['wasm'],
  'application/importmap+json': ['importmap'],
  'image/avif': ['avif'],
  'application/manifest+json': ['webmanifest'],
  'application/x-web-app-manifest+json': ['webapp'],
  'text/cache-manifest': ['appcache']
});
fastify.register(cors, corsOptions);
fastify
  .register(require('@fastify/static'), {
    root: path.join(__dirname+'/../', '/'),
    setHeaders:function (res, pathName) {
      if(pathName.indexOf('index.html') >= 0){
      }
      // res.setHeader("Access-Control-Allow-Origin", "*");
      // res.setHeader("Access-Control-Allow-Methods", "GET");
      // res.setHeader("Access-Control-Allow-Headers",  "*");

      // res.setHeader('Access-Control-Allow-Origin', '*');
      // res.setHeader('cache-control', 'public, max-age=16384');
    },
    send,
    // cacheControl: 'public',
    // maxAge: '16384'
  })
  .listen({
    port: 3000,
    host: '0.0.0.0'
  }, err => {
    if (err) throw err;
    // console.log(fastify.io);

    logger.info('!!!! start web server !!!!');
    logger.info('https://localhost:3000/developer/agent/');
});

fastify.get('/', (request, reply) => {
  reply.send({hello:'world'});
});

fastify.get('/socket.io/', { websocket: true }, (/* connection, req */) => {
});


fastify.get('/protobuf',{ websocket: true }, (connection, req) => {
  console.log('[websocket]connection');
  connection.socket.on('message', message => {
    // message === 'hi from client'
    connection.socket.send('hi from server')
  })
});
fastify.get('/avro',{ websocket: true }, (connection, req) => {
  console.log('[websocket]connection');
  connection.socket.on('message', message => {
    // message === 'hi from client'
    connection.socket.send('hi from server')
  })
});


/* const testServer = require('fastify')();
testServer.register(cors, corsOptions);
testServer
  .register(require('@fastify/static'), {
    root: path.join(__dirname+'/../tmp/', '/'),
    setHeaders:function (res, pathName) {
//      console.log(pathName);
      // res.setHeader('Access-Control-Allow-Origin', true);
    },   
  })
  .listen(4000, '0.0.0.0', err => {
    if (err) throw err;
    logger.info('!!!! start web server !!!!');
    logger.info('http://localhost:4000/');
  }); */


//test auth
/*fastify.after(() => {
  fastify.addHook('preHandler', fastify.basicAuth);
  
  fastify.get('/auth', (req, reply) => {
    reply.send({ hello: 'world' })
  });
});*/

//////////////////////////////////////////////////

// let io = require('socket.io')({
//   // parser: customParser
// }).listen(11102);

// //----
// let net = {};
// net.users = {};

// /**
//  * 建立未登入的使用者（有連線的使用者清單）
//  * @param socket {Object} socket.io 網路物件
//  */
// function createUser(socket) {
//   let command = require("./command/command.js");
//   let user = {};
//   user.socket = socket;
//   user.game = {};
//   //  user.token;

//   //--------------
//   // 設定命令對照表
//   user.cmdList = command.list;
//   user.cmdList.forEach(function(cmd){
//     logger.debug("register command : " + cmd.id);
//     let conf = {
//       user:user,
//       net : net,
//       io : io
//     };
//     let event = cmd.init(conf);
//     socket.on(cmd.id, event.proc);
//   });
//   return user;
// }
// net.eventConnect = function(socket){
//   logger.info('eventConnect');
// //  console.log(socket);
//   let user = createUser(socket);
//   net.users[socket] = user;
// };
// //--------------
// io.of('/1.00.0').on('connection', net.eventConnect);
// io.of('/develop').on('connection', net.eventConnect);


// logger.info('!!!! start server !!!!');
// logger.info('==============================================');




// require('../test/launcher');