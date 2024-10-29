import WebSocket from 'ws';

// console.log(WebSocket );

     let ws = new WebSocket("wss://127.0.0.1:9001/b1", {
        // perMessageDeflate: false,
        // rejectUnauthorized: false
      });

      ws.on('open', () => {
        console.log('open');
      });

      ws.on('close', () => {
        console.log('close');

      });

      ws.on('error', (err) => {
        console.log('error', err);
    });
