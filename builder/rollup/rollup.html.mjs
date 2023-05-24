import fs from 'node:fs';
import path from 'node:path';
import jsyaml from 'js-yaml';

import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
// import yaml from '@rollup/plugin-yaml';
import resolve from '@rollup/plugin-node-resolve';
// import typescript from '@rollup/plugin-typescript';
import sucrase from '@rollup/plugin-sucrase';

import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
// import {terser} from 'rollup-plugin-terser';

import nodePolyfills from 'rollup-plugin-polyfill-node';

import yaml from '../../tasks/plugin/rollup-plugin-yaml.mjs';

let drop_console = false;
if(process.env.DROP_CONSOLE === 'true') {
  drop_console = true;
}

let filename;

// context
filename = path.resolve(process.env.WORKSPACE + '/content.config.yml');
let content = jsyaml.load(fs.readFileSync(filename, 'utf8'));

// system.set
filename = path.resolve(process.env.WORKSPACE + '/system.set.yml');
let set = jsyaml.load(fs.readFileSync(filename, 'utf8'));

//------------------------
let config = set.config;
let external = set.build.externals;

let workspace = {
  basePath: 'project',
  root: null,
  current:null,
  output:null,
  input: (set.package && set.package.main) || 'src/main.js'
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
  extensions: ['.ts', '.js', '.yml', '.json', '.css']
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

let input = `${workspace.root}/${workspace.input}`;
let output = {
  format: (content.template && content.template.debug && content.template.debug.format) || 'iife',
  sourcemap: true
};

if(content.framework.useCodeSplitting) {
  output.chunkFileNames = "[name]-[hash].js";
  output.dir = `${workspace.root}/debug`;
} else {
  output.file = `${workspace.root}/debug/${workspace.output}.js`;
}


let plugins = [
  alias(paths),
  yaml(),
  json(),
  commonjs({
  }),
  postcss(),
  nodePolyfills(),
  resolve({
    preferBuiltins: false,
    browser:true
  }),
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

if(process.env.BUILD === 'production'){
  output = {
    format: (content.template && content.template.release && content.template.release.format) || 'iife',
    sourcemap: false
  };

  if(content.framework.useCodeSplitting) {
    // output.chunkFileNames = "[name].[hash].js";
    output.chunkFileNames = `${content.group}-${content.name}.[hash].js`;
    output.dir = `${workspace.root}/release`;
  } else {
    output.file = `${workspace.root}/release/${workspace.output}.js`;
  }
  
  plugins = [
    alias(paths),
    yaml(),
    json(),
    commonjs({
    }),
    postcss(),
    nodePolyfills(),
    resolve({
      preferBuiltins: false,
      browser:true
    }),
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

  output.plugins = [];

  if(content.framework.skipCommandTerser) {
    output.plugins.push(terser({
      mangle: true,
      compress:{
          // toplevel: true,
          passes: 1,
          defaults: true,
          ecma: '2017',
          drop_console
        }
      })
    );
  }
}

output.inlineDynamicImports = !!content.framework.inlineDynamicImports;
if(output.format === 'iife') {
  output.name = content.name;
  output.inlineDynamicImports = true;
} else {
  output.name = null;
}
let treeshake = {};
if(output.format === 'esm') {
  treeshake = {
    moduleSideEffects: 'no-external'
  };
}

export default {
  // watch: {
  //   include: [`${workspace.root}/src/**`,`${workspace.root}/res/**/*.yml`]
  // },
  preserveEntrySignatures: 'strict',
  input: input,
  external: external,
  output: output,
  plugins: plugins,
  treeshake
};
