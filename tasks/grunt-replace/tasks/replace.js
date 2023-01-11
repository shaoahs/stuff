
/*
 * grunt-replace
 *
 * Copyright (c) 2015 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/grunt-replace/blob/master/LICENSE-MIT
 */

'use strict';

// plugin

module.exports = function (grunt) {

  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');
  var _ = require('lodash');
  var Applause = require('applause');

  grunt.registerMultiTask('replace', 'Replace text patterns with applause.', function () {

    // took options
    // var d = new Date();
    // var currentTime = d.getTime();

    var options = this.options({
      encoding: grunt.file.defaultEncoding,
      // processContent/processContentExclude deprecated renamed to process/noProcess
      processContentExclude: [],
      mode: false,
      patterns: [],
      excludeBuiltins: false,
      force: true,
      silent: false,
      pedantic: false
    });
    if(options.type){
      grunt.log.writeln('type: ' + options.type);
    }
    // attach builtins

    var patterns = options.patterns;

    if (options.excludeBuiltins !== true) {
      patterns.push({
        match: '__SOURCE_FILE__',
        replacement: function (match, offset, string, source, target) {
          return source;
        },
        builtin: true
      }, {
        match: '__SOURCE_PATH__',
        replacement: function (match, offset, string, source, target) {
          return path.dirname(source);
        },
        builtin: true
      }, {
        match: '__SOURCE_FILENAME__',
        replacement: function (match, offset, string, source, target) {
          return path.basename(source);
        },
        builtin: true
      }, {
        match: '__TARGET_FILE__',
        replacement: function (match, offset, string, source, target) {
          return target;
        },
        builtin: true
      }, {
        match: '__TARGET_PATH__',
        replacement: function (match, offset, string, source, target) {
          return path.dirname(target);
        },
        builtin: true
      }, {
        match: '__TARGET_FILENAME__',
        replacement: function (match, offset, string, source, target) {
          return path.basename(target);
        },
        builtin: true
      });
    }
    //---------------------------------------------
    var data,
        cnts,
        i,
        tmpname,
        str;
    if(typeof options.jsonfile === 'string'){
        if(fs.existsSync(options.jsonfile)){
            data = fs.readFileSync(options.jsonfile, 'utf8');
            str = JSON.parse(data);
            patterns.push({json:str});
        }
        else{
            grunt.log.writeln('no found jsonfile : ' + chalk.red(options.jsonfile));
        }
    }
    else if(typeof options.jsonfile === 'object'){
        for(i= 0, cnts = options.jsonfile.length; i<cnts; i = i + 1){
            tmpname = options.jsonfile[i];
            if(fs.existsSync(tmpname)) {
                data = fs.readFileSync(tmpname, 'utf8');
                str = JSON.parse(data);
                patterns.push({
                  json:str
                });
            }
            else{
                grunt.log.writeln('no found jsonfile : ' + chalk.red(tmpname));
            }
        }
    }
    // create applause instance

    var applause = Applause.create(_.extend({}, options, {
      // private
      detail: true
    }));

    // took code from copy task

    var tally = {
      dirs: 0,
      files: 0,
      replacements: 0,
      details: []
    };

    this.files.forEach(function (filePair) {
      var dest = filePair.dest;
      var isExpandedPair = filePair.orig.expand || false;
      filePair.src.forEach(function (src) {
        src = unixifyPath(src);
        dest = unixifyPath(dest);
        if (detectDestType(dest) === 'directory') {
          dest = (isExpandedPair) ? dest : path.join(dest, src);
        }
        if (grunt.file.isDir(src)) {
          grunt.file.mkdir(dest);
          tally.dirs++;
        } else {
          var res = replace(src, dest, options, applause);
          tally.details = tally.details.concat(res.detail);
          tally.replacements += res.count;
          tally.files++;
        }
        if (options.mode !== false) {
          fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
        }
      });
    });
    // warn for unmatched patterns in the file list

    if (options.silent !== true) {
      var count = 0;
      patterns.forEach(function (pattern) {
        if (pattern.builtin !== true) { // exclude builtins
          var found = _.find(tally.details, 'source', pattern);
          if (!found) {
            count++;
          }
        }
      });
      if (count > 0) {
        var strWarn = [
          'Unable to match ',
          count,
          count === 1 ? ' pattern' : ' patterns'
        ];
        if (applause.options.usePrefix === true) {
          strWarn.push(
            ', remember for simple matches (String) we are using the prefix ',
            applause.options.prefix,
            ' for replacement lookup'
          );
        }
        strWarn.push(
          '.'
        );
        if (options.pedantic === true) {
          grunt.fail.warn(strWarn.join(''));
        } else {
          grunt.log.warn(strWarn.join(''));
        }
      }
      var str = [
        tally.replacements,
        tally.replacements === 1 ? ' replacement' : ' replacements',
        ' in ',
        tally.files,
        tally.files === 1 ? ' file' : ' files',
        '.',
      ];
      grunt.log.ok(str.join(''));
    }
    //-----------------------
    // d = new Date();
    // grunt.log.writeln('time: ' +((d.getTime() - currentTime) * 0.001).toString());
  });

  var detectDestType = function (dest) {
    if (_.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var unixifyPath = function (filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  var replace = function (source, target, options, applause) {
    var res;
    var patterns = options.patterns;
    grunt.file.copy(source, target, {
      encoding: options.encoding,
      process: function (content) {
        if(options.type == 'flat'){
          var fileInfo = path.parse(source);

          // console.log(fileInfo);
          console.log(options.workspace);

          if(!options.workspace) {
            options.workspace = grunt.dir;
          }
          fileInfo.dir = fileInfo.dir.replace(options.workspace + '/', '');

          // grunt.log.writeln('|| ------------------------------');
          // grunt.log.writeln('- dir: ' + fileInfo.dir);
          // grunt.log.writeln('- filename: ' + fileInfo.base);

          patterns.forEach(function(pattern){
            var json = pattern.json;
            var names;
            var state = false;
            var tmpList = [];
            if(json){
              names = Object.getOwnPropertyNames(json);
            }
            if(names){
              names.forEach(function(name){
                var nameInfo = path.parse(name);
                // grunt.log.writeln('-- dir: ' + nameInfo.dir + ' filename: ' + nameInfo.base);

                if(fileInfo.dir === nameInfo.dir) {
                  
                  // grunt.log.writeln(chalk.red('-- dir: ' + nameInfo.dir + 'target: ' + nameInfo.base));
                  // grunt.log.writeln(chalk.red('-- replace: ' + path.parse(json[name]).base));
                  json[nameInfo.base] = path.parse(json[name]).base;
                  tmpList.push({name:nameInfo.base});
                  state = true;
                }
              });
              if(state){
                res = applause.replace(content, [source, target]);
                tmpList.forEach(function(tmp){
                  delete json[tmp.name];
                });
              }
            }
          })
        }
        else{
          res = applause.replace(content, [source, target]);
        }
        var result = res.content;
        // force contents
        if (result === false && options.force === true) {
          result = content;
        }
        if (result !== false) {
          grunt.verbose.writeln('Replace ' + chalk.cyan(source) + ' → ' +
            chalk.green(target));
        }
        return result;
      },
      noProcess: options.noProcess || options.processContentExclude
    });
    return res;
  };
};
