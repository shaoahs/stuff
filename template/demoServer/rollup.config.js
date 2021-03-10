import fs from 'fs';
import path from 'path';
import jsyaml from 'js-yaml';


import globImport from 'rollup-plugin-glob-import';

import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';


let filename;
if(process.env.WORKSPACE) {
  filename = path.resolve(process.env.WORKSPACE + '/content.config.yml');
} else {
  filename = path.resolve(__dirname + '/content.config.yml');
}
console.log(`filename : ${filename}`);
let content = jsyaml.safeLoad(fs.readFileSync(filename, 'utf8'));

//------------------------
if(process.env.WORKSPACE) {
  filename = path.resolve(process.env.WORKSPACE + '/system.set.yml');
} else {
  filename = path.resolve(__dirname + '/system.set.yml');
}
let set = jsyaml.safeLoad(fs.readFileSync(filename, 'utf8'));
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
  extensions: ['.ts', '.js', '.yml', '.json']
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
  file: `${workspace.root}/release/${workspace.output}.js`,
  format: (content.template && content.template.debug && content.template.debug.format) || 'iife',
  sourcemap: true
};

let plugins = [
  yaml(),
  json(),
  // resolve({
  // }),
  // commonjs({
  // }),
  alias(paths),
  typescript(),
];
if(process.env.BUILD === 'production') {
  output = {
    file: `${workspace.root}/release/${workspace.output}.js`,
    format: (content.template && content.template.release && content.template.release.format) || 'iife',
    sourcemap: false
  };
  plugins = [
    yaml(),
    json(),
    // resolve({
    // }),
    // commonjs({
    // }),
    alias(paths),
    typescript(),
  ];
}

if(output.format === 'iife') {
  output.name = content.name;
} else {
  output.name = null;
}


let options = {
  // rename (name, id) {
  //   console.log(`name:${name}  id:${id}`);
  //   return name;
  // }
};

export default [
  {
    input: `${workspace.root}/test/input.ts`,
    output: {
      file: `${workspace.root}/src/test.ts`,
      format: 'es',
    },
    plugins: [
      yaml(),
      json(),
      typescript(),
      globImport()
    ]
  },
  {
    input: input,
    external: external,
    output: output,
    plugins: plugins
  }
];
