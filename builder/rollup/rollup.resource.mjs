import fs from 'node:fs';
import path from 'node:path';
import jsyaml from 'js-yaml';

import atlas from '../../tasks/plugin/rollup-plugin-atlas.mjs';

import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import resolve from '@rollup/plugin-node-resolve';

// import typescript from '@rollup/plugin-typescript';
// import sucrase from '@rollup/plugin-sucrase';
import virtual from '@rollup/plugin-virtual';
import {terser} from 'rollup-plugin-terser';
import globImport from 'rollup-plugin-glob-import';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';


let templateVersion = 'game.4.0';
let templateFormat = 'esm';
if(process.env.TEMPLATE_VERSION && process.env.TEMPLATE_VERSION.length > 0) {
  templateVersion = process.env.TEMPLATE_VERSION;
}
if(templateVersion === 'game.2.0') {
  templateFormat = 'system';
}

let filename;

// context
filename = path.resolve(process.env.WORKSPACE + '/content.config.yml');
let content = jsyaml.load(fs.readFileSync(filename, 'utf8'));

// system.set
filename = path.resolve(process.env.WORKSPACE + '/system.set.yml');
let set = jsyaml.load(fs.readFileSync(filename, 'utf8'));

let config = set.config;
let external = set.build.externals;

if(process.env.WORKSPACE){
  filename = path.resolve(process.env.WORKSPACE + '/res.config.yml');
} else {
  filename = path.resolve(__dirname + '/res.config.yml');
}
let langID = process.env.LANG_ID || 'en-us';
let resName = null;
if(process.env.RES_NAME && process.env.RES_NAME !== 'undefined') {
  resName = process.env.RES_NAME;
}
// console.log('resName:', resName);

let res = jsyaml.load(fs.readFileSync(filename, 'utf8'));
//console.log(res);
//console.log('==============================');
let workspace = {
  basePath: 'project',
  root: null,
  current:null,
  output:null,
};
if(content.group && content.name) {
  workspace.root = workspace.basePath + '/' + content.group + '/' + content.name;
  workspace.current = content.group + '/' + content.name;
  workspace.output = content.group + '.' + content.name;
  
} else if(content.name) {
  workspace.root = workspace.basePath + '/' + content.name;
  workspace.current = content.name;
  workspace.output = content.name;
}


