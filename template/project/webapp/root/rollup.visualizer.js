import fs from 'fs';
import path from 'path';
import jsyaml from 'js-yaml';

import visualizer from 'rollup-plugin-visualizer';
import analyze from 'rollup-plugin-analyzer';
import postcss from 'rollup-plugin-postcss';
// import globals from 'rollup-plugin-node-globals';
// import builtins from 'rollup-plugin-node-builtins';

import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import yaml from '@rollup/plugin-yaml';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

let filename = path.resolve(__dirname + '/content.config.yml');
console.log(`filename : ${filename}`);
let content = jsyaml.load(fs.readFileSync(filename, 'utf8'));

filename = path.resolve(__dirname + '/system.set.yml');
let set = jsyaml.load(fs.readFileSync(filename, 'utf8'));
let config = set.config;
let external = set.build.externals;
console.log(`external:${external}`);
console.log('==============================');
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
let dirname = path.resolve(workspace.basePath + '/' + config.paths['style/']);
console.log(`dirname:${dirname}`);
let paths = {
  resolve: ['.ts', '.js', '.mjs', '.yml', '.css', '.json'],
  entries: []
};
let keys = Object.keys(config.paths);
console.log(`==============================`);
console.log(`keys list`);

let entries = paths.entries;
keys.forEach(key => {
  let name = key;
  let n = key.lastIndexOf('/');
  if(n >= 0) {
    name = key.slice(0, n);
  }
  let dirname = path.resolve(workspace.basePath + '/' + config.paths[key]);
  entries.push({
    find: name,
    replacement: dirname
  });
  console.log(`    ${name} -> ${dirname}`);
});


let input = `${workspace.root}/${workspace.input}`;
let output = {
  format: (content.template && content.template.debug && content.template.debug.format) || 'iife',
  sourcemap: true
};
if(content.framework.useCodeSplitting) {
  output.chunkFileNames = "[name]-[hash].js";
  output.dir = `${workspace.root}/tmp/report`;
} else {
  output.file = `${workspace.root}/tmp/report/${workspace.output}.js`;
}

if(output.format === 'iife') {
  output.name = content.name;
} else {
  output.name = null;
}

let visualTemplate = 'sunburst';
if(process.env.VISUAL_TEMPLATE){
  switch (process.env.VISUAL_TEMPLATE) {
    case '1':
      visualTemplate = 'sunburst';
      break;
    case '2':
      visualTemplate = 'treemap';
      break;
    case '3':
      visualTemplate = 'circlepacking';
      break;
    case '4':
      visualTemplate = 'network';
      break;
  }
}

export default [
	{
		input: input,
		external: external,
		output: output,
    plugins: [
      visualizer({
        template: visualTemplate,
        filename: `${workspace.root}/statistics.html`,
        title: workspace.current
      }),
      analyze(),
      json(),
      yaml(),
      resolve({
      }),
      commonjs({
      }),
      postcss(),
      alias(paths),
      typescript(),
    ]
	}
];
