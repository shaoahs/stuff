import YAML from 'js-yaml';
import { createFilter, makeLegalIdentifier, dataToEsm } from '@rollup/pluginutils';


export default function myExample (options = {}) {

  let instance = options.instance;
  let aaaa = options;
  // instance.get('/workspace?ID=12345').then(response => {
  //   console.log('[rollup-plugin-example]', response.data);
  // });

  return {
    name: 'my-example', // this name will show up in warnings and errors
    augmentChunkHash ( chunkInfo ) {
      console.log('[augmentChunkHash]', chunkInfo.name);
      if(chunkInfo.name === 'lib') {
        console.log(chunkInfo);
      }
  
      return null;
    },

    generateBundle (options, bundle) {
      console.log('[outputOptions]', options, bundle);
    },

    // buildEnd () {
    //   console.log('[buildEnd]');

    // },

    // generateBundle(outputOptions, bundle) {
    //   console.log('generateBundle : ', outputOptions);
    //   console.log(bundle);

    // },
    // resolveId(source, importer) {
    //   console.log(`[resolveId] source:${source}, importer:${importer}`);
    // },

    // load(id) {
    //   console.log(`[load] id:${id}`);
    // },

    async renderChunk(code, chunk, options) {
      if(chunk.name === 'lib') {
        // let response = await instance.get('/workspace?ID=12345');
        // console.log(`renderChunk ${chunk.name} ${chunk.fileName}`);
        // console.log('[rollup-plugin-example]', response.data);
        console.log('=========================');
        console.log(chunk);
        // console.log('=========================');
        // console.log(options);
        // return `\n/* javascript-obfuscator:disable */\n${code}`;
      } else {
        console.log(`renderChunk ${chunk.name} ${chunk.fileName}`);
      }
    },
    
    // transform(code, id) {
    //   //  console.log(`transform ${id}`);
    //   //  if(id === '/home/dott/html/javascript/astro/stuff/project/agent/src/browser/common.js') {
    //   //   //  console.log(code);
    //   //   //  return `\n/* javascript-obfuscator:disable */\n${code}\n/* javascript-obfuscator:enable */\n`;
    //   //  }
    // }
    
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
