'use strict';
const fs = require('fs');
const cors  = require('fastify-cors');

let corsOptions = {
  origin: [
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4000'
  ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const path = require('path');
const fastify = require('fastify')({
  // https:{
  //   key: fs.readFileSync('server/keys/privatekey.key'),
  //   cert: fs.readFileSync('server/keys/certificate.crt')
  // }
});

var send = require('send');
send.mime.define({
  'text/cache-manifest': ['appcache']
});
fastify.register(cors, corsOptions);
fastify
  .register(require('fastify-static'), {
    root: path.join(__dirname+'/../tmp/web', '/'),
    setHeaders:function (res, pathName) {
      if(pathName.indexOf('index.html') >= 0){
        res.setHeader('Service-Worker-Allowed', '/project/example/')
      }
    },
    send
  })
  .listen(4000, '0.0.0.0', err => {
    if (err) throw err;
    console.log('!!!! start web server !!!!');
    console.log('http://localhost:4000/');
  });