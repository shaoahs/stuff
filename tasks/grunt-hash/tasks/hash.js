/*
 * grunt-hash
 * https://github.com/jgallen23/grunt-hash
 *
 * Copyright (c) 2012 Greg Allen
 * Licensed under the MIT license.
 */

function unixify(path) {
  return path.split('\\').join('/');
}

module.exports = function(grunt) {
  var chalk = require('chalk');
  var path = require('path');
  var getHash = require('../lib/hash');
  var fs        = require('fs');

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('hash', 'Append a unique hash to tne end of a file for cache busting.', function() {
    var options = this.options({
      workspace: "",
      srcBasePath: "",
      destBasePath: "",
      version: "",
      append: false,
      removePath:"",
      removeKey: "", // 目前只能從字串第一個字元開始移除
      flatten: false,
      skipHash: false,
      hashLength: 8,
      hashFunction: getHash,
      hashSeparator: '.'
    });
    //    var rootFolderName = 'web';
    var textureMap;
    var map = {};
    var mappingExt = path.extname(options.mapping);

    // If mapping file is a .json, read it and just override current modifications
    if(options.append){
      if (mappingExt === '.json' && grunt.file.exists(options.mapping)) {
      map = grunt.file.readJSON(options.mapping);
      }
    }
    if ( options.format && fs.existsSync(options.format) ) {
      textureMap = JSON.parse(fs.readFileSync(options.format,'utf8'));
    }


    this.files.forEach(function(file) {
      file.src.forEach(function(src) {
        var source = grunt.file.read(src);
        var hash = options.hashFunction(source, 'utf8').substr(0, options.hashLength);
        var dirname = path.dirname(src);
        var rootDir = path.relative(options.srcBasePath, dirname);
        var ext = path.extname(src);
        var basename = path.basename(src, ext);

        var dest;
        var start;
        var end;


        // Default destination to the same directory

        dest = file.dest || path.dirname(src);
        if(options.removePath.length>0){
          start = dirname.indexOf(options.removePath);
          end = dirname.length;

          if(start >= 0){
              start = start + options.removePath.length;
              dirname = dirname.substr(start, end);
              dest = dest + dirname;
          }
          //          grunt.log.writeln('dirname:' + dirname);
        }
        if(options.workspace.length > 0){
          start = dirname.indexOf(options.workspace);
          end = dirname.length;
          if(start >= 0){
            start = start + options.workspace.length;
            dirname = dirname.substr(start, end);
            dest = dest + dirname;
          }
        } else {
          if(!options.flatten){
            dest = dest + '/' + dirname;
          }
        }

        var newFile;
        let removeName = null;
        if(!options.skipBaseName){
          if(options.version.length > 0) {
            let start = basename.lastIndexOf(options.version);
            if(start > 0) {
              removeName = basename.substring(start);
            }
          }
          if(options.skipHash){
            newFile = basename + options.version + ext;
          } else {
            newFile = basename + options.version + (hash ? options.hashSeparator + hash : '') + ext;
          }
          if(removeName) {
            newFile = newFile.replace(removeName, '');
          }
        }
        else{
          if(options.skipHash){
            newFile = options.version + ext;
          } else {
            newFile = options.version + hash + ext;
          }
        }

        if(dest.lastIndexOf(options.workspace) >= 0){
            dest = dest.replace('tmp/' + options.workspace + '/', '');
        }
//        grunt.log.writeln('newFile : ' + chalk.red(newFile));
//        grunt.log.writeln('dest : ' + chalk.green(dest));
        var outputPath;
        outputPath = path.join(dest, newFile);

        // Determine if the key should be flatten or not. Also normalize the output path
        var key = path.join(rootDir, path.basename(src));
        key = unixify(key);
        //console.log('key ', key);
        if(typeof options.keymatch === 'string'){
            if(key.lastIndexOf(options.keymatch) >= 0){
                key = key.replace(options.keymatch, options.replacement);
            }
        }
        var outKey = path.relative(options.destBasePath, outputPath);
        if (options.flatten) {
          key = path.basename(src);
          outKey = path.basename(outKey);
          
          // if(removeName) {
          //   key = key.replace(removeName, '');
          // }
        }
        else{
          // remove "web/"
/*
            start = key.indexOf(rootFolderName);
            end = key.length;
            if(start == 0){
                start = start + String(rootFolderName).length + 1;
                key = key.substr(start, end);
            }
            start = outKey.indexOf(rootFolderName);
            end = outKey.length;
            if(start == 0){
                start = start + String(rootFolderName).length + 1;
                outKey = outKey.substr(start, end);
            }
*/
            if(options.workspace && options.workspace.length > 0) {
              if(outKey.lastIndexOf(options.workspace) >= 0){
                outKey = outKey.replace('tmp/' + options.workspace + '/', '');
              }
            }
//            outKey = path.basename(outKey);
        }
        if(!textureMap){
          grunt.file.copy(src, outputPath);
          //          grunt.log.writeln('Generated: ' + chalk.green(outputPath));
        }
        else {
          var fileInfo = path.parse(key);
          fileInfo.dir = unixify(fileInfo.dir);
          var filename = fileInfo.dir+'/'+ fileInfo.name + '.atlas';
          var tmapKey = filename;
          if (options.removeKey.length > 0) {
            tmapKey = tmapKey.replace(options.removeKey, '');
          }
          var name = textureMap[tmapKey];
          var outKeyInfo = path.parse(outKey);
          /*
          grunt.log.writeln('key: ' + key);
          grunt.log.writeln('outKey: ' + outKey);
          grunt.log.writeln('name: ' + chalk.blue(name));
          */

          if(name){
            if (options.removeKey.length > 0) {
              name = options.removeKey + name;
            }

            var outputFileInfo = path.parse(name);
            outputFileInfo.dir = unixify(outputFileInfo.dir);
            var outputFilename = outputFileInfo.dir+'/'+ outputFileInfo.name + outKeyInfo.name + '.json';
            outputPath = outputFilename;// rootFolderName + '/' + outputFilename;
            outKey = outputFilename;
            grunt.file.copy(src, outputPath);
/*
            outputFilename = rootFolderName + '/' + outputFileInfo.dir+'/'+ outputFileInfo.name + outKeyInfo.name + '.atlas';
            grunt.file.copy(rootFolderName + '/' + name, outputFilename);
*/
            outputFilename = outputFileInfo.dir+'/'+ outputFileInfo.name + outKeyInfo.name + '.atlas';
            grunt.file.copy(name, outputFilename);

//            grunt.log.writeln('Generated: ' + chalk.green(outputPath));
          }
          else{
            grunt.file.copy(src, outputPath);
          }
        }
//        grunt.log.writeln('key: ' + key);
//        grunt.log.writeln('outKey: ' + outKey);
        grunt.log.writeln('Generated: ' + chalk.green(outputPath));

        key = unixify(key);
        outKey = unixify(outKey);
        if (options.removeKey.length > 0) {
          key = key.replace(options.removeKey, '');
          outKey = outKey.replace(options.removeKey, '');
        }

        map[key] = outKey;
      });
    });

    if (options.mapping) {
      var output = '';

      if (mappingExt === '.php') {
        output = "<?php return json_decode('" + JSON.stringify(map) + "'); ?>";
      } else {
        output = JSON.stringify(map, null, "  ");
      }

      grunt.file.write(options.mapping, output);
      grunt.log.writeln('Generated mapping: ' + options.mapping);
    }

  });



};
