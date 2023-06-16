import fs from 'node:fs';
import path from 'node:path';
import jsyaml from 'js-yaml';

// import commonjs from 'rollup-plugin-commonjs';

import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
// import yaml from '@rollup/plugin-yaml';
// import typescript from '@rollup/plugin-typescript';
import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';


import yaml from '../../tasks/plugin/rollup-plugin-yaml.mjs';


let filename;
let outputExt = '.js';

// context
filename = path.resolve(process.env.WORKSPACE + '/content.config.yml');
let content = jsyaml.load(fs.readFileSync(filename, 'utf8'));

// system.set
filename = path.resolve(process.env.WORKSPACE + '/system.set.yml');
let set = jsyaml.load(fs.readFileSync(filename, 'utf8'));


if(!content.template.debug) {
  let debug = {
    format: 'cjs',
    appInLibMap: false
  }
  content.template.debug = debug;
}

if(!content.template.release) {
  let release = {
    format: 'cjs',
    appInLibMap: false
  }
  content.template.release = release;
}

//------------------------
let config = set.config;
let external = set.build.externals;

let workspace = {
  basePath: 'project',
  root: null,
  current:null,
  output:null,
  input: (set.package && set.package.main) || 'src/main.ts'
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
  extensions: ['.ts', '.mjs', '.js', '.yml', '.json']
});
let paths = {
  customResolver,
  entries: {}
};
let keys = Object.keys(config.paths);
console.log(`keys list`);

let entries = paths.entries;
keys.forEach(key => {
  let name = key;
  let n = key.lastIndexOf('/');
  if(n >= 0) {
    name = key.slice(0, n);
  }
  let dirname = path.resolve(workspace.basePath + '/' + config.paths[key]);
  entries[name] = dirname;
  console.log(`    ${name} -> ${dirname}`);
});

let input = `${workspace.root}/${workspace.input}`;
let output = {
  format: (content.template && content.template.debug && content.template.debug.format) || 'iife',
  sourcemap: true
};

let plugins = [];

if(process.env.BUILD === 'development') {

  if(output.format === 'es') {
    outputExt = '.mjs';
  }

  if(content.framework.useCodeSplitting) {
    output.chunkFileNames = `[name]-[hash]${outputExt}`;
    output.dir = `${workspace.root}/debug`;
  } else {
    output.file = `${workspace.root}/debug/${workspace.output}${outputExt}`;
  }

  plugins = [
    yaml(),
    json(),
    alias(paths),
    dynamicImportVars({
      include: [
        `${workspace.root}/src/strings/**/*`
      ]
    }),
    // typescript(),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript']
    }),
  ];
}
else if(process.env.BUILD === 'production') {

  if(output.format === 'es') {
    outputExt = '.mjs';
  }

  output = {
    format: (content.template && content.template.release && content.template.release.format) || 'iife',
    sourcemap: false
  };
  if(content.framework.useCodeSplitting) {
    output.chunkFileNames = `[name]-[hash]${outputExt}`;
    output.dir = `${workspace.root}/release`;
  } else {
    output.file = `${workspace.root}/release/${workspace.output}${outputExt}`;
  }
  plugins = [
    yaml(),
    json(),
    alias(paths),
    dynamicImportVars({
      include: [
        `${workspace.root}/src/strings/**/*`
      ]
    }),
    // typescript(),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript']
    }),
  ];
}

if(output.format === 'iife') {
  output.name = content.name;
} else {
  output.name = null;
}

export default {
  preserveEntrySignatures: 'strict',
  input: input,
  external: external,
  output: output,
  plugins: plugins
};
