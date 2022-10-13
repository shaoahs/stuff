import fs from 'node:fs';
import path from 'node:path';
import jsyaml from 'js-yaml';

import postcss from 'rollup-plugin-postcss';
import globImport from 'rollup-plugin-glob-import';

// import typescript from '@rollup/plugin-typescript';
import sucrase from '@rollup/plugin-sucrase';

import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

let filename;

// context
filename = path.resolve(process.env.WORKSPACE + '/content.config.yml');
let content = jsyaml.load(fs.readFileSync(filename, 'utf8'));

// system.set
filename = path.resolve(process.env.WORKSPACE + '/system.set.yml');
let set = jsyaml.load(fs.readFileSync(filename, 'utf8'));

let config = set.config;

let external = [
  'pino',
  'avro',
  'ws',
  'loader',
  'mithril',
  'js-yaml',
  'protobufjs',
  'uWebSockets.js'
];
//set.build.externals;

let workspace = {
  basePath: 'project',
  root: null,
  current:null,
  output:null,
  input: null
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

const customResolver = resolve({
  extensions: ['.ts', '.js', '.json', '.yml', '.css']
});
let paths = {
  customResolver,
  entries: {}
};
config.paths['test/'] = `${workspace.current}/test/`;
config.paths['demo/'] = `${workspace.current}/test/demo/`;

let keys = Object.keys(config.paths);
// console.log(`==============================`);
console.log(`keys list`);

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
  console.log(`    ${name} -> ${dirname}`);
});


let input = `${workspace.root}/test/demo/demo.ts`;
let output = {
  format: 'cjs',
  sourcemap: false
};

if(content.framework.useCodeSplitting) {
  output.chunkFileNames = "[name].js";
  output.dir = `${workspace.root}/test`;
} else {
  output.file = `${workspace.root}/test/demo.js`;
}

if(output.format === 'iife') {
  output.name = content.name;
} else {
  output.name = null;
}

if(process.env.TEST_MODE) {

}

export default [
  {
    input: `${workspace.root}/test/input.ts`,
    external: external,
    output: {
      file: `${workspace.root}/test/output.ts`,
      format: 'es',
    },
    plugins: [
      yaml(),
      json(),
      // typescript(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript']
      }),
      globImport()
    ]
  },
  {
    input: input,
    external: external,
    output: output,
    plugins: [
      alias(paths),
      yaml(),
      json(),
      resolve({
      }),
      commonjs({
      }),
      postcss(),
      // typescript(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript']
      }),
    ]
	}
];