let dir = path.resolve(process.env.WORKSPACE + '/tmp');
if(!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
filename = `${dir}/nameMap.js`;
if(!fs.existsSync(filename)) {
  let javascript = fs.openSync(filename, 'w');
  fs.writeSync(javascript, `import * as nameMap from './nameMap/**/*.js';\n`);
  fs.writeSync(javascript, `export default nameMap;`);
  fs.closeSync(javascript);
}

const customResolver = resolve({
  extensions: ['.ts', '.js', '.json', '.yml', '.css', '.atlas']
});
let paths = {
  customResolver,
  entries: {}
};
config.paths['tmp/'] = `${workspace.current}/tmp/`;

let keys = Object.keys(config.paths);
// console.log(`keys list`);

let entries = paths.entries;
keys.forEach(key => {
  let name = key;
  let n = key.lastIndexOf('/');
  if(n >= 0) {
    name = key.slice(0, n);
  }
  let dirname = config.paths[key];
  if(dirname[0] !== '/') {
    dirname = workspace.basePath + '/' + config.paths[key];
  } else {
    dirname = dirname.slice(1);
  }
  dirname = path.resolve(dirname);
  entries[name] = dirname;
  // console.log(`    ${name} -> ${dirname}`);
});

let jobs = [];


// console.log('======================');
// console.log(process.env);

if(process.env.GENERATOR_VENDOR) {

  if(process.env.GENERATOR_VENDOR === 'v1') {
    let input = `${workspace.root}/${res.vendor.source}`;
    let output = [
      {
        file: `${workspace.root}/tmp/vendor.js`,
        format: 'cjs',
        intro: '/*eslint-disable camelcase max-len*/',
        outro: '/*eslint-enable camelcase max-len*/',
        sourcemap: false,
        sourcemapExcludeSources: true
      }
    ];
    // console.log(`input : ${input}`);
    // console.log(`output file: ${output[0].file}`);
    let job = {
      input: input,
      external: external,
      output: output,
      plugins: [
        yaml(),
        json(),
        //        atlas(),
        alias(paths),
        // typescript()
      ]
    };
    jobs.push(job);

  } else if (process.env.GENERATOR_VENDOR === 'v2') {
    function a() {
      let input = `${workspace.root}/${res.vendor.source}`;
      let output = [
        {

          // chunkFileNames: "[name]-[hash].js",
          dir: `${workspace.root}/tmp/vendor`,
          format: 'cjs',
          // intro: '/*eslint-disable camelcase max-len*/',
          // outro: '/*eslint-enable camelcase max-len*/',
          sourcemap: false,
          sourcemapExcludeSources: true
        }
      ];
      console.log(`input : ${input}`);
      console.log(`output : ${output[0].dir}`);
      let test = '';
      if(resName) {
        test = `import * as ${resName} from 'makeres/${resName}'
        export {
          ${resName}
        }
        `;

      } else {
        if(res.vendor.sceneList) {
          let names = [];
          if(Array.isArray(res.vendor.sceneList)) {
            names = res.vendor.sceneList;
          }
          names.forEach(scene => {
            test += `import * as ${scene} from 'makeres/${scene}'` + '\n';
          });
  
          test += 'export {';
          names.forEach(scene => {
            test += `  ${scene}` + ',\n';
          });
          test += '}';
        }
      }
      output.sourcemap = false;
      output.sourcemapExcludeSources = true;

    
      let job = {
        input: input,
        external: external,
        output: output,
        plugins: [
          yaml(),
          json(),
          alias(paths),
          virtual({
            res: test
          }),
          dynamicImportVars({
            include: [
              `${workspace.root}/src/makeres/**/*`
            ]
          }),
        ]
      };
      jobs.push(job);
    }
    a();
  }
} else {
  if(process.env.MAKERES_VENDOR === 'v1') {
    let input = `${workspace.root}/tmp/resource.js`;
    let output = [
      {
        file: `${workspace.root}/${res.vendor.output}`,
        format: templateFormat,
        intro: '/*eslint-disable camelcase*/\n/*eslint-disable max-len*/\n',
        outro: '/*eslint-enable camelcase*/\n/*eslint-enable max-len*/\n',
        sourcemap: false,
        sourcemapExcludeSources: true
      }
    ];
    let job = {
      input: input,
      external: external,
      output: output,
      plugins: [
        yaml(),
        json(),
        atlas(),
        alias(paths),
      ]
    };
    jobs.push(job);

    console.log(`input : ${input}`);
    console.log(`output : ${res.vendor.output}`);

  } else if(process.env.MAKERES_VENDOR === 'v2') {
    let filename = `${workspace.root}/tmp/resource/${langID}`;
    let resDir = [];
    if (resName) {
      resDir.push(resName + '.js');
    } else {
      if(Array.isArray(res.vendor.sceneList)) {
        res.vendor.sceneList.forEach(scene => {
          resDir.push(scene + '.js');
        });
      } else {
        resDir = fs.readdirSync(filename);
      }
    }
    console.log(resDir);
  
    resDir.forEach(name => {
      let input = `${filename}/${name}`;
      let output = [
        {
          dir: `${workspace.root}/res/vendor/${langID}`,
          format: templateFormat,
          plugins: [
            terser({
              mangle: true,
              compress:{
                passes: 1,
                ecma: '2015',
                drop_console: true
              }
            })
          ],
          sourcemap: false,
          sourcemapExcludeSources: true
        },
      ];
      // console.log(`input : ${input}`);
      // console.log(`output: ${output[0].dir}`);

      let job = {
        input: input,
        external: external,
        output: output,
        plugins: [
          yaml(),
          json(),
          atlas(),
          alias(paths)
        ]
      };
      jobs.push(job); 
    });
    
    let obj = {
      input: `${workspace.root}/tmp/nameMap.js`,
      output: {
        file: `${workspace.root}/src/nameMap.js`,
        format: 'esm',
      },
      plugins: [
        yaml(),
        json(),
        globImport({
          // rename(name, id) {
          //   console.log(id);
          //   return name;
          // }
        })
      ]
    };
    jobs.push(obj);
  }
}

export default jobs;
