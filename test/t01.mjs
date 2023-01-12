 
import WebSocket from 'ws';

try {
  const ws = new WebSocket('wss://172.16.102.5:4301/av', {
    perMessageDeflate: false,
    rejectUnauthorized: false
  });
  
} catch(e) {
  console.error(e);
}
