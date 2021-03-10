import YAML from 'js-yaml';
import { createFilter, makeLegalIdentifier, dataToEsm } from '@rollup/pluginutils';

export default function myExample (options = {}) {

  return {
    name: 'my-example', // this name will show up in warnings and errors
    augmentChunkHash ( chunkInfo ) {
//       console.log(chunkInfo.name);
      if(chunkInfo.name === 'fingerprint2') {
//         console.log(chunkInfo);
      }

      return null;
    },
    renderChunk(code, chunk, options) {
       console.log(`renderChunk ${chunk.name}`);
      if(chunk.name === 'fingerprint2') {
//         console.log(chunk);
//         console.log('=========================');
//         console.log(code);
//         return `zzzz ${code}`;
        
      }
    },
    transform(code, id) {
       console.log(`transform ${id}`);
       if(id === '/home/dott/html/javascript/astro/stuff/project/agent/src/browser/common.js') {
         console.log(code);
         return `\n/* javascript-obfuscator:disable */\n${code}\n/* javascript-obfuscator:enable */\n`;
       }
    }
    
//     resolveId(source, importer) {
//       console.log(`resolveId ${importer}`);
//       if(importer === '/home/dott/html/javascript/astro/stuff/project/agent/src/browser/ios/unset.js') {
//         console.log(source);
//       }
//     }

//     load ( id ) {
//       console.log('[load]');
//       console.log(id);
//       if (id === 'virtual-module') {
//         return 'export default "This is virtual!"'; // the source code for "virtual-module"
//       }
//       return null; // other ids should be handled as usually
//     }
  };
}
