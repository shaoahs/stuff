/*
 * grunt-filelist
 * https://github.com/ougi/grunt-filelist
 *
 * Copyright (c) 2014 Katsushi OUGI
 * Licensed under the MIT license.
 */

'use strict';

var fs        = require('fs'),
    path      = require('path'),
    yaml      = require('js-yaml');



module.exports = function(grunt) {

  grunt.registerMultiTask('filelist', 'Making filelist', function() {

    var options = this.options({
      basePath   : 'img',
      outputPath : './assets/img'
    });
    var baseConfig;
    if ( fs.existsSync(options.sceneConfig) ) {
      baseConfig = yaml.load(fs.readFileSync(options.sceneConfig,'utf8'));
    }
    baseConfig = baseConfig || {};

    var soundMap = {};
    function fixObjectName(name){
      var strList = name.split('_');
      var result = '';
      strList.forEach(function (str){
        if(str.length === 0){
          return;
        }

        if(result.length>0){
          var tmp = str.charAt(0);
          result += tmp.toUpperCase();
          result += str.substr(1);
        }
        else{
          result = str;
        }
      });
      return result;
    }
    function createAsset(str, group){
      group.push(str);
    }
    function createSound(str, group){
      var info = path.parse(str);
      var id = info.dir + '/' + info.name;
      var name = info.name;
      var ext = info.ext;
      var snd = soundMap[id];
      if(!snd){
        snd = {
          objName: fixObjectName(name),
          config:{
            loop:false,
            src:[]
          }
        };
        group.push(snd);
        soundMap[id] = snd;
      }
      if(ext === '.wav'){
        snd.config.src.unshift(str);
      }
      else{
        snd.config.src.push(str);
      }
      // fs.writeFileSync( dest, '  - #註解\n',{flag:'a'});
      // fs.writeFileSync( dest, '    objName: null\n',{flag:'a'});
      // fs.writeFileSync( dest, '    config:\n',{flag:'a'});
      // fs.writeFileSync( dest, '      src:\n',{flag:'a'});
      // fs.writeFileSync( dest, '      - ' + str + '\n',{flag:'a'});
      // fs.writeFileSync( dest, '      loop: false\n',{flag:'a'});
      // fs.writeFileSync( dest, '  \n',{flag:'a'});
    }

    function parseGroup(object, string, conf){
      var strList = string.split('/');
      var group = object;
      strList.forEach(function (str){
        if(str.length === 0){
          return;
        }
        var child = {};
        if(conf && conf[str]){
          child = [];
        }
        if(Array.isArray(group)){
          var check = false;
          grunt.log.writeln(' start check');
          group.some(function (sub){
            grunt.log.writeln(str + ' group sub: ' + sub[str]);
            if(sub.hasOwnProperty(str)){
              child = sub[str];
              check = true;
            }
            return check;
          });
          if(!check){
            var sub ={};
            sub[str] = child;
            group.push(sub);
          }
        }
        else{
          if(group.hasOwnProperty(str)){
            child = group[str];
          }
          else{
            group[str] = child;
          }
        }
        group = child;
      });
      return group;
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var dest = f.dest;
      var curDir = null;


      // if ( fs.existsSync(dest) ) {
      //   fs.unlinkSync(dest);
      // }

      // if(options.type === 'sound'){
      //   fs.writeFileSync( dest, "" + options.groupName + ':\n' );
      // }
      // else{
      //     fs.writeFileSync( dest, "" + options.groupName + ':\n' );
      //     fs.writeFileSync( dest, '  groupName: #註解\n',{flag:'a'});
      // }
      var basePath = f.basePath || options.basePath;
      var objects = {};
      var mainGroup = {};
      if(f.type === 'image'){
        objects['images'] = mainGroup;
        mainGroup[options.groupName] = {};
        mainGroup = mainGroup[options.groupName];
        if ( fs.existsSync(dest) ) {
          fs.unlinkSync(dest);
        }
      }
      else if(f.type === 'sound'){
//        fs.writeFileSync( dest, "" + options.groupName + ':\n' );
        objects['sounds'] = mainGroup;
        mainGroup[options.groupName] = [];
        mainGroup = mainGroup[options.groupName];
        if ( fs.existsSync(dest) ) {
          fs.unlinkSync(dest);
        }
      }
      else if(f.type === 'asset'){
//        fs.writeFileSync( dest, "" + options.groupName + ':\n',{flag:'a'});
        mainGroup = [];
        objects['assets'] = mainGroup;
      }
      else if(f.type === 'spine'){
        objects['spines'] = mainGroup;
        mainGroup[options.groupName] = {};
        mainGroup = mainGroup[options.groupName];
        if ( fs.existsSync(dest) ) {
          fs.unlinkSync(dest);
        }
      }
      else if(f.type === 'bones'){
        objects['bones'] = mainGroup;
        mainGroup.data = [];
        mainGroup.resource = [];
        if ( fs.existsSync(dest) ) {
          fs.unlinkSync(dest);
        }
      }
      //-----------------------------------------------------------------------------
      var src = f.src.filter(function(filepath) {
//        grunt.log.writeln('filepath : ' + filepath);
        var dir = path.dirname(filepath);
        dir = dir.substring(dir.lastIndexOf(basePath) + basePath.length + 1);

//        grunt.log.writeln('dir : ' + dir);

        var str = options.outputPath + "/" + dir + "/" + path.basename(filepath);
//        grunt.log.writeln('str : ' + str);

        var name;
        var group = mainGroup;
        var info = path.parse(str);
//        grunt.log.writeln('info : ' + JSON.stringify(info));

        if(f.type === 'image') {
          group = parseGroup(mainGroup, dir, baseConfig.images);
          name = fixObjectName(info.name);
          if(Array.isArray(group)){
            group.push(str);
          }
          else{
            group[name] = str;
          }
        }
        else if(f.type === 'sound') {
          createSound(str, group);
        }
        else if(f.type === 'asset') {
          createAsset(str, group);
        }
        else if(f.type === 'spine') {
          group = parseGroup(mainGroup, dir, baseConfig.spines);
          name = fixObjectName(info.name);
          if(Array.isArray(group)){
            group.push(str);
          }
          else{
            group[name] = str;
          }
        }
        else if(f.type === 'bones') {
          if(info.ext === '.json'){
            group = mainGroup.data;
            group.push(str);
          }
          else if(info.ext === '.atlas'){
            var strList = str.split('/');
            var subName = strList[strList.length-2];
            group = mainGroup.resource;
            group.push({
              atlas: str,
              texture:{
                group: options.groupName + '.bones.' + subName,
                name: info.name
              }
            });
          }
        }
      });
      var buffer = yaml.dump(objects);

      //----------------------------------------------------
      // not used
      var keyword = '- objName:';
      function addComment(buffer, index){
        var first;
        var strList;
        var last;
        var strList = buffer.split("\n");
        strList.forEach(function(str){
          grunt.log.writeln('str : ' + str);
          if(str.includes(keyword)){
            fs.writeFileSync( f.dest, '\n    #註解\n',{flag:'a'});
          }
          fs.writeFileSync( f.dest, str + '\n', {flag:'a'});
        });
      }
      //----------------------------------------------------

      if(f.type === 'asset'){
        fs.writeFileSync( f.dest, buffer, {flag:'a'});
      }
      else{
//        addComment(buffer);
        fs.writeFileSync( f.dest, buffer);
      }
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });
};
