let Builder = require('systemjs-builder');

exports.build = function(workspace, scene, done, grunt){
  let set = workspace.set;
  let rootPath = 'project/';
  let builder = new Builder(rootPath);

  // if(!set.build.hasOwnProperty('minify')){
  //   set.build.minify = true;
  // }
  set.build.mangle = false;
  set.build.minify = false;
  set.build.runtime = false;
  if(!set.build.hasOwnProperty('format')){
    set.build.format = 'amd';
  }
  builder.config(set.config);
  builder.config({
    packages: {
      "typescript": {
        "main": "lib/typescript.js",
        "meta": {
          "lib/typescript.js": {
            "exports": "ts"
          }
        }
      }
    },
    map: {
      "ts": "sys:plugin/typescript.js",
      "typescript": "node:typescript",
      "transform-merge-sibling-variables": "node:babel-plugin-transform-merge-sibling-variables/lib/index.js",
      "transform-minify-booleans": "node:babel-plugin-transform-minify-booleans/lib/index.js",
      "transform-undefined-to-void": "node:babel-plugin-transform-undefined-to-void/lib/index.js",
      'yml': 'sys:plugin/yml.js',
      'css': 'sys:plugin/css.js',
      'plugin-babel': 'sys:plugin/plugin-babel.js',
      'systemjs-babel-build': 'sys:plugin/systemjs-babel-browser.js'
    }
  });

  let input = workspace.current + '/src/res/' + scene + '.js';
  let output = rootPath + workspace.current + '/res/' + scene + '.js';
  
  builder.buildStatic(input, output, set.build)
    .then(function(){
      console.log(' ok!');
      done();
    })
    .catch(function(err){
      console.log('error');
      if(grunt){
        grunt.fail.fatal(err)
      }
    });
};
