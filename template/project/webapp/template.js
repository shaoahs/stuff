/*
 * grunt-init-gruntfile
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = '建立 web app 專案';
exports.after = '專案建立完成';

// Template-specific notes to be displayed before question prompts.
exports.notes = '新專案';

// Any existing file or directory matching this wildcard will cause a warning.
//exports.warnOn = 'gruntfile.js';


// The actual init template.
exports.template = function(grunt, init, done) {

  const chalk = require('chalk');
  init.process({}, [
    // Prompt for these values.
    init.prompt('group','example'),
    init.prompt('name', 'sample'),
    init.prompt('package')
  ], function(err, props) {

    props.rootpath = init.destpath();
    grunt.log.writeln(props.rootpath);
    
    //=====================================================================
    var files = {};
    var srcPath;
    var destPath;
    var rootPath = '/project/' + props.group + '/'+ props.name + '/';


    //----
    grunt.log.writeln('複製遊戲資料');
    srcPath = init.srcpath( '../project/' );
    destPath = init.destpath() + '/project/' + props.group + '/'+ props.name + '/';

    grunt.file.recurse( srcPath, function( abspath, rootdir, subdir, filename ) {
      var dest;
      if ( subdir === undefined ) {
        dest = destPath + filename;
      } else {
        dest = destPath + subdir + '/' + filename;
      }
      if('.directory' !== filename){
//        grunt.log.writeln('abspath:' + abspath);
//        grunt.log.writeln('  dest:' + dest);
        grunt.file.copy( abspath, dest );
      }
    });

//    init.copyAndProcess(files, props);

    //----
    grunt.log.writeln('產生專案設定檔');
    srcPath = init.srcpath( '../root/' );
    destPath = init.destpath() + rootPath;
    grunt.file.recurse( srcPath, function( abspath, rootdir, subdir, filename ) {

      if('.directory' !== filename){
        var target;
        var source;
        if(subdir === undefined){
          target = rootPath + filename;
          source = srcPath + filename;
        }
        else{
          target = rootPath + subdir + '/' + filename;
          source = abspath;
        }
        files[target] = source;
        grunt.log.writeln('target:' + target);
        grunt.log.writeln('  source:' + source);
      }
    });
    init.copyAndProcess(files, props);
    
    
    // All done!
    done();
  });
};
