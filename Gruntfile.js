
module.exports = function(grunt) {
  "use strict";
  const path = require("path");
  const yaml = require('js-yaml');
  const fs   = require('fs');
  const Mustache = require('mustache');
  const colorette = require("colorette");
  const crypto = require('crypto');

  // Prints:
  const MODE = {
    ALPHA: 'alpha',
    BETA: 'beta',
    DEMO: 'demo',
    TEST: 'test',
    DEVELOPER: 'developer',
    RELEASE:'release'
  };
  console.log('[stuff version 6.13.1]');
  console.log(__dirname);
  grunt.file.setBase(__dirname);
  
  let isFramework = null;
  let pkg = {};
  let resConfig = {};
  let buffer = {};  // game card used
  // let agentPath = 'project/agent';    // 除錯用
  let agentPath = 'developer/agent';     // 遊戲專案測試用
  let workspace = {
    basePath: 'project',
    hasConfig: false,
    runMode: 'source',
    root:null,
    current:null,
    output:null,
    build:{ 
      env:''
    },
    vendor: {
      custom:{}
    },

    public:{
      skipHash: false,
      useClean: true,
      cmdList: null,
      cloneList:[
        // 主程式
        {expand: true, src: 'project/<%= pkg.current %>/app/*.js', dest: 'public/<%= pkg.currentMode %>/', filter: 'isFile'},
    
        // 設定檔
        {expand: true, src: 'project/<%= pkg.current %>/content.config.yml', dest: 'public/<%= pkg.currentMode %>/'},
        {expand: true, src: 'project/<%= pkg.current %>/config/browser.config.js', dest: 'public/<%= pkg.currentMode %>/'},
        {expand: true, src: 'project/<%= pkg.current %>/config/*.txt', dest: 'public/<%= pkg.currentMode %>/'},
        {expand: true, src: 'project/<%= pkg.current %>/config/importmap.json', dest: 'public/<%= pkg.currentMode %>/'},
    
        // 資料
        {expand: true, src: 'project/<%= pkg.current %>/data/**', dest: 'public/<%= pkg.currentMode %>/', filter: 'isFile'}
      ],
      replace:{
        src:[
          'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/**/*.{js,txt}',
          'public/<%= pkg.currentMode %>/<%= pkg.current %>/config/**/*.{js,txt}',
          'public/<%= pkg.currentMode %>/<%= pkg.current %>/app/**/*.js',
          'public/<%= pkg.currentMode %>/<%= pkg.current %>/*.html'
        ]
      },
      cleanList:null
    },
    developer:{
      cleanList:null
    },
    mode: MODE.TEST,
    set: null
  };

  function getAppName() {
    let key = `${workspace.output}.js`;
    let filename = `${workspace.root}/tmp/release.json`;
    if(!fs.existsSync(filename)) {
      return null;
    }
    let obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
    key = obj[key];

    filename = `${workspace.root}/tmp/app.json`;
    if(!fs.existsSync(filename)) {
      return null;
    }
    obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
    let name = obj[key];

    console.log(`app name : ${name}`);
    return name;
  }

  function setup() {
    let idx;
    let tmpsrc;
    let src;
    let filename;
    let conf = null;
    if(grunt.dir && grunt.dir.indexOf(__dirname) === 0){
      let dir = grunt.dir.substr(__dirname.length+1, grunt.dir.length - __dirname.length);
     //      grunt.log.writeln('dir : ' + dir);

      let strList = dir.split(path.sep);
      console.log(strList);
      if(strList.length === 3) {
        conf = {
          group:strList[1],
          name:strList[2]
        };
      }
      else if(strList.length === 2) {
        conf = {
          name:strList[1]
        };
      } else {
        grunt.log.writeln('====');
      }

      // 清除 developer 資料
      workspace.developer.cleanList = [
        'developer/<%= pkg.current %>/**/*.*',
        'developer/<%= pkg.current %>'
      ];
      workspace.basePath = strList[0];
    } else {
      isFramework = 'yes';
    }
    if(grunt.public ){
      if(grunt.public.cloneList){
        workspace.public.cloneList = grunt.public.cloneList;
      }
      if(grunt.public.cleanList){
        workspace.public.cleanList = grunt.public.cleanList;
      }
      if(grunt.public.replace && grunt.public.replace.src){
        workspace.public.replace.src = grunt.public.replace.src;
      }
      if(grunt.public.cmdList && Array.isArray(grunt.public.cmdList)){
        workspace.public.cmdList = grunt.public.cmdList;
      }
      if(grunt.public.event){
        workspace.public.event = grunt.public.event;
      }
      if(grunt.public.hasOwnProperty('useClean')){
        workspace.public.useClean = grunt.public.useClean;
      }
      if(grunt.public.hasOwnProperty('skipHash')){
        workspace.public.skipHash = grunt.public.skipHash;
      }
    }

    if(conf) {
      if(conf.group && conf.name) {
        workspace.root = workspace.basePath + '/' + conf.group + '/' + conf.name;
        workspace.current = conf.group + '/' + conf.name;
        workspace.output = conf.group + '.' + conf.name;

      } else if(conf.name) {
        workspace.root = workspace.basePath + '/' + conf.name;
        workspace.current = conf.name;
        workspace.output = conf.name;
      }
    } else {
      return false;
    }
    filename = workspace.root + '/content.config.yml';
    pkg = yaml.load(fs.readFileSync(filename, 'utf8'));
    filename = workspace.root + '/res.config.yml';
    try {
      fs.accessSync(filename, fs.constants.R_OK);
      resConfig = yaml.load(fs.readFileSync(filename, 'utf8'));
    } catch (err) {
      console.error('no use! ' + filename);
    }
    
    if(!resConfig.cache) {
      resConfig.cache = {
        src: [
          'data/**/*.{jpg,png,svg,gif,mp4,webm,wav,ogg,mp3,js,mjs}',
          'app/**/*.{js,mjs}'
        ],
        resource: [
          'systemjs/6.8.3/system.min.js'
        ],
        output: 'config/cache.txt'
      }
      resConfig.revision = {
        src: [
          'config/**/*.{json,txt}'
        ],
      }
    }

    if(!pkg.generatorVendor) {
      pkg.generatorVendor = 'v1';
    }

    if(pkg.generatorVendor === 'v2') {
      if(!resConfig.resVendor || !resConfig.resVendor.src) {
        resConfig.resVendor = {
          src:['res/vendor/**/*.js']
        }
      }
    }

    // 調整資源檔路徑
    let names = Object.getOwnPropertyNames(resConfig);
    names.forEach(function(name) {
      let obj = resConfig[name];
      if(obj && obj.src && Array.isArray(obj.src)) {
        let list = obj.src;
        for(let i=0; i< list.length; i += 1){
          list[i] = workspace.root + '/' + list[i];
        }
      } else if(Array.isArray(obj)) {
        let list = obj;
        for(let i=0; i< list.length; i += 1) {
          list[i] = workspace.root + '/' + list[i];
        }
      } else {
      }
    });

    if(resConfig.code) {
      let code = resConfig.code;
      let names = Object.getOwnPropertyNames(code);
      names.forEach(function(name) {
        let str = '/' + workspace.root + '/' + code[name];
        code[name] = str;
      });
    }

    //----
    if(resConfig.textureAsset) {
      src = resConfig.textureAsset.src;
      if(src && src.length) {
        tmpsrc = [];
        for( idx = 0; idx < src.length; idx += 1) {
          tmpsrc[idx] = workspace.root + '/tmp/' + src[idx];
        }
        resConfig.textureAsset.tmpsrc = tmpsrc;
      }
    }

    //----
    if(resConfig.textureSpine) {
      src = resConfig.textureSpine.src;
      if(src && src.length) {
        tmpsrc = [];
        for( idx = 0; idx < src.length; idx += 1) {
          tmpsrc[idx] = workspace.root + '/tmp/' + src[idx];
        }
        resConfig.textureSpine.tmpsrc = tmpsrc;
      }
    }

    //----
    if(resConfig.textureBones) {
      src = resConfig.textureBones.src;
      if(src && src.length) {
        tmpsrc = [];
        for( idx = 0; idx < src.length; idx += 1) {
          tmpsrc[idx] = workspace.root + '/tmp/' + src[idx];
        }
        resConfig.textureBones.tmpsrc = tmpsrc;
      }
    }

    // init
    filename = workspace.root  + '/system.set.yml';
    try {
      fs.accessSync(filename, fs.constants.R_OK);
      workspace.set = yaml.load(fs.readFileSync(filename, 'utf8'));
    } catch (err) {
      console.error('no use! ' + filename);
      console.error(err);
    }
    pkg.currentMode = null; //'release';
    pkg.workspace = workspace.root;
    pkg.current = workspace.current;
    pkg.output = workspace.output;
    pkg.input =  workspace.set.package.main;
    pkg.agentPath = agentPath;
    
    if(pkg.framework.builder !== 'builder' && pkg.framework.builder !== 'rollup'){
      pkg.framework.builder = 'builder';
    }

    if(!pkg.template){
      pkg.template = {
        format: 'game',
        debug: {
          config: 'template/debug.config.mustache',
          src: 'template/debug.system.html',
          dest: pkg.workspace + '/index.html',
          gamecard:{
            src: pkg.workspace + '/template/gamecard.yml',
            dest: agentPath + '/test/data/gameList.txt'
          },
        },
        release: {
          config: 'template/release.config.mustache',
          src: 'template/release.system.html',
          dest: pkg.workspace + '/index.html',
          gamecard:{
            src: pkg.workspace + '/template/gamecard.yml',
            dest: agentPath + '/test/data/gameList.txt'
          }
        }
      }
    } else {
      let fmt = pkg.template.format;
      if(fmt && (fmt !== 'game' && fmt !== 'html' && fmt !== 'nodejs')) {
        fmt = 'game';
      }
      pkg.template.format = fmt;
      let debug = pkg.template.debug;
      if (debug) {
        debug.src = pkg.workspace + '/' + (debug.src || 'template/index.html');
        debug.dest = pkg.workspace + '/' + (debug.dest || 'index.html');
        debug.config = pkg.workspace + '/' + (debug.config || 'template/debug.config.mustache');
        if(debug.gamecard){
          debug.gamecard.src = pkg.workspace + '/' + (debug.gamecard.src || 'template/gamecard.yml');
          debug.gamecard.dest = pkg.workspace + '/' + (debug.gamecard.dest || 'config/gamecard.txt');
        } else {
          debug.gamecard = {
            src: pkg.workspace + '/template/gamecard.yml',
            dest: agentPath + '/test/data/gameList.txt'
          }
        }
      } else {
        debug = {
          config: 'template/debug.config.mustache',
          src: 'template/debug.system.html',
          dest: pkg.workspace + '/index.html',
          gamecard:{
            src: pkg.workspace + '/template/gamecard.yml',
            dest: agentPath + '/test/data/gameList.txt'
          }
        };
        pkg.template.debug = debug;
      }
      if(fmt === 'nodejs') {
        if(!debug.format) {
          debug.format = 'cjs';
          debug.appInLibMap = false;
        }
      }

      let release = pkg.template.release;
      if (release) {
        release.src = pkg.workspace + '/' +(release.src || 'template/index.html');
        release.dest = pkg.workspace + '/' + (release.dest || 'index.html');
        release.config = pkg.workspace + '/' + (release.config || 'template/release.config.mustache');
        if(release.gamecard) {
          release.gamecard.src = pkg.workspace + '/' + (release.gamecard.src || 'template/gamecard.yml');
          release.gamecard.dest = pkg.workspace + '/' + (release.gamecard.dest || 'template/gamecard.yml');
        } else {
          release.gamecard = {
            src: pkg.workspace + '/template/gamecard.yml',
            dest: agentPath + '/test/data/gameList.txt'
          }
        }
      } else {
        release = {
          config: 'template/release.config.mustache',
          src: 'template/release.system.html',
          dest: pkg.workspace + '/index.html',
          gamecard:{
            src: pkg.workspace + '/template/gamecard.yml',
            dest: agentPath + '/test/data/gameList.txt'
          }
        };
        pkg.template.release = release;
      }
      if(fmt === 'nodejs') {
        if(!release.format) {
          release.format = 'cjs';
          release.appInLibMap = false;
        }
      }
    }


    if(pkg.framework.useCodeSplitting) {
      let filename = `${workspace.root}/${pkg.input}`;
      console.log(`output filename : ${filename}`);
      let fmt = path.parse(filename);

      pkg.output = fmt.name;
      workspace.output = fmt.name;

      if(!pkg.templateVersion) {
        pkg.templateVersion = 'game.4.0';
      }
    } else {
      pkg.templateVersion = 'game.3.0';
    }

    return true;
  }
  function cbStatus(err, stdout, stderr, cb) {
//    console.log(stdout);
    if (stdout.indexOf('use "git push"') >= 0 || stdout.indexOf('Changes not staged for commit') >= 0) {
      cb(Error('請確認 git 狀態是否正確 (在命令列輸入 git status)'));
      return;
    }
    cb();
  }

  setup();

  function changeMode(mode){

  }

  function copyGameCard(o) {
    let buf = JSON.stringify(o, null, 2);
    let dir = workspace.root + '/config/';

    // 確認是否有資料夾
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    let filename = dir + 'gamecard.txt';
    grunt.log.writeln(filename);
    fs.writeFileSync(filename, buf, 'utf8');
  }

  function copyGameCardDeploy(o) {
    let buf = JSON.stringify(o, null, 2);
    let dir = `public/${pkg.currentMode}/${pkg.current}/config/`;

    // 確認是否有資料夾
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    let filename = dir + 'gamecard.txt';
    grunt.log.writeln(filename);
    fs.writeFileSync(filename, buf, 'utf8');

    // demo
    filename = dir + 'demo.txt';
    grunt.log.writeln(filename);
    if(o.demo) {
      o.id = o.demo;
    } else {
      o.id = 'dm' + o.id;
    }
    buf = JSON.stringify(o, null, 2);
    fs.writeFileSync(filename, buf, 'utf8');
  }

  //-------------------------
  let config = {
    pkg: pkg,

    filelist: {
      main: {
        options: {
          sceneConfig  : '<%= pkg.workspace %>/raw/main.config.yml',
          groupName  : 'main',
          basePath   : '/<%= pkg.current %>/raw/main',
          outputPath : '/<%= pkg.workspace %>/res/main'
        },
        files: [
          {src:['<%= pkg.workspace %>/raw/main/**/*.{png,jpg}'],  dest:'<%= pkg.workspace %>/raw/main/textureList.yml', type:'image'},
          {src:['<%= pkg.workspace %>/raw/main/asset/**/*.json'],  dest:'<%= pkg.workspace %>/raw/main/textureList.yml', type:'asset'},
          {src:['<%= pkg.workspace %>/raw/main/spine/**/*.json'],  dest:'<%= pkg.workspace %>/raw/main/spineList.yml', type:'spine'},
          {src:['<%= pkg.workspace %>/raw/main/bones/**/*.{json,atlas}'],  dest:'<%= pkg.workspace %>/raw/main/bonesList.yml', type:'bones', basePath:'raw/main/bones'},
          {src:['<%= pkg.workspace %>/raw/main/sound/**/*.{wav,ogg,mp3}'],  dest:'<%= pkg.workspace %>/raw/main/soundList.yml', type:'sound', basePath:'raw/main'}
        ]
      },
      ui: {
        options: {
          sceneConfig  : '<%= pkg.workspace %>/raw/ui.config.yml',
          groupName  : 'ui',
          basePath   : '/<%= pkg.current %>/raw/ui',
          outputPath : '/<%= pkg.workspace %>/res/ui'
        },
        files: [
          {src:['<%= pkg.workspace %>/raw/ui/**/*.{png,jpg}'],  dest:'<%= pkg.workspace %>/raw/ui/textureList.yml', type:'image'},
          {src:['<%= pkg.workspace %>/raw/ui/asset/**/*.json'],  dest:'<%= pkg.workspace %>/raw/ui/textureList.yml', type:'asset'},
          {src:['<%= pkg.workspace %>/raw/ui/sound/**/*.{wav,ogg,mp3}'],  dest:'<%= pkg.workspace %>/raw/ui/soundList.yml', type:'sound'}
        ]
      },
      sub: {
        options: {
          sceneConfig  : '<%= pkg.workspace %>/raw/sub.config.yml',
          groupName  : 'sub',
          basePath   : '/<%= pkg.current %>/raw/sub',
          outputPath : '/<%= pkg.workspace %>/res/sub'
        },
        files: [
          {src:['<%= pkg.workspace %>/raw/sub/**/*.{png,jpg}'],  dest:'<%= pkg.workspace %>/raw/sub/textureList.yml', type:'image'},
          {src:['<%= pkg.workspace %>/raw/sub/bones/**/*.{json,atlas}'],  dest:'<%= pkg.workspace %>/raw/sub/bonesList.yml', type:'bones', basePath:'raw/sub/bones'},
          {src:['<%= pkg.workspace %>/raw/sub/**/*.{wav,ogg,mp3}'],  dest:'<%= pkg.workspace %>/raw/sub/soundList.yml', type:'sound'}
        ]
      }
    },

    clean: {
      tmp: {
        src: isFramework || ['<%= pkg.workspace %>/tmp/**/*.*', '<%= pkg.workspace %>/tmp/**/*', '<%= pkg.workspace %>/tmp']
      },
      test: {
        src: isFramework || ['<%= pkg.workspace %>/tmp/**/*.*', '<%= pkg.workspace %>/test/demo.*.js']
      },
      app: {
        src: isFramework || ['<%= pkg.workspace %>/app/<%= pkg.output %>*.*','<%= pkg.workspace %>/app']
      },
      config: {
        src: isFramework || ['<%= pkg.workspace %>/config/**/*.*','<%= pkg.workspace %>/config']
      },
      debug: {
          src: isFramework || ['<%= pkg.workspace %>/debug/**/*.*', '<%= pkg.workspace %>/debug/**/*', '<%= pkg.workspace %>/debug', '<%= pkg.workspace %>/tmp/debug.json']
      },
      release: {
          src: isFramework || ['<%= pkg.workspace %>/release/**/*.*', '<%= pkg.workspace %>/release/**/*', '<%= pkg.workspace %>/release', '<%= pkg.workspace %>/tmp/release.json']
      },
      public: {
        src: workspace.public && workspace.public.cleanList || [
          'public/alpha/<%= pkg.current %>/**/*',
          'public/beta/<%= pkg.current %>/**/*',
          'public/demo/<%= pkg.current %>/**/*',
          'public/framework/<%= pkg.current %>/**/*',
          'public/release/<%= pkg.current %>/**/*',
          'public/test/<%= pkg.current %>/**/*'
        ]
      },
      developer: {
        src: workspace.developer && workspace.developer.cleanList || []
      },
      data: {
        src: isFramework || ['<%= pkg.workspace %>/res/vendor/**/*.*', '<%= pkg.workspace %>/data/**/*.*', '<%= pkg.workspace %>/data']
      }
    },

    copy:{

      setup:{
        expand: true,
        flatten: true,
        src:'builder/setting/login.txt',
        dest:'developer/agent/test/data/',
      },

      demoserver:{
        cwd: 'template',
        expand: true,
        src:'demoServer/**',
        dest:'project/nodejs/',
        filter: 'isFile'
      },

      test:{
        expand: true,
        flatten: true,
        src:'<%= pkg.workspace %>/test/data/game.<%= pkg.name %>.json',
        dest:'<%= pkg.agentPath %>/test/data/',
      },

      debug:{
        src:'<%= pkg.template.debug.src %>',
        dest:'<%= pkg.template.debug.dest %>',
        options:{
          noProcess:{
            app:'<%= pkg.current %>'
          },
          process: function(content) {
            let objList = [];
            let standalone = true;
            let filename;
            if(pkg.template.format === 'game') {
              let obj = null;
              try {
                filename = pkg.template.debug.gamecard.src;
                fs.accessSync(filename, fs.constants.R_OK);
                obj = yaml.load(fs.readFileSync(filename, 'utf8'));
              } catch (err) {
                console.error('!no use! ' + filename);
                console.error(err);
              }

              if(obj) {
                filename = workspace.root + '/tmp/debug.json';
                let app = null;
                if(fs.existsSync(filename)) {
                  app = JSON.parse(fs.readFileSync(filename, 'utf8'));
                }
                if(app) {
                  app = `${workspace.root}/debug/${app[pkg.output+'.js']}`;
                } else {
                  app = `${workspace.root}/debug/${pkg.output}.js`;
                }
                obj.app = `/${app}`;

                let baseURL = '';
                if(!obj.baseURL) {
                  baseURL = `/${workspace.root}/`;
                }
                obj.devMode = 'debug';
                obj.version = pkg.version;
                if(obj.images) {
                  obj.images.icon = baseURL + obj.images.icon;
                  obj.images.logo = baseURL + obj.images.logo;
                  obj.images.background = baseURL + obj.images.background;
                }
                if(obj.overview && obj.overview.spine && obj.overview.spine.src) {
                  obj.overview.spine.src = baseURL + obj.overview.spine.src;
                }
                if(pkg.framework.builder === 'rollup') {
                  obj.templateVersion = pkg.templateVersion;

                  if(workspace.set && workspace.set.config && workspace.set.config.map) {
                    let dependence = {};
                    let maps = workspace.set.config.map;
                    let names = Object.getOwnPropertyNames(maps);

                    names.forEach(key => {
                      dependence[key] = maps[key].replace('depend:', '/dependence/');
                    });
                    
                    obj.dependence = dependence;
                  }
                }
                
                objList.push(obj);
                copyGameCard(obj);

                // 附屬專案
                filename = workspace.root + '/template/theOther.yml';
                if(fs.existsSync(filename)) {
                  let buf = fs.readFileSync(filename, 'utf8');
                  if(buf && buf.length > 0) {
                    obj = yaml.load(buf);
                    if(Array.isArray(obj)) {
                      obj.forEach(function(o) {
                        objList.push(o);
                      });
                    } else {
                      objList.push(obj);
                    }
                  }
                }

                // 是否需要更新 測試用的遊戲卡片
                if(!pkg.excluded || !pkg.excluded.autoTest){
                  filename = pkg.template.debug.gamecard.dest;
                  let buf = JSON.stringify(objList, null, 2);
              
                  let fmt = path.parse(filename);
  
                  // 確認是否有資料夾
                  if(!fs.existsSync(fmt.dir)) {
                    fs.mkdirSync(fmt.dir);
                  }
                  fs.writeFileSync(filename, buf, 'utf8');
                }
              }
              standalone = pkg.template.standalone;
            }

            if(standalone) {
              let view = {
                config: 'debug/debug.config.js',
                
                dynamicImportName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `import("${pathname}");`;
                  return str;
                },

                importmapName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `"${this.key}": "${pathname}"`;
                  if(!this.isLast) {
                    str += ',';
                  }
                  return str;
                },

                jsName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str;
                  if(!this.isLast){
                    str = `<script src="${pathname}"></script>`;
                  } else {
                    str = `<script src="${pathname}"></script>`;
                  }
                  
                  return str;
                },
                time:  Date.now(),
                app: this.noProcess.app
              };
              filename = workspace.root + '/tmp/debug.json';
              let app = null;
              if(fs.existsSync(filename)) {
                app = JSON.parse(fs.readFileSync(filename, 'utf8'));
              }
              if(app) {
                app = `/${workspace.root}/debug/${app[pkg.output+'.js']}`;
              } else {
                app = `/${workspace.root}/debug/${pkg.output}.js`;
              }
            
              let mapList = [];
              if(workspace.set && workspace.set.config && workspace.set.config.map){
                let map = workspace.set.config.map;
                let maps = null;
                if(workspace.set.config.map) {
                  maps = Object.getOwnPropertyNames(map);
                }
                maps && maps.forEach(key => {
                  let o = {
                    key: key,
                    pathname: map[key],
                  };
                  mapList.push(o);
                });
              }

              if((pkg.template.debug.format !== 'esm') && pkg.template.debug.appInLibMap) {
                let o = {
                  key: workspace.current,
                  pathname: app,
                };
                mapList.push(o);
              }

              if(pkg.template.debug.format !== 'system') {
                view.app = app;
              }
              if(mapList.length > 0) {
                mapList[mapList.length-1].isLast = true;
              }
              view.importmap = mapList;
              
              content = Mustache.render(content, view);
            } else {
              content = null;
            }
            
            return content;
          }
        }
      },

      release: {
        src:'<%= pkg.template.release.src %>',
        dest:'<%= pkg.template.release.dest %>',
        options:{
          process: function(content) {
            let objList = [];
            let standalone = true;

            if(pkg.template.format === 'game') {
              let obj = null;
              let filename;
              try {
                filename = pkg.template.release.gamecard.src;
                fs.accessSync(filename, fs.constants.R_OK);
                obj = yaml.load(fs.readFileSync(filename, 'utf8'));
              } catch (err) {
                console.error('no use! ' + filename);
                console.error(err);
              }

              filename = workspace.root + '/tmp/release.json';
              let app = null;
              if(fs.existsSync(filename)) {
                app = JSON.parse(fs.readFileSync(filename, 'utf8'));
              }
              if(app) {
                app = `${pkg.current}/release/${app[pkg.output+'.js']}`;
              } else {
                app = `${pkg.current}/release/${pkg.output}.js`;
              }

              obj.app = app;
              
              let baseURL = '';
              if(!obj.baseURL) {
                baseURL = `/${workspace.root}/`;
              }
              obj.version = pkg.version;
              if(obj.images){
                obj.images.icon = baseURL + obj.images.icon;
                obj.images.logo = baseURL + obj.images.logo;
                obj.images.background = baseURL + obj.images.background;
              }
              if(obj.overview && obj.overview.spine && obj.overview.spine.src) {
                obj.overview.spine.src = baseURL + obj.overview.spine.src;
              }
              
              if(pkg.framework.builder === 'rollup') {
                obj.templateVersion = pkg.templateVersion;
  
                if(workspace.set && workspace.set.config && workspace.set.config.map) {
                  let dependence = {};
                  let maps = workspace.set.config.map;
                  let names = Object.getOwnPropertyNames(maps);
    
                  names.forEach(key => {
                    dependence[key] = maps[key].replace('depend:', '/dependence/');
                  });
    
                  obj.dependence = dependence;
                }
              }
              
              objList.push(obj);
              copyGameCard(obj);

              //
              filename = workspace.root + '/template/theOther.yml';
              if(fs.existsSync(filename)){
                let buf = fs.readFileSync(filename, 'utf8');
                if(buf && buf.length > 0){
                  obj = yaml.load(buf);
                  if(Array.isArray(obj)){
                    obj.forEach(function(o){
                      objList.push(o);
                    });
                  } else {
                    objList.push(obj);
                  }
                }
              }

              // 是否需要更新 測試用的遊戲卡片
              if(!pkg.excluded || !pkg.excluded.autoTest) {
                filename = pkg.template.release.gamecard.dest;
                let buf = JSON.stringify(objList, null, 2);
            
                let fmt = path.parse(filename);
  
                // 確認是否有資料夾
                if(!fs.existsSync(fmt.dir)) {
                  fs.mkdirSync(fmt.dir);
                }
                fs.writeFileSync(filename, buf, 'utf8');
              }
              standalone = pkg.template.standalone;
            } 
            if(standalone) {
              let filename = workspace.root + '/tmp/release.json';
              let app = null;
              if(fs.existsSync(filename)){
                app = JSON.parse(fs.readFileSync(filename, 'utf8'));
              }
              if(app) {
                app = `./release/${app[pkg.output+'.js']}`;
              } else {
                app = `./release/${pkg.output}.js`;
              }

              let view = {
                config: 'config/browser.config.js',
                dynamicImportName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `import("${pathname}");`;
                  return str;
                },
                
                importmapName(){
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `"${this.key}": "${pathname}"`;
                  if(!this.isLast){
                    str += ',';
                  }
                  return str;
                },
                jsName(){
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str;
                  str = `<script src="${pathname}"></script>`;
                  return str;
                },
                time:  Date.now(),
                app: app
              };
              let mapList = [];
              if(workspace.set && workspace.set.config && workspace.set.config.map) {
                let map = workspace.set.config.map;
                let maps = Object.getOwnPropertyNames(map);
                maps.forEach(key => {
                  let o = {
                    key: key,
                    pathname: map[key],
                  };
                  mapList.push(o);
                });
              }
              if((pkg.template.release.format !== 'esm') && pkg.template.release.appInLibMap) {
                view.app = pkg.current;
                let o = {
                  key: workspace.current,
                  pathname: app,
                };
                mapList.push(o);
              }

              if(pkg.template.release.format !== 'system') {
                view.app = app;
              }

              if(mapList.length > 0) {
                mapList[mapList.length-1].isLast = true;
              }
              view.importmap = mapList;

              content = Mustache.render(content, view);
            } else {
              content = null;
            }

            return content;
          }
        }
      },

      app:{
        src:'<%= pkg.template.release.src %>',
        dest:'<%= pkg.template.release.dest %>',
        options:{
          noProcess:{
            app:'<%= pkg.output %>.js'
          },
          process: function(content) {
            let objList = [];
            let standalone = true;

            //
            if(pkg.template.format === 'game') {
              let obj = null;
              let filename;
              try {
                filename = pkg.template.release.gamecard.src;
                fs.accessSync(filename, fs.constants.R_OK);
                obj = yaml.load(fs.readFileSync(filename, 'utf8'));
              } catch (err) {
                console.error('no use! ' + filename);
                console.error(err);
              }

              if(resConfig.vendor && resConfig.vendor.custom) {
                let custom = workspace.vendor.custom;
                let names = Object.getOwnPropertyNames(custom);
                let app = {};
                let appHash = {};
                                
                names.forEach(lang => {
                  let pathname = pkg.current + '/app/' + custom[lang];
                  app[lang] = pathname;

                  let data = fs.readFileSync(`project/${pathname}`, 'utf8');
                  const hash = crypto.createHash('sha384');
                  hash.update(data);
                  appHash[lang] = `sha384-${hash.digest().toString('base64')}`;
                });
                obj.app = app;
                obj.appHash = appHash;
              } else {
                let app = getAppName();
                if(app) {
                  app = `${pkg.current}/app/${app}`;
                } else {
                  app = `${pkg.current}/app/${pkg.output}.js`;
                }
                obj.app = `${app}`;
                console.log('obj.app ' + obj.app ); 
                
                let pathname = `project/${app}`;
                let data = fs.readFileSync(pathname, 'utf8');
                const hash = crypto.createHash('sha384');
                hash.update(data);
                obj.appHash = `sha384-${hash.digest().toString('base64')}`;
              }

              obj.version = pkg.version;
              let baseURL = '';
              if(!obj.baseURL) {
                baseURL = `/${workspace.root}/`;
              }
              if(obj.images){
                obj.images.icon = baseURL + obj.images.icon;
                obj.images.logo = baseURL + obj.images.logo;
                obj.images.background = baseURL + obj.images.background;
              }
              
              if(obj.overview && obj.overview.spine && obj.overview.spine.src) {
                obj.overview.spine.src = baseURL + obj.overview.spine.src;
              }
  
              if(pkg.framework.builder === 'rollup') {
                  obj.templateVersion = pkg.templateVersion;

                  if(workspace.set && workspace.set.config && workspace.set.config.map) {
                  let dependence = {};
                  let maps = workspace.set.config.map;
                  let names = Object.getOwnPropertyNames(maps);
    
                  names.forEach(key => {
                    let pathname = maps[key].replace('depend:', 'dependence/');
                    if(fs.existsSync(pathname)) {
                      let data = fs.readFileSync(pathname, 'utf8');
                      const hash = crypto.createHash('sha384');
                      hash.update(data);
                      
                      pathname = '/' + pathname;
                      let o = {};
                      o.pathname = pathname;
                      o.integrity = `sha384-${hash.digest().toString('base64')}`;
    
                      dependence[key] = o;
                    }
                  });
                  obj.dependence = dependence;
                }
              }
    
              objList.push(obj);
              copyGameCard(obj);

              //
              filename = workspace.root + '/template/theOther.yml';
              if(fs.existsSync(filename)) {
                let buf = fs.readFileSync(filename, 'utf8');
                if(buf && buf.length > 0){
                  obj = yaml.load(buf);
                  if(Array.isArray(obj)){
                    obj.forEach(function(o){
                      objList.push(o);
                    });
                  } else {
                    objList.push(obj);
                  }
                }
              }

              // 是否需要更新 測試用的遊戲卡片
              if(!pkg.excluded || !pkg.excluded.autoTest) {
                filename = pkg.template.release.gamecard.dest;
                let buf = JSON.stringify(objList, null, 2);
            
                let fmt = path.parse(filename);
  
                // 確認是否有資料夾
                if(!fs.existsSync(fmt.dir)) {
                  fs.mkdirSync(fmt.dir);
                }
            
                fs.writeFileSync(filename, buf, 'utf8');
              }
              standalone = pkg.template.standalone;
            }

            if(standalone) {
              let app = getAppName();
              if(app) {
                app = `./app/${app}`;
              } else {
                app = `./app/${pkg.output}.js`;
              }

              let view = {
                config: 'config/browser.config.js',
                dynamicImportName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `import("${pathname}");`;
                  return str;
                },
                importmapName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `"${this.key}": "${pathname}"`;
                  if(!this.isLast){
                    str += ',';
                  }
                  return str;
                },
                jsName() {
                  let pathname = this.pathname.replace('depend:', 'dependence/');
                  let str;
                  let data = fs.readFileSync(pathname, 'utf8');
                  const hash = crypto.createHash('sha384');
                  hash.update(data);
                
                  pathname = '/' + pathname;
                  //str = `<script src="${pathname}" integrity="sha384-${hash.digest().toString('base64')}" crossorigin></script>`;
                  str = `<script src="${pathname}" crossorigin></script>`;
                  return str;
                },
                time:  Date.now(),
                app: `${app}`,
                appIntegrity() {
                  let pathname = `${workspace.root}/${app}`;
                  let data = fs.readFileSync(pathname, 'utf8');
                  const hash = crypto.createHash('sha384');
                  hash.update(data);
                  let str = `integrity="sha384-${hash.digest().toString('base64')}"`;
                  return str;
                }
              };

              let mapList = [];
              if(workspace.set && workspace.set.config && workspace.set.config.map) {
                let map = workspace.set.config.map;
                let maps = Object.getOwnPropertyNames(map);
                maps.forEach(key => {
                  let o = {
                    key: key,
                    pathname: map[key],
                  };
                  mapList.push(o);
                });
              }

              if((pkg.template.release.format !== 'esm') && pkg.template.release.appInLibMap) {
                view.app = pkg.current;
                let o = {
                  key: workspace.current,
                  pathname: `${app}`,
                };
                mapList.push(o);
              }

              if(pkg.template.release.format !== 'system') {
                view.app = app;
              }

              if(mapList.length > 0) {
                mapList[mapList.length-1].isLast = true;
              }
              view.importmap = mapList;

              content = Mustache.render(content, view);

            } else {
              content = null;
            }
            
            return content;
          }
        }
      },

      deploy:{
        src: '<%= pkg.template.release.src %>',
        dest: '<%= pkg.template.release.dest %>',
        options:{
          noProcess:{
            app:'<%= pkg.output %>.js',
          },
          process: function(content) {
            let standalone = true;

            // todo: 測試用
            // pkg.currentMode = 'release';
            // let filename = workspace.root + '/tmp/app.json';
            // let obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
            // workspace.vendor.custom['en-us'] = obj[workspace.output+'.js'];
            
            if(pkg.template.format === 'game') {
              let obj = null;
              let filename;
              try {
                if(!pkg.currentMode) {
                  pkg.currentMode = 'release';
                }
                filename = `public/${pkg.currentMode}/${pkg.current}/config/gamecard.txt`;
                fs.accessSync(filename, fs.constants.R_OK);
                obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
              } catch (err) {
                console.error('no use! ' + filename);
              }

              if(resConfig.vendor && resConfig.vendor.custom) {
                let custom = workspace.vendor.custom;
                let names = Object.getOwnPropertyNames(custom);
                let app = {};
                let appHash = {};

                names.forEach(lang => {
                  let pathname = `${pkg.current}/app/${custom[lang]}`;
                  if(fs.existsSync(`public/${pkg.currentMode}/${pathname}`)) {
                    let data = fs.readFileSync(`public/${pkg.currentMode}/${pathname}`, 'utf8');
                    const hash = crypto.createHash('sha384');
                    hash.update(data);
                    appHash[lang] = `sha384-${hash.digest().toString('base64')}`;
                    app[lang] = pathname;
                  } else {
                    console.error(`找不到檔案: ${pathname}`);
                  }
                });
                obj.app = app;
                obj.appHash = appHash;
              } else {
                let app = getAppName();
                if(app) {
                  app = `${pkg.current}/app/${app}`;
                } else {
                  app = `${pkg.current}/app/${pkg.output}.js`;
                }
                obj.app = app;
                
                let pathname = `public/${pkg.currentMode}/${obj.app}`;
                if(fs.existsSync(pathname)) {
                  let data = fs.readFileSync(pathname, 'utf8');
                  const hash = crypto.createHash('sha384');
                  hash.update(data);
                  obj.appHash = `sha384-${hash.digest().toString('base64')}`;
                } else {
                  console.error(`找不到檔案: ${pathname}`);
                }
              }

              obj.version = pkg.version;
              let baseURL = '';
              if(!obj.baseURL) {
                baseURL = `/public/${pkg.currentMode}/${pkg.current}/`;
              }
              obj.baseURL = `/public/${pkg.currentMode}/${pkg.current}/`;

              if(obj.images){
                obj.images.icon = baseURL + obj.images.icon;
                obj.images.logo = baseURL + obj.images.logo;
                obj.images.background = baseURL + obj.images.background;
              }
              
              if(obj.overview && obj.overview.spine && obj.overview.spine.src) {
                obj.overview.spine.src = baseURL + obj.overview.spine.src;
              }

              if(pkg.framework.builder === 'rollup') {
                obj.templateVersion = pkg.templateVersion;
  
                if(workspace.set && workspace.set.config && workspace.set.config.map) {
                  let dependence = {};
                  let maps = workspace.set.config.map;
                  let names = Object.getOwnPropertyNames(maps);
    
                  names.forEach(key => {
                    let pathname = maps[key].replace('depend:', 'dependence/');
                    if(fs.existsSync(pathname)) {
                      let data = fs.readFileSync(pathname, 'utf8');
                      const hash = crypto.createHash('sha384');
                      hash.update(data);
                      
                      pathname = `/${pathname}`;
                      let o = {};
                      o.pathname = pathname;
                      o.integrity = `sha384-${hash.digest().toString('base64')}`;
    
                      dependence[key] = o;
                    } else {
                      console.error(`找不到檔案 : ${pathname}`);
                    }
                  });
    
                  obj.dependence = dependence;
                }
              }

              copyGameCardDeploy(obj);

              standalone = pkg.template.standalone;
            }

            if(standalone) {
              let app = getAppName();
              if(app) {
                app = `./app/${app}`;
              } else {
                app = `./app/${pkg.output}.js`;
              }
              
              let view = {
                config: 'config/browser.config.js',
                dynamicImportName() {
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `import("${pathname}");`;
                  return str;
                },
                importmapName(){
                  let pathname = this.pathname.replace('depend:', '/dependence/');
                  let str = `"${this.key}": "${pathname}"`;
                  if(!this.isLast){
                    str += ',';
                  }
                  return str;
                },
                jsName(){
                  let pathname = this.pathname.replace('depend:', 'dependence/');
                  let str;
                  let data = fs.readFileSync(pathname, 'utf8');
                  const hash = crypto.createHash('sha384');
                  hash.update(data);
                  str = hash.digest().toString('base64');
                
                  pathname = `/${pathname}`;
                  // str = `<script src="${pathname}" integrity="sha384-${str}" crossorigin></script>`;
                  str = `<script src="${pathname}" crossorigin></script>`;
                  return str;
                },
                time:  Date.now(),
                app: `/public/${pkg.currentMode}/${pkg.current}/${app}`,
                appIntegrity() {
                  let pathname = `public/${pkg.currentMode}/${pkg.current}/${app}`;
                  console.log(pathname);
                  let data = fs.readFileSync(pathname, 'utf8');
                  const hash = crypto.createHash('sha384');
                  hash.update(data);
                  let str = hash.digest().toString('base64');
                  str = `integrity="sha384-${str}"`;
                  return str;
                }
              };
              let mapList = [];
              if(workspace.set && workspace.set.config && workspace.set.config.map) {
                let map = workspace.set.config.map;
                let maps = Object.getOwnPropertyNames(map);
                maps.forEach(key => {
                  let o = {
                    key: key,
                    pathname: map[key],
                  };
                  mapList.push(o);
                });
              }

              if((pkg.template.release.format !== 'esm') && pkg.template.release.appInLibMap) {
                view.app = pkg.current;
                let o = {
                  key: workspace.current,
                  pathname: `${app}`,
                };
                mapList.push(o);
              }
  
              if(pkg.template.release.format !== 'system') {
                view.app = app;
              }

              if(mapList.length > 0) {
                mapList[mapList.length-1].isLast = true;
              }
              view.importmap = mapList;

              if(content && (content.length > 0)) {
                content = Mustache.render(content, view);

                let fmt = path.parse(pkg.template.release.dest);
                let filename = fmt.base;

                filename = `public/${pkg.currentMode}/${pkg.current}/${filename}`;
                console.log(filename);
                fs.writeFileSync(filename, content, 'utf8');
              }
            } else {
              content = null;
            }
            
            return content;
          }
        }
      },

      gamecard:{
        src:'<%= pkg.workspace %>/template/gamecard.yml',
        dest:'<%= pkg.workspace %>/config/gamecard.txt',
        options:{
          noProcess:{
            app:'<%= pkg.output %>.js',
            dest:'<%= pkg.workspace %>/config/gamecard.txt'
          },
          process: function(content/*, srcpath*/) {
            let obj = yaml.load(content);
            let app = null;

            if(workspace.runMode === 'public'){
              if(resConfig.vendor && resConfig.vendor.custom) {
                let custom = workspace.vendor.custom;
                let names = Object.getOwnPropertyNames(custom);
                app = {};
                names.forEach(lang => {
                  app[lang] = pkg.current + '/app/' + custom[lang];
                });
              } else {
                app = fs.readFileSync(workspace.root + '/tmp/app.json', 'utf8');
                app = JSON.parse(app);
                app = app[this.noProcess.app];
  
                if(!app){
                  app = workspace.current + '/app/' + this.noProcess.app;
                } else {
                  app = workspace.current + '/app/' + app;
                }
              }
            } else if(workspace.runMode === 'build') {
              let filename = `${workspace.root}/tmp/${pkg.output}.json`;
              console.log(`filename: ${filename}`);
              if(fs.existsSync(filename)){
                app = JSON.parse(fs.readFileSync(filename, 'utf8'));
              } else {
                filename = `${workspace.root}/tmp/release.json`;
                if(fs.existsSync(filename)){
                  app = JSON.parse(fs.readFileSync(filename, 'utf8'));
                }
              }
              if(app){
                app = workspace.current + '/release/' + app[pkg.output + '.js'];
              }else {
                app = workspace.current + '/release/' + pkg.output + '.js';
              }
            } else {
              app = workspace.current;
              obj.devMode = 'debug';
            }

            console.log('app:' + app);

            obj.app = app;
            obj.version = pkg.version;
            let baseURL = '';
            if(!obj.baseURL) {
              baseURL = `/${workspace.root}/`;
            }
            if(obj.images){
              obj.images.icon = baseURL + obj.images.icon;
              obj.images.logo = baseURL + obj.images.logo;
              obj.images.background = baseURL + obj.images.background;
            }
            if(obj.overview && obj.overview.spine && obj.overview.spine.src) {
              obj.overview.spine.src = baseURL + obj.overview.spine.src;
            }
  
            if(pkg.framework.builder === 'rollup') {
              obj.templateVersion = pkg.templateVersion;
  
              if(workspace.set && workspace.set.config && workspace.set.config.map) {
                let dependence = {};
                let maps = workspace.set.config.map;
                let names = Object.getOwnPropertyNames(maps);
    
                names.forEach(key => {
                  dependence[key] = maps[key].replace('depend:', '/dependence/');
                });
    
                obj.dependence = dependence;
              }
              if(obj.devMode === 'debug'){
                obj.app = `/project/${workspace.current}/debug/${workspace.output}.js`;
              }
            }

            content = JSON.stringify(obj, null, 2);
            return content;
          }
        }
      },

      atlas:{
        src:'<%= pkg.workspace %>/tmp/spine.json',
        dest:'<%= pkg.workspace %>/tmp/atlas.json',
        options:{
          noProcess:{
            app:'<%= pkg.output %>.js',
            dest:'<%= pkg.workspace %>/config/gamecard.txt'
          },
          process: function(content/*, srcpath*/) {
            let re = /.json/gi;
            content = content.replace(re, '.atlas');

            return content;
          }
        }
      }
    },

    hash: {
      options: {
          mapping: 'template/assets.json', //mapping file so your server can serve the right files
          srcBasePath: '', // the base Path you want to remove from the `key` string in the mapping file
          destBasePath: '', // the base Path you want to remove from the `value` string in the mapping file
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          hashLength: 16, // hash length, the max value depends on your hash function
          hashFunction: function(source, encoding){ // default is md5
              return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
          }
      },
      resLoading: {
        options: {
          workspace: workspace.root,
          skipBaseName:true,
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          mapping: '<%= pkg.workspace %>/tmp/resLoading.json' //mapping file so your server can serve the right files
        },
        src: '<%= pkg.workspace %>/res/loading/**/*.{png,wav,ogg,mp3}',  //all your js that needs a hash appended to it
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      res: {
        options: {
          workspace: workspace.root,
          skipBaseName:true,
          flatten: false,
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          mapping: '<%= pkg.workspace %>/tmp/res.json' //mapping file so your server can serve the right files
        },
        src: resConfig.res && resConfig.res.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      vendor: {
        options: {
          workspace: workspace.root,
          skipBaseName:true,
          flatten: false,
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          mapping: '<%= pkg.workspace %>/tmp/vendor.json' //mapping file so your server can serve the right files
        },
        src: resConfig.resVendor && resConfig.resVendor.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      resFlat: {
        options: {
          skipBaseName:true,
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/resFlat.json' //mapping file so your server can serve the right files
        },
        src: resConfig.resFlat && resConfig.resFlat.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      resSpine: {
        options: {
          skipBaseName:true,
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/resSpine.json' //mapping file so your server can serve the right files
        },
        src: resConfig.resSpine && resConfig.resSpine.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      resBones: {
        options: {
          skipBaseName:true,
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/resBones.json' //mapping file so your server can serve the right files
        },
        src: resConfig.resBones && resConfig.resBones.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      textureAsset: {
        options: {
          skipBaseName:true,
          keymatch: 'tmp/<%= pkg.workspace %>/',
          replacement: '',
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/textureAsset.json' //mapping file so your server can serve the right files
        },
        src: resConfig.textureAsset && resConfig.textureAsset.tmpsrc || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      textureSpine: {
        options: {
          skipBaseName:true,
          keymatch: 'tmp/<%= pkg.workspace %>/',
          replacement: '',
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/textureSpine.json' //mapping file so your server can serve the right files
        },
        src: resConfig.textureSpine && resConfig.textureSpine.tmpsrc || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      textureBones: {
        options: {
          skipBaseName:true,
          keymatch: 'tmp/<%= pkg.workspace %>/',
          replacement: '',
          flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/textureBones.json' //mapping file so your server can serve the right files
        },
        src: resConfig.textureBones && resConfig.textureBones.tmpsrc || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      spine: {
        options: {
          skipBaseName:true,
          format:'<%= pkg.workspace %>/tmp/textureSpine.json',
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/spine.json' //mapping file so your server can serve the right files
        },
        src: resConfig.spine && resConfig.spine.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      bones: {
        options: {
          skipBaseName:true,
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/bones.json' //mapping file so your server can serve the right files
        },
        src: resConfig.bones && resConfig.bones.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      yml: {
        options: {
          skipBaseName:true,
          keymatch: 'tmp/<%= pkg.workspace %>/',
          replacement: '',
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/yml.json'
        },
        src: '<%= pkg.workspace %>/tmp/res/**/*.yml',
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      resjs: {
        options: {
          skipBaseName:true,
          keymatch: 'tmp/<%= pkg.workspace %>/',
          replacement: '',
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          workspace: workspace.root,
          mapping: '<%= pkg.workspace %>/tmp/resjs.json'
        },
        src: '<%= pkg.workspace %>/tmp/<%= pkg.workspace %>/**/*.js',
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      },
      release: {
        options: {
          skipHash: workspace.public.skipHash,
          flatten: true, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          version: '.<%= pkg.version %>',
          mapping: '<%= pkg.workspace %>/tmp/release.json' //mapping file so your server can serve the right files
        },
        src: '<%= pkg.workspace %>/release/<%= pkg.output %>.js',  //all your js that needs a hash appended to it
        dest: '' //where the new files will be created
      },
      debug: {
        options: {
          skipHash: workspace.public.skipHash,
          flatten: true, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          version: '.<%= pkg.version %>',
          mapping: '<%= pkg.workspace %>/tmp/debug.json' //mapping file so your server can serve the right files
        },
        src: '<%= pkg.workspace %>/debug/<%= pkg.output %>.js',  //all your js that needs a hash appended to it
        dest: '' //where the new files will be created
      },
      app: {
        options: {
          skipHash: workspace.public.skipHash,
          flatten: true, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
          version: '.<%= pkg.version %>',
          mapping: '<%= pkg.workspace %>/tmp/app.json' //mapping file so your server can serve the right files
        },
        src: ['<%= pkg.workspace %>/app/*.<%= pkg.name %>.js','<%= pkg.workspace %>/app/main*.js'],
        dest: '' //where the new files will be created
      },
      resGamecard: {
        options: {
          workspace: workspace.root,
          skipBaseName:true,
          flatten: false,
          removePath: resConfig.removePath || '',
          removeKey: resConfig.removeKey || '',
          mapping: '<%= pkg.workspace %>/tmp/resGamecard.json' //mapping file so your server can serve the right files
        },
        src: resConfig.resGamecard && resConfig.resGamecard.src || [],
        dest: '<%= pkg.workspace %>/data' //where the new files will be created
      }
    },

    replace: {
      debug: {  // 新版本沒有使用
        options: {
          usePrefix: false,
          patterns: [
            {
              match: '<%= pkg.workspace %>/debug/<%= pkg.output %>.js',
              replacement: '<%= pkg.workspace %>/src/main.js'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['template/gameList.txt'], dest: 'web/test/data/'}
        ]
      },
      textureAsset: {
        options: {
          usePrefix: false,
          type:'flat',
          jsonfile: '<%= pkg.workspace %>/tmp/resFlat.json',
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: false, src: resConfig.textureAsset && resConfig.textureAsset.src || [], dest: '<%= pkg.workspace %>/tmp/'}
        ]
      },
      textureSpine: {
        options: {
          usePrefix: false,
          type:'flat',
          jsonfile: '<%= pkg.workspace %>/tmp/resSpine.json',
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: false, src: resConfig.textureSpine && resConfig.textureSpine.src || [], dest: '<%= pkg.workspace %>/tmp/'}
        ]
      },
      textureBones: {
        options: {
          usePrefix: false,
          type:'flat',
          jsonfile: '<%= pkg.workspace %>/tmp/resBones.json',
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: false, src: resConfig.textureBones && resConfig.textureBones.src || [], dest: '<%= pkg.workspace %>/tmp/'}
        ]
      },
      yml: {
        options: {
          usePrefix: false,
          jsonfile: ['<%= pkg.workspace %>/tmp/res.json', '<%= pkg.workspace %>/tmp/textureAsset.json', '<%= pkg.workspace %>/tmp/spine.json', '<%= pkg.workspace %>/tmp/bones.json', '<%= pkg.workspace %>/tmp/textureBones.json'],
          patterns: [
          ]
        },
        files: [
        {expand: true, flatten: false, src: resConfig.yml && resConfig.yml.src || [], dest: '<%= pkg.workspace %>/tmp/'}
        ]
      },
      vendor: {
        options: {
          usePrefix: false,
          jsonfile: ['<%= pkg.workspace %>/tmp/res.json', '<%= pkg.workspace %>/tmp/textureAsset.json', '<%= pkg.workspace %>/tmp/spine.json', '<%= pkg.workspace %>/tmp/atlas.json'],
          patterns: [
          ]
        },
        files: [
          // v1
          {expand: true, flatten: true, src: ['<%= pkg.workspace %>/tmp/vendor.js'], dest: '<%= pkg.workspace %>/tmp/'},
          // v2
          {expand: true, flatten: false, src: ['<%= pkg.workspace %>/tmp/vendor/**/*.js'], dest: ''}
        ]
      },
      resource: {
        options: {
          usePrefix: false,
          jsonfile: ['<%= pkg.workspace %>/tmp/spine.json', '<%= pkg.workspace %>/tmp/atlas.json'],
          patterns: [
          ]
        },
        files: [
          // v1
          {expand: true, flatten: true, src: ['<%= pkg.workspace %>/tmp/resource.js'], dest: '<%= pkg.workspace %>/tmp/'},
          // v2
          {expand: true, flatten: false, src: ['<%= pkg.workspace %>/res/tmp/**/*.yml'], dest: ''}
        ]
      },
      ymlSpine: {
        options: {
          usePrefix: false,
          jsonfile: ['<%= pkg.workspace %>/tmp/spine.json'],
          patterns: [
          ]
        },
        files: [
        {expand: true, flatten: false, src: resConfig.ymlSpine && resConfig.ymlSpine.src || [], dest: '<%= pkg.workspace %>/tmp/'}
        ]
      },
      ymlBones: {
        options: {
          usePrefix: false,
          jsonfile: ['<%= pkg.workspace %>/tmp/bones.json', '<%= pkg.workspace %>/tmp/textureBones.json'],
          patterns: [
          ]
        },
        files: [
        {expand: true, flatten: false, src: resConfig.ymlBones && resConfig.ymlBones.src || [], dest: '<%= pkg.workspace %>/tmp/'}
        ]
      },
      release: {
          options: {
              usePrefix: false,
              jsonfile: '<%= pkg.workspace %>/tmp/release.json',
              patterns: [
              ]
          },
          files: [
              {expand: true, flatten: true, src: ['template/gameList.txt'], dest: 'web/test/data/'}
          ]
      },
      public: {
        options: {
          usePrefix: false,
          jsonfile: '<%= pkg.workspace %>/tmp/app.json',
          patterns: [
            {
              match: '<%= pkg.workspace %>/release/<%= pkg.output %>.js',
              replacement: '<%= pkg.workspace %>/app/<%= pkg.output %>.js'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: 'template/gameList.txt', dest: 'web/test/data/'}
        ]
      },
      deploy: {
        options: {
          usePrefix: false,
          patterns: [
            // {
            //   match: '/project/',
            //   replacement: '/<%= pkg.currentMode %>/'
            // }
          ]
        },
        files: [
          {expand: true, flatten: false, src: workspace.public.replace.src, dest: ''}
        ]
      },
      cache: {
        options: {
          usePrefix: false,
          patterns: (resConfig.replace && resConfig.replace.cache) || []
        },
        files: [
          {expand: true, flatten: false, src: '<%= pkg.workspace %>/config/cache.txt', dest: ''}
        ]
      },
      importmap: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: '"/dependence',
              replacement: '"/public/<%= pkg.currentMode %>/dependence'
            }
          ]
        },
        files: [
          {expand: true, flatten: false, src: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/config/importmap.json', dest: ''}
        ]
      },
      app: {
        options: {
          usePrefix: false,
          jsonfile: resConfig.app,
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: true, src: '<%= pkg.workspace %>/release/*.*.js', dest: '<%= pkg.workspace %>/app/'}
//          {expand: true, flatten: true, src: '<%= pkg.workspace %>/release/<%= pkg.output %>.js', dest: '<%= pkg.workspace %>/app/'}
        ]
      },
      resVendor: {
        options: {
          usePrefix: false,
          jsonfile: '<%= pkg.workspace %>/tmp/vendor.json',
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: true, src: '<%= pkg.workspace %>/src/nameMap.js', dest: '<%= pkg.workspace %>/src/'}
//          {expand: true, flatten: true, src: '<%= pkg.workspace %>/app/*.*.js', dest: '<%= pkg.workspace %>/app/'}
        ]
      },
      gamecard: {
        options: {
          usePrefix: false,
          jsonfile: resConfig.gamecard,
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: true, src: '<%= pkg.workspace %>/config/*.txt', dest: '<%= pkg.workspace %>/config/'}
        ]
      },
      gamelist: {
        options: {
          usePrefix: false,
          jsonfile: resConfig.gamecard,
          patterns: [
          ]
        },
        files: [
          {expand: true, flatten: true, src: 'developer/agent/test/data/gameList.txt', dest: 'developer/agent/test/data/'}
        ]
      }
    },

    watch: {
      source: {
        files: ['<%= pkg.workspace %>/src/**/*.js'],
        tasks: ['source'],
        options: {
          interrupt: true,
          spawn: false
        }
      }
    },

    compress: {
      project: {
        options: {
          quality: 1,
          level: 1,
          mode: 'gzip'
        },
        files:[
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/app/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/app/',
            extDot: 'last',
            ext: '.js.gz'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/config/',
            src: ['**/*.txt'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/config/',
            extDot: 'last',
            ext: '.txt.gz'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/vendor/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/vendor/',
            extDot: 'last',
            ext: '.js.gz'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/',
            src: ['**/*.svg'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/',
            extDot: 'last',
            ext: '.svg.gz'
          }
        ]
      },

      project1: {
        options: {
          mode: 'brotli',
          brotli: {
            mode: 0,
            quality: 8,
            lgwin: 20,
            lgblock: 0
          }
        },
        files:[
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/app/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/app/',
            extDot: 'last',
            ext: '.js.br'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/config/',
            src: ['**/*.txt'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/config/',
            extDot: 'last',
            ext: '.txt.br'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/vendor/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/vendor/',
            extDot: 'last',
            ext: '.js.br'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/',
            src: ['**/*.svg'],
            dest: 'public/<%= pkg.currentMode %>/<%= pkg.current %>/data/',
            extDot: 'last',
            ext: '.svg.br'
          }
        ]
      },

      lib: {
        options: {
          quality: 0,
          mode: 'gzip'
        },
        files:[
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/dependence/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/dependence/',
            extDot: 'last',
            ext: '.js.gz'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/systemjs/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/systemjs/',
            extDot: 'last',
            ext: '.js.gz'
          }
        ]
      },

      lib1: {
        options: {
          mode: 'brotli',
          brotli: {
            mode: 0,
            quality: 8,
            lgwin: 20,
            lgblock: 0
          }
        },
        files:[
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/dependence/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/dependence/',
            extDot: 'last',
            ext: '.js.br'
          },
          {
            expand: true,
            cwd: 'public/<%= pkg.currentMode %>/systemjs/',
            src: ['**/*.js'],
            dest: 'public/<%= pkg.currentMode %>/systemjs/',
            extDot: 'last',
            ext: '.js.br'
          }
        ]
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js',
      },
    },

    shell: {
      eslint: {
        options: {
          execOptions: {
            env: {
              NODE_OPTIONS: '--max_old_space_size=4096'
            }
          }
        },
        command() {
          if(!pkg.current && pkg.current.length > 0){
            return 'echo 未設定專案名稱';
          }
          let dir = 'project/';
          dir += pkg.current;
          dir +='/src/';
          
          let files = [];
          grunt.file.recurse(dir, function (abspath, rootdir, subdir, filename) {
            files.push(abspath);
          });

          let hasScript = grunt.file.isMatch(['**/*.{js,ts}'], files);
          if(!hasScript){
            return 'echo 沒有使用 javascript 或 typescript';
          }
  
          let cmd = 'eslint --ext .ts,.js --fix';
          //          cmd += ` --ignore-pattern 'project/${pkg.current}/src/res/*'`;
          //          cmd += ` --ignore-pattern 'project/${pkg.current}/src/resource.js'`;
          cmd += ` -c project/${pkg.current}/src/.eslintrc.yml ${dir}`;

          // // 檔案清單
          // cmd +=dir;
          
          return cmd;
        }
      },

      tslint: {
        command() {
//          return 'tslint --help';
          let cmd = 'tslint --fix -c project/';
          if(!pkg.current && pkg.current.length > 0){
            return 'echo 未設定專案名稱';
          }

          cmd += pkg.current;
          cmd += '/src/.tslint.yml ';

          // 輸出
          cmd +='project/';
          cmd +=pkg.current;
          cmd +='/src/**/*.ts';
          return cmd;
        }
      },

      serve: {
        options: {
          execOptions: {
            env: {
              // NODE_OPTIONS: '--max_old_space_size=4096'
            }
          }
        },
        command: 'nodemon --config server/nodemon.config.json server/server.js'
      },

      server: {
        command: 'es-dev-server -c es-dev-server.config.js'
      },

      uglify:{
        command(mode) {
          let set = workspace.set;
          let globalDefs = {
            ALPHA: false,
            BETA: false,
            DEMO: false,
            TEST: false,
            DEBUG: false,
          };
          if(set) {
            if(set.build && set.build.globalDefs) {
              globalDefs = set.build.globalDefs;
            }
          }
          
          let cmd = ' <%= pkg.workspace %>/release/<%= pkg.output %>.js -c drop_console=true -o <%= pkg.workspace %>/release/<%= pkg.output %>.js';
          if(mode === 'log'){
            cmd = ' <%= pkg.workspace %>/release/<%= pkg.output %>.js -o <%= pkg.workspace %>/release/<%= pkg.output %>.js';
          }
          
          let def = '';
          let names = Object.getOwnPropertyNames(globalDefs);
          names.forEach(name => {
            def += ` -d ${name}=${globalDefs[name]}`;
          });
          cmd = 'uglifyjs' + def + cmd;
          
          return cmd
        }
      },

      terser:{
        command(mode) {
          let set = workspace.set;
          let globalDefs = {
            ALPHA: false,
            BETA: false,
            DEMO: false,
            TEST: false,
            DEBUG: false,
          };
          if(set) {
            if(set.build && set.build.globalDefs) {
              globalDefs = set.build.globalDefs;
            }
          }
          
          let cmd = ' -m -c drop_console=true <%= pkg.workspace %>/release/<%= pkg.output %>.js -o <%= pkg.workspace %>/release/<%= pkg.output %>.js';
          if(mode === 'log') {
            cmd = ' <%= pkg.workspace %>/release/<%= pkg.output %>.js -o <%= pkg.workspace %>/release/<%= pkg.output %>.js';
          }
          let def = '';
          let names = Object.getOwnPropertyNames(globalDefs);
          names.forEach(name => {
            def += ` -d ${name}=${globalDefs[name]}`;
          });
          cmd = 'terser ' + def + cmd;
          return cmd
        }
      },

      test: {
        command(mode) {
          let cmd = '';
          if(pkg.framework.custom) {
            cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,TEST_MODE:${mode} -c <%= pkg.workspace %>/rollup.test.js`;
          } else {
            cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,TEST_MODE:${mode} -c builder/rollup/rollup.test.js`;
          }

          return cmd;
        }
      },

      bytenode : {
        command() {
          let cmd;

          cmd = `bytenode -c <%= pkg.workspace %>/release/<%= pkg.output %>.js`;
          
          return cmd;
        }
      },

      default: {
        command() {
          return 'grunt --help';
        }
      },

      pbjs: {
        command(name) {
          let filename = 'game';
          if(name && (name.length > 0)) {
            filename = `${name}`;
          }
          return `pbjs -t json <%= pkg.workspace %>/schema/${filename}.proto -o <%= pkg.workspace %>/schema/${filename}.json`;
        }
      },

      nodemon: {
        command() {
          return 'nodemon --config server/nodemon.config.json server/server.js';
        }
      },

      status: {
        command() {
          let cmdList = [
            "cd " + workspace.root,
            'git status'
          ];
          return cmdList.join('&&');
        },
        options:{
          callback: cbStatus
        }
      },

      tag: {
        command() {
          if(isFramework){
            let config = JSON.parse(fs.readFileSync("package.json", 'utf8'));
            let cmdList = [
              "git tag -a 'v" + config.version + "' -m 'version " + config.version + "'",
              "git push --tag"
            ];
            return cmdList.join('&&');
          } else {
            let cmdList = [
              "cd " + workspace.root,
              "git status -s",
              `git tag -a "v${pkg.version}" -m "version ${pkg.version}"`,
              "git push --tags"
            ];
            return cmdList.join('&&');
          }
        }
      },

      run: {
        command(mode) {
          let cmd;
          if(mode === 'bytenode') {
            cmd = 'bytenode <%= pkg.workspace %>/release/<%= pkg.output %>.jsc'
          } else {
            cmd = 'nodemon --config <%= pkg.workspace %>/nodemon.config.json <%= pkg.workspace %>/debug/<%= pkg.output %>.js';
          }
          return cmd;
        }
      },

      rollup:{
        options: {
          execOptions: {
            env: {
              NODE_OPTIONS: '--max_old_space_size=4096'
            }
          }
        },
        command(mode) {
          let cmd = '';
          let buildMode = 'production';
          if(mode !== 'release') {
            buildMode = 'development'
          }
          if(pkg.framework.custom) {
            cmd += `rollup --silent --environment INCLUDE_DEPS,BUILD:${buildMode},TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>${workspace.build.env} -c <%= pkg.workspace %>/rollup.config.js`;
          } else {
            cmd += `rollup --silent --environment INCLUDE_DEPS,BUILD:${buildMode},TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>${workspace.build.env} -c builder/rollup/rollup.${pkg.template.format}.js`;
          }

          return cmd;
        }
      },
  
      report:{
        options: {
          execOptions: {
            env: {
              NODE_OPTIONS: '--max_old_space_size=4096'
            }
          }
        },
        command(mode) {
          let cmd = '';
          if(pkg.framework.custom) {
            cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,VISUAL_TEMPLATE:${mode} -c <%= pkg.workspace %>/rollup.visualizer.js`;
          } else {
            cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,VISUAL_TEMPLATE:${mode} -c builder/rollup/rollup.visualizer.js`;
          }
          return cmd;
        }
      },

      makeres: {
        options: {
          execOptions: {
            env: {
              NODE_OPTIONS: '--max_old_space_size=4096'
            }
          }
        },
        command(mode) {
          if(!mode) {
            mode ='en-us';
          }
          
          let cmd = '';
          if(pkg.template.format === 'game') {
            if(pkg.framework.custom) {
              cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,RES_LANG:${mode},MAKERES_VENDOR:${pkg.generatorVendor} -c <%= pkg.workspace %>/rollup.resource.js`;
            } else {
              cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,RES_LANG:${mode},MAKERES_VENDOR:${pkg.generatorVendor} -c builder/rollup/rollup.resource.js`;
            }
          } else {
            cmd += `rollup  --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,RES_LANG:${mode},MAKERES_VENDOR:${pkg.generatorVendor} -c <%= pkg.workspace %>/rollup.resource.js`;
          }
          return cmd;
        }
      },
      
      generatorvendor: {
        options: {
          execOptions: {
            env: {
              NODE_OPTIONS: '--max_old_space_size=4096'
            }
          }
        },
        command(mode) {
          let cmd = '';

          if(pkg.template.format === 'game') {
            if(pkg.framework.custom) {
              cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,LANG_ID:${mode},GENERATOR_VENDOR:${pkg.generatorVendor} -c <%= pkg.workspace %>/rollup.resource.js`;
            } else {
              cmd += `rollup --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,LANG_ID:${mode},GENERATOR_VENDOR:${pkg.generatorVendor} -c builder/rollup/rollup.resource.js`;
            }
          } else {
            cmd += `rollup  --silent --environment INCLUDE_DEPS,TEMPLATE_VERSION:${pkg.templateVersion},WORKSPACE:<%= pkg.workspace %>,LANG_ID:${mode},GENERATOR_VENDOR:${pkg.generatorVendor} -c <%= pkg.workspace %>/rollup.resource.js`;
          }
          return cmd;
        }
      },
      
      aa:{
        command(/*mode*/) {
          let cmd = 'javascript-obfuscator ';
          cmd += `<%= pkg.workspace %>/release/vendor.a37d4421.js --output <%= pkg.workspace %>/release/vendor.a37d4421.js --compact true --self-defending false --dead-code-injection true`;

          return cmd;
        }
      },

      // 沒使用
      obfuscate:{
        command(mode) {
          let cmd = 'javascript-obfuscator ';

          if(mode === 'resource') {
            // cmd += `public/release/<%= pkg.current %>/data/vendor --output './' --config 'builder/obfuscateResource.js'`;
            cmd += `public/<%= pkg.currentMode %>/<%= pkg.current %>/data/vendor  --output './' --config 'builder/obfuscateResource.js'`;
          } else if(mode === 'vendor') {
            // cmd += `public/release/<%= pkg.current %>/app --config 'builder/obfuscateVendor.js'`;
            // cmd += `public/<%= pkg.currentMode %>/<%= pkg.current %>/app  --output './' --config 'builder/obfuscateVendor.js'`;
            cmd += `project/<%= pkg.current %>/release/agent.28f788f0.js  --output './' --config 'builder/obfuscateVendor.js'`;
          }

          return cmd;
        }
      },

      create:{
        command(name) {
          let cmd = 'grunt-init template/project/webgame';
          if(name){
            cmd = 'grunt-init template/project/' + name;
          }

          return cmd;
        }
      },

      resource: {
        command(scene) {
          let cmd = 'echo scene : ' + scene;
          // cmd = `rollup --silent --environment INCLUDE_DEPS,WORKSPACE:<%= pkg.workspace %>,LANG_ID:${mode},GENERATOR_VENDOR:${pkg.generatorVendor} -c builder/rollup/rollup.resource.js`;
          // cmd += '&&';
          // cmd += 'node builder/resource.js <%= pkg.group %> <%= pkg.name %> ' + scene;

          return cmd;
        }
      },

      build: {
        command() {
          // const Build = require('./builder/release.js');
          // let filename = workspace.root  + '/system.set.yml';
          // let set = yaml.load(fs.readFileSync(filename, 'utf8'));
          // Build.build(set, pkg);
          //          let cmd = 'npm run build <%= pkg.group %> <%= pkg.name %>';

          // let cmd = 'node builder/release.js <%= pkg.group %> <%= pkg.name %>';
          // return cmd;
          return 'echo !!!! not used !!!!';
        }
      }
    }
  };
  grunt.config.merge(config);

  //----------------------------------------------------
  grunt.loadTasks('tasks/grunt-replace/tasks/');
  grunt.loadTasks('tasks/grunt-hash/tasks/');
  grunt.loadTasks('tasks/grunt-filelist/tasks/');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('serve', '啟動網頁伺服器', function () {
    let cmdList = [];
    // cmdList.push(`shell:server`);
    cmdList.push(`shell:serve`);
    grunt.task.run(cmdList);
  });

  grunt.registerTask('config', '設定', function (mode) {
    let done = this.async();
    if(pkg.framework.builder === 'rollup') {
      if(workspace.set && workspace.set.config && workspace.set.config.map){
        let obj = workspace.set.config.map;
        let maps = Object.getOwnPropertyNames(obj);
        let importmap = {
          imports:{}
        };
        maps.forEach(key => {
          importmap.imports[key] = obj[key].replace('depend:', '/dependence/');
        });
        if(mode === 'debug') {
          importmap.imports[workspace.current] = `/${workspace.root}/debug/${workspace.output}.js`.replace('depend:', '/dependence/');
        }

        let buf = JSON.stringify(importmap, null, 2);
        let dir = workspace.root + '/config/';
  
        // 確認是否有資料夾
        if(!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
  
        let filename = dir + 'importmap.json';
        grunt.log.writeln(filename);
        fs.writeFileSync(filename, buf, 'utf8');
      }
      done();
    } else {
      if(workspace.set) {
        const Generate = require('./builder/generate.js');
    
        let rule = {
          debug: false,
          release: false
        };
        if(mode === 'debug'){
          rule.debug = true;
        }
        if(mode === 'release'){
          rule.release = true;
        }
    
        Generate.build(workspace, rule, done);
      } else {
        done();
      }
    }
    workspace.hasConfig = true;
  });

  grunt.registerTask('create', '建立專案', function (name) {
    let cmd = 'shell:create';
    if(name){
      cmd += ':' + name;
    }
    grunt.task.run([cmd]);
  });

  grunt.registerTask('rollup', 'rollup', function (name) {
    let cmd = 'shell:rollup';
    if(name){
      cmd += ':' + name;
    }
  
    grunt.task.run([cmd]);
  });

  grunt.registerTask('nodemon', '啟動測試用伺服', function () {
    let cmdList = [];
    cmdList.push(`shell:nodemon`);
    grunt.task.run(cmdList);
  });

  grunt.registerTask('pbjs', '產生通訊用程式碼', function (name) {
    let cmd = 'shell:pbjs';
    if(name) {
      cmd += `:${name}`;
    }
    grunt.task.run([cmd]);
  });

  grunt.registerTask('release', '建立最佳化版本', function () {
    if(!workspace.hasConfig){
      grunt.task.run(['config:release', 'release']);
    } else {
      let done = this.async();
      if(pkg.framework.builder === 'rollup') {
        done();
      } else {
        if(workspace.set) {
          const Generate = require('./builder/release.js');
          Generate.build(workspace, done, grunt);
        } else {
          done();
        }
      }
    }
  });

  grunt.registerTask('clone', '複製', function (mode) {
    // console.log('clone : ' + mode);
    // pkg.currentMode = workspace.mode;
    if('public' === mode) {
      let str = grunt.template.process(JSON.stringify(pkg), {
        data: {
          pkg: pkg,
        }
      });
      grunt.config.set('pkg', JSON.parse(str));
  
      let cloneList = workspace.public.cloneList;
      let copy = function (file, replace){
        let srcPath = file.src;
        let destPath = file.dest;
        let files = grunt.file.expand(srcPath);
        files.forEach(function (filename) {
          let src = filename;
          let fmt = path.parse(filename);
          if(file.flatten) {
            filename = fmt.base;
          }
          let output = destPath + filename;
          if(replace) {
            output = output.replace(replace, '');
          }
          grunt.file.copy( src, output );
          grunt.log.writeln(colorette.green('output:') + output);
        });
      };
      if(isFramework){
        if(cloneList && Array.isArray(cloneList)) {
          cloneList.forEach(function (file) {
            copy(file);
          });
        } else {
          grunt.log.err('cloneList is unknown !');
        }
      } else {
        if(cloneList && Array.isArray(cloneList)) {
          cloneList.forEach(function (file) {
            file.src = grunt.template.process(file.src, pkg);
            file.dest = grunt.template.process(file.dest, pkg);
            copy(file, 'project/');
          });
        }
      }
    }
  });

  grunt.registerTask('makeres', '建立資源檔', function(mode) {
    if(isFramework) {
      return;
    }

    if(resConfig && resConfig.vendor) {
      if(!mode) {
        mode = 'en-us';
      }
      let cmdList = [];
      cmdList.push(`shell:generatorvendor:${mode}`);
      cmdList.push(`resource:${mode}`);
      cmdList.push(`shell:makeres:${mode}`);
      grunt.task.run(cmdList);
      return;
    }
  

    if(resConfig.resource && resConfig.resource.sceneList){
      let done = this.async();
      const Generate = require('./builder/resource.js');

      let index = 0;
      let sceneList = resConfig.resource.sceneList;
      let checkScene = function (){
        if(sceneList && sceneList.length > index){
          let scene = sceneList[index];
          if(scene){
            grunt.log.writeln('scene : ' + scene);
            if(workspace.set) {
              Generate.build(workspace, scene, checkScene, grunt);
            } else {
              checkScene();
            }
          }
          index += 1;
        } else {
          grunt.log.writeln('finished');
          done();
        }
      };
      checkScene();

    } else {
      grunt.log.writeln('  no resource');
    }
  });

  grunt.registerTask('eslint', '檢查程式碼', function(/*mode*/) {
    let cmdList = [];
    let cmd = 'shell:eslint';
    // if(mode) {
    //   cmd += ':' + mode;
    // }
    // console.log('command : ' + cmd);
    cmdList.push(cmd);
    grunt.task.run(cmdList);
  });

  grunt.registerTask('source', '建立除錯版本', function(mode) {
    if(isFramework){
      return;
    }
    changeMode(mode);
    workspace.runMode = 'source';
 
    let cmdList = [];
    cmdList.push('clean:debug');
    
    if(pkg.framework.builder === 'rollup') {
      console.log('rollup');
      cmdList.push('rollup:debug');
    } else if(pkg.framework.builder === 'builder') {
      console.log('builder');
    }
    cmdList.push('config:debug');
    cmdList.push('hash:debug');
    cmdList.push('copy:debug');

    cmdList.push('shell:eslint');

    grunt.task.run(cmdList);
  });
  grunt.registerTask('cache', '產生快取', function(mode) {
    //let done = this.async();
    
    let generate = function(filename) {
      let objList = [];

      if(resConfig.cache && resConfig.cache.src) {
        let files = grunt.file.expand(resConfig.cache.src);
        for(let i=0; i<files.length; i +=1 ) {
          let src = files[i];
          let obj = { url: src, revision:null};
          objList.push(obj);
        }
      }
      
      if(resConfig.cache && resConfig.cache.resource) {
        let files = grunt.file.expand(resConfig.cache.resource);
        for(let i=0; i<files.length; i +=1 ) {
          let src = files[i];
          let obj = { url: src, revision:null};
          objList.push(obj);
        }
      }

      if(resConfig.revision && resConfig.revision.src) {
        let files = grunt.file.expand(resConfig.revision.src);
        for(let i=0; i<files.length; i +=1 ) {
          let src = files[i];
          let data = fs.readFileSync(src, 'utf8');
          const hash = crypto.createHash('md5');
          hash.update(data);

          let obj = { url: src, revision: hash.digest().toString('hex')};
          objList.push(obj);
        }
      }

      if(workspace.set && workspace.set.config && workspace.set.config.map) {
        let names = Object.getOwnPropertyNames(workspace.set.config.map);
        names.forEach(name => {
          let src = workspace.set.config.map[name];
          if(mode === 'deploy') {
            src = src.replace('depend:', `public/${workspace.mode}/dependence/`);
          } else {
            src = src.replace('depend:', 'dependence/');
          }

          let obj = { url: src, revision: null};
          objList.push(obj);
       });
      }

      // 存檔
      let handle = fs.openSync(filename, 'w');
      grunt.log.writeln('save : ' + filename);
      fs.writeSync(handle, JSON.stringify(objList, null, 2));
      fs.closeSync(handle);
    };
    let filename;
    if(mode === 'deploy') {
      filename = `public/${workspace.mode}/${workspace.current}/${resConfig.cache.output}`;
    } else {
      filename = `${workspace.root}/${resConfig.cache.output}`;
    }
    let fmt = path.parse(filename);

    // 確認是否有資料夾
    if(fs.existsSync(fmt.dir)) {
      generate(filename);
    }
  });

  grunt.registerTask('custom', '自定義設定', function(lang) {
    let key = `${workspace.output}.js`;
    let filename = `${workspace.root}/tmp/release.json`;
    let obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
    key = obj[key];

    filename = `${workspace.root}/tmp/app.json`;
    obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
    let name = obj[key];
    console.log(`filename : ${name}`);
    if(!name) {
      grunt.fail.fatal('找不到指定的檔案');
    }
    workspace.vendor.custom[lang] = name;
  });
  
  grunt.registerTask('resource', '資源', function(mode) {
    let done = this.async();
    //    console.log(resources);
    let completeSpine = (info, data) => {
      let fmt = path.parse(info);
      if(fs.existsSync(`${workspace.root}/${info}`)) {
        let raw = fs.readFileSync(`${workspace.root}/${info}`, {encoding: "utf8"});
        data.spines[info] = JSON.parse(raw);
      }
      let filename = `${fmt.dir}/${fmt.name}.atlas`;
      //      let filename = `${workspace.root}/${fmt.dir}/${fmt.name}.atlas`;
      //      raw = fs.readFileSync(filename, {encoding: "utf8"});
      data.atlas[filename] = "wait";
    };
  
    let completeArray = (infoList, data, create) => {
      infoList.forEach(info => {
        create(info, data);
      });
    };
  
    let completeObject = (object, data, create) => {
      let nameList = Object.getOwnPropertyNames(object);
      nameList.forEach(name => {
        let info = object[name];
        if (typeof info === 'string') {
          create(info, data);
        } else if (Array.isArray(info)) {
          completeArray(info, data, create);
        } else if (typeof info === 'object') {
          completeObject(info, data, create);
        } else {
          console.log(' no found : ' + name);
        }
      });
    };
    
    function generate(resource, output) {
      //      let names = Object.getOwnPropertyNames(resource);
      let res;
      res = resource;
      
      // 資料
      let data = res.data;
      if(data) {
        output.data = data;
      }
      // 物件
      let objects = res.object && res.object.objects;
      if(objects) {
        output.objects = objects;
      }
      // 音效
      let sounds = res.sound && res.sound.sounds;
      if(sounds) {
        output.sounds = sounds;
      }
      // 圖檔
      let images = res.texture && res.texture.images;
      if(images) {
        output.images = images;
      }
      // 材質
      let frames = res.texture && res.texture.frames;
      if(frames) {
        output.frames = frames;
      }
      // 資源
      let assets = res.texture && res.texture.assets;
      if(assets && Array.isArray(assets)) {
        output.assets = {};
        assets.forEach(str => {
          if(fs.existsSync(`${workspace.root}/${str}`)) {
            let o = fs.readFileSync(`${workspace.root}/${str}`, 'utf8');
            output.assets[str] = JSON.parse(o);
          } else {
            grunt.log.error(`no found file : ${workspace.root}/${str}`);
          }
        });
      }
      // 動畫
      let spines = res.spine && res.spine.spines;
      if(spines) {
        output.spineDataMap = {spines};
        output.spines = {};
        output.atlas = {};
        completeObject(spines, output, completeSpine);
      }
    }

    if(pkg.generatorVendor === 'v1') {
      const resources = require(`./${workspace.root}/tmp/vendor.js`);
      let filename = `${workspace.root}/${resConfig.vendor.resource}`;
      let handle = fs.openSync(filename, 'w');
      let output = {};
      let lang = mode || 'en-us';

      //    filename = `${workspace.root}/${resConfig.vendor.output}`;
      filename = `${workspace.root}/tmp/resource.js`;
      let javascript = fs.openSync(filename, 'w');
      fs.writeSync(javascript, `import resource from "${resConfig.vendor.resource}"\n\n`);
  
      let names = Object.getOwnPropertyNames(resources);
      names.forEach(name => {
        // console.log('場景:' + name);
        let resource = resources[name];
        let o = {};
        if(resource) {
          resource = resource[lang];
          generate(resource, o);
          
          let atlas = o.atlas;
          //  delete o.atlas;
          let index = 0;
          if(atlas) {
            let files = Object.getOwnPropertyNames(atlas);
            files.forEach(file => {
              let str = `import ${name}Atlas${index} from "${file}"`;
              //  console.log(str);
              fs.writeSync(javascript, str+"\n");
              index += 1;
            });
          }
        }
        output[name] = o;
      });
      names.forEach(name => {
        // console.log('========================');
        // console.log('場景:' + name);
        let res = output[name];
        let atlas = res.atlas;
        delete res.atlas;
        if(atlas) {
          let index = 0;
          fs.writeSync(javascript, `\nlet ${name}AtlasMap = {\n`);
          
          let files = Object.getOwnPropertyNames(atlas);
          files.forEach(file => {
            let str = `  "${file}": ${name}Atlas${index},`;
            fs.writeSync(javascript, str+"\n");
            index += 1;
          });
          fs.writeSync(javascript, "};\n\n");
          fs.writeSync(javascript, `resource.${name}.atlas = ${name}AtlasMap;\n\n`);
        }
      });
      
      fs.writeSync(handle, yaml.dump(output));
      grunt.log.writeln('save : ' + filename);
      fs.closeSync(handle);

      //--
      fs.writeSync(javascript, `export default resource;`);
      fs.closeSync(javascript);
      done();

    } else if(pkg.generatorVendor === 'v2') {
      async function build() {

        const resources = require(`./${workspace.root}/tmp/vendor/resource.js`);
        let lang = mode || 'en-us';
        let names = Object.getOwnPropertyNames(resources);
        console.log(names);
        for(let i=0; i<names.length; i +=1) {
          let name = names[i];
          let resource = resources[name];
          if(resource === true) {
            continue;
          }
          if(resource && resource.get) {
            resource = await resource.get(lang);
          } else {
            if(resource.resource) {
              resource = resource.resource;
            }
            resource = resource[lang];
          }

          let obj = {};
          generate(resource, obj);

          let filename = `${workspace.root}/tmp/resource/${lang}`;
          if(!fs.existsSync(filename)){
            fs.mkdirSync(filename, { recursive: true });
          }
          filename = `${filename}/${name}.js`;
          let javascript = fs.openSync(filename, 'w');
          fs.writeSync(javascript, `import resource from "tmp/res/${lang}/${name}.yml";\n\n`);

          let atlas = obj.atlas;
          if(atlas) {
            let index = 0;
            let files = Object.getOwnPropertyNames(atlas);
            files.forEach(file => {
              let str = `import atlas${index} from "${file}";`;
              //  console.log(str);
              fs.writeSync(javascript, str+"\n");
              index += 1;
            });
          }

          delete obj.atlas;
          if(atlas) {
            let index = 0;
            fs.writeSync(javascript, `\nlet atlasMap = {\n`);
            
            let files = Object.getOwnPropertyNames(atlas);
            files.forEach(file => {
              let str = `  "${file}": atlas${index},`;
              fs.writeSync(javascript, str+"\n");
              index += 1;
            });
            fs.writeSync(javascript, "};\n\n");
            fs.writeSync(javascript, `resource.atlas = atlasMap;\n\n`);
          }
  
          fs.writeSync(javascript, "\n");
          fs.writeSync(javascript, `export default resource;`);
          fs.closeSync(javascript);
          // grunt.log.writeln(`scene name : ${name}` );
          // grunt.log.writeln('save : ' + filename);

          filename = `${workspace.root}/tmp/nameMap/${lang}`;
          if(!fs.existsSync(filename)){
            fs.mkdirSync(filename, { recursive: true });
          }
          filename = `${filename}/${name}.js`;
          javascript = fs.openSync(filename, 'w');
          let id = lang.replace('-', '');
          fs.writeSync(javascript, `export let ${id}${name} = 'res/vendor/${lang}/${name}.js';\n`);
          fs.closeSync(javascript);

          // grunt.log.writeln('save : ' + filename);
          filename = `${workspace.root}/tmp/res/${lang}`;
          if(!fs.existsSync(filename)){
            fs.mkdirSync(filename, { recursive: true });
          }
          filename = `${filename}/${name}.yml`;
          let handle = fs.openSync(filename, 'w');
          fs.writeSync(handle, yaml.dump(obj));
          fs.closeSync(handle);
          // grunt.log.writeln('save : ' + filename);
        };
        done();
      }

      build();
    }
  });
  
  // CI 用
  grunt.registerTask('tag', '新增標籤', function(txt) {
    let cmdList = [];
    let cmd = 'shell:tag';
    if(txt) {
      cmd += ':' + txt;
    }
    if(!isFramework){
      cmdList.push('shell:status');
    }
    cmdList.push(cmd);
    grunt.task.run(cmdList);
  });

  // 資源檔合併
  grunt.registerTask('convert', '資源檔合併', async function(name) {
    let done = this.async();
    console.log(this);
    // let args = this.args;
    let shell = require('shelljs');

    let filename = `${workspace.root}/${name}`;
    console.log(filename);
    if(!fs.existsSync(filename)) {
      console.error(`找不到檔案 : ${filename}`);
      return;
    }

    let res = yaml.load(fs.readFileSync(filename, 'utf8'));
    console.log(res);

    let images = '';

    let loadTexture = (info) => {
      // console.log(info);
      let dir = `${workspace.root}/${info}`;
      let fmt = path.parse(dir);
      if(fs.existsSync(dir)) {
        // console.log('檔案存在');
        // identify
        let output = shell.exec(`identify ${dir}`, {silent: true}).stdout;
        let names = output.split(' ');
        console.log(names);

        images += ` ${dir}`;
      }
    };
  
    let procArray = (infoList, proc) => {
      infoList.forEach(info => {
        proc(info);
      });
    };
  
    let procObject = (object, proc) => {
      let nameList = Object.getOwnPropertyNames(object);
      nameList.forEach(name => {
        let child = object[name];
        if (typeof child === 'string') {
          proc(child);
        } else if (Array.isArray(child)) {
          procArray(child, proc);
        } else if (typeof child === 'object') {
          procObject(child, proc);
        } else {
          console.log(' no found : ' + name);
        }
      });
    };

    procObject(res.images, loadTexture);


    console.log(images);
    // -background none

    shell.exec(`montage ${images} -background none -geometry +1+1 ${workspace.root}/res/demo.png`);

    done();
  });


  // nodejs 專案用
  grunt.registerTask('run', '執行', function(mode) {
    let cmdList = [];
    let cmd = 'shell:run';
    if(mode) {
      cmd += ':' + mode;
    }
    console.log('command : ' + cmd);
    cmdList.push(cmd);
    grunt.task.run(cmdList);
  });
  
  grunt.registerTask('default', '預設任務', function() {
    let cmdList = [];
    cmdList.push('shell:default');
    grunt.task.run(cmdList);
  });

  grunt.registerTask('test', '測試', function(mode) {
    let cmdList = [];
    if(pkg.template.format === 'game') {
      mode = mode || 'data';
    }
    if(mode === 'data') {
      cmdList.push('clean:test');
      cmdList.push(`shell:test:${mode}`);
    }
    grunt.task.run(cmdList);
  });

  grunt.registerTask('bytenode', 'bytenode', function() {
    let cmdList = [];
    cmdList.push('shell:bytenode');
    grunt.task.run(cmdList);
  });
  
  grunt.registerTask('report', '產生報告', function(mode) {
    let cmdList = [];
    cmdList.push(`shell:report:${mode}`);
    grunt.task.run(cmdList);
  });

  grunt.registerTask('cssmin', '最小化 css', function() {
    let srcPath = `project/${pkg.current}/template/**/*.css`;

    let files = grunt.file.expand(srcPath);
    files.forEach((filename) => {
      let fmt = path.parse(filename);
      console.log(fmt);
      let CleanCSS = require('clean-css');
      let input = fs.readFileSync(filename, 'utf8')
      let options = { /* options */ };
      let output = new CleanCSS(options).minify(input);
      fs.writeFileSync(`${fmt.dir}/${fmt.name}.min${fmt.ext}`, output.styles, 'utf8');
    });

  });

  grunt.registerTask('obfuscate', 'obfuscate', function(mode) {
    let cmdList = [];
    if(mode === 'resource') {
      if(!fs.existsSync(`public/${pkg.currentMode}/${pkg.current}/data/vendor`)) {
        return;
      }
    }
    let obfuscateConfig = yaml.load(fs.readFileSync('builder/obfuscateConfig.yml', 'utf8'));
    let domainLock = (obfuscateConfig && obfuscateConfig.domainLock) || [];

    let srcPath = `project/${pkg.current}/release/**/*.js`;
    let config = {
      compact: false,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      debugProtectionInterval: false,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'mangled',
      log: false,
      renameGlobals: false,
      rotateStringArray: true,
      selfDefending: false,
      shuffleStringArray: true,
      splitStrings: true,
      stringArray: true,
      splitStringsChunkLength: 20,
      stringArrayEncoding: [
        'none',
        'base64',
        'rc4'
      ],
      stringArrayThreshold: 0.01,
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
      reservedNames: [
      ],
      domainLock: domainLock
    };
    let idPrefix = 'release';

    if(mode === 'resource') {
      idPrefix = 'res';
      srcPath = `public/${pkg.currentMode}/${pkg.current}/data/vendor/**/*.js`;
      config = {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'mangled', //'hexadecimal',
        log: false,
        renameGlobals: false,
        rotateStringArray: true,
        // reservedStrings: ['\/data/'],
        selfDefending: false,
        shuffleStringArray: true,
        splitStrings: true,
        stringArray: true,
        splitStringsChunkLength: 40,
        stringArrayEncoding: [
          'none',
          'base64',
          'rc4'
        ],
        stringArrayThreshold: 0.005,
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
        domainLock: domainLock
      };
    } else if (mode === 'vendor') {
      idPrefix = '';
      srcPath = `public/${pkg.currentMode}/${pkg.current}/app/**/*.js`;
      config = {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'mangled', //'hexadecimal',
        log: false,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: false,
        shuffleStringArray: true,
        splitStrings: true,
        stringArray: true,
        splitStringsChunkLength: 50,
        stringArrayEncoding: [
          'none',
          'base64',
          'rc4'
        ],
        stringArrayThreshold: 0.01,
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
        reservedNames: [
        ],
        domainLock: domainLock
      };
    }
    let JavaScriptObfuscator = require('javascript-obfuscator');
    let filename = `${workspace.root}/tmp/app.json`;
    let app = null;
    if(fs.existsSync(filename)) {
      app = JSON.parse(fs.readFileSync(filename, 'utf8'));
    }

    // console.log(srcPath);
    // let prefixStr = 'ZXYWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba';
    // let cnts = 0;
    // let page = -1;
    let files = grunt.file.expand(srcPath);

    files.forEach((filename) => {
      let fmt = path.parse(filename);
      if(app) {
        let nameList = fmt.base.split('.', 15);
        if((nameList[0] !== 'main') && nameList.length > 5) {
          grunt.log.writeln(colorette.green('skip ') + filename);
          return;
        }
      }

      grunt.log.writeln(colorette.green('obfuscation ') + filename);
      let nameList = fmt.name.split('.');

      let buf = fs.readFileSync(filename, 'utf8');

      // if(cnts >= prefixStr.length) {
      //   page += 1;
      //   cnts = 0;
      // }
      // let prefix;
      // if(page >= 0) {
      //   prefix = prefixStr[page] + prefixStr[cnts];
      // } else {
      //   prefix = prefixStr[cnts];
      // }
      // cnts +=1;

      config.identifiersPrefix = idPrefix;
      // config.identifiersPrefix += nameList[0][0];
      // for(let i = 1; i < nameList.length; i+=1) {
      //   config.identifiersPrefix += nameList[i].replace('-', '');
      // }

      nameList.forEach(name => {
        config.identifiersPrefix += name.replace('-', '');
      });

      let obfuscationResult = JavaScriptObfuscator.obfuscate(buf, config);
      buf = obfuscationResult.getObfuscatedCode();
      fs.writeFileSync(filename, buf, 'utf8');
    });

    // cmdList.push(`shell:obfuscate:${mode}`);
    grunt.task.run(cmdList);
  });

  grunt.registerTask('build', '建立正式版', function(mode) {
    if(isFramework){
      return;
    }
    console.log(`mode : ${mode || 'drop console'}`);

    changeMode(mode);
    if(workspace.runMode !== 'public'){
      workspace.runMode = 'build';
    }
    if(mode === 'log') {
      workspace.build.env = ',DROP_CONSOLE:false';
    } else {
      workspace.build.env = ',DROP_CONSOLE:true';
    }
  
    let cmdList = [];
    cmdList.push('clean:config');
    cmdList.push('clean:release');
    cmdList.push('config:release');
    cmdList.push('release');
    if(pkg.framework.builder === 'rollup') {
      cmdList.push(`rollup:release`);
      if(!pkg.framework.skipCommandTerser) {
        if(pkg.template.format === 'game') {
          if(mode === 'log') {
          cmdList.push('shell:terser:log');
          } else {
            cmdList.push('shell:terser');
          }
        } else {
          if(!pkg.template.release.customTerser) {
            if(mode === 'log') {
              cmdList.push('shell:terser:log');
            } else {
              cmdList.push('shell:terser');
            }
          }
        }
      }
    } else {
      if(mode === 'log') {
        cmdList.push('shell:uglify:log');
      } else {
        cmdList.push('shell:uglify');
      }
    }
    cmdList.push('hash:release');
    cmdList.push('copy:release');
    // if(!pkg.excluded || !pkg.excluded.autoTest) {
    // } else {
    //   if(pkg.template.format === 'game') {
    //     if(workspace.runMode === 'build'){
    //       cmdList.push('copy:gamecard');
    //     }
    //   }
    // }
    grunt.task.run(cmdList);
  });

  grunt.registerTask('public', '建立營運版', function(mode) {
    if(isFramework){
      return;
    }
    workspace.runMode = 'public';
    let cmdList = [];
    cmdList.push('clean:tmp');
    cmdList.push('clean:app');
    cmdList.push('clean:debug');
//    cmdList.push('clean:release');
    if(!resConfig.excluded) {
      cmdList.push('clean:data');
      cmdList.push('hash:res');
      cmdList.push('hash:resLoading');
      cmdList.push('hash:resFlat');
      cmdList.push('hash:resSpine');
      cmdList.push('hash:resBones');
      cmdList.push('replace:textureAsset');
      cmdList.push('hash:textureAsset');
      cmdList.push('replace:textureSpine');
      cmdList.push('hash:textureSpine');
      cmdList.push('hash:spine');
      cmdList.push('replace:textureBones');
      cmdList.push('hash:textureBones');
      cmdList.push('hash:bones');
      cmdList.push('replace:yml');
      cmdList.push('hash:resjs');
    } else {
      cmdList.push('clean:app');
    }
    if(resConfig.vendor) {
      let custom = resConfig.vendor.custom;
      let names = ['en-us', 'zh-tw', 'zh-cn'];
      if(Array.isArray(custom)) {
        names = custom;
      }
      names.forEach(lang => {
        cmdList.push('copy:atlas');
        cmdList.push(`shell:generatorvendor:${lang}`);
        cmdList.push('replace:vendor');
        cmdList.push(`resource:${lang}`);
        cmdList.push('replace:resource');
        cmdList.push(`shell:makeres:${lang}`);
      });
      cmdList.push('hash:vendor');
      cmdList.push('replace:resVendor');

      cmdList.push('build:' + mode);
      cmdList.push('replace:app');
      cmdList.push('hash:app');
      names.forEach(lang => {
        cmdList.push(`custom:${lang}`);
      });

    } else {
      cmdList.push('hash:vendor');
      cmdList.push('replace:resVendor');

      cmdList.push('build:' + mode);
      cmdList.push('replace:app');
      cmdList.push('hash:app');
    }
    cmdList.push('copy:app');

    if(pkg.template.format === 'game') {
      cmdList.push('hash:resGamecard');
      cmdList.push('replace:gamecard');
      if(!pkg.excluded || !pkg.excluded.autoTest) {
        cmdList.push('replace:gamelist');
      }
    }

    grunt.task.run(cmdList);
  });

  grunt.registerTask('deploy', '發佈', function(mode) {
    let currentMode = 'framework';
    pkg.excluded = {
      autoTest: true
    };

    let cmdList = [];
    let hasLog = true;
    let cleanName = 'clean:public';

    switch (mode) {
      case MODE.ALPHA:
        currentMode = MODE.ALPHA;
        break;
      case MODE.BETA:
        currentMode = MODE.BETA;
        break;
      case MODE.DEMO:
        currentMode = MODE.DEMO;
        hasLog = false;
        break;
      case MODE.TEST:
        currentMode = MODE.TEST;
        break;
      case MODE.DEVELOPER:
        currentMode = MODE.DEVELOPER;
        cleanName = 'clean:developer';
        hasLog = false;
        break;
      case MODE.RELEASE:
        currentMode = MODE.RELEASE;
        hasLog = false;
        break;
    }
    // 讀取設定檔
    let filename = 'builder/framework/' + currentMode + '.yml';
    console.log('config : ' + filename);
    let framework = yaml.load(fs.readFileSync(filename, 'utf8'));
    workspace.framework = framework;
    workspace.mode = currentMode;
    pkg.currentMode = currentMode;
  
    let str;
    let cleanPublic = grunt.config.get('clean.public');
    let replaceDeploy;
    
    // 清除 public 資料
    if(isFramework){
      cleanPublic.src = [
        'public/<%= pkg.currentMode %>/README.md',
        'public/<%= pkg.currentMode %>/dependence/**',
        'public/<%= pkg.currentMode %>/dependence',
        'public/<%= pkg.currentMode %>/systemjs/**',
        'public/<%= pkg.currentMode %>/systemjs'
      ];
    } else {
      cleanPublic.src = [
        'public/<%= pkg.currentMode %>/<%= pkg.current %>/**/*.*',
        'public/<%= pkg.currentMode %>/<%= pkg.current %>'
      ];
      
      // 是否為指定專案
      if('agent' === pkg.name) {
        if(currentMode === MODE.DEVELOPER){
          replaceDeploy = {
            options: {
              usePrefix: false,
              patterns: [
                {
                  match: '172.16.80.22',
                  replacement: '127.0.0.1'
                },
                {
                  match: '/project/',
                  replacement: '/developer/'
                }
              ]
            },
            files: [
              {expand: true, flatten: false, src: workspace.public.replace.src, dest: ''},
              {expand: true, flatten: false, src: ['developer/agent/index.html'], dest: ''},
              {expand: true, flatten: false, src: ['developer/agent/test/data/login.txt'], dest: ''}
            ]
          };
        } else {
          replaceDeploy = {
            options: {
              usePrefix: false,
              patterns: [
                {
                  match: '/project/',
                  replacement: '/public/<%= pkg.currentMode %>/'
                },
                {
                  match: '/systemjs/',
                  replacement: '/public/<%= pkg.currentMode %>/systemjs/'
                },
                {
                  match: '/dependence/',
                  replacement: '/public/<%= pkg.currentMode %>/dependence/'
                }
              ]
            },
            files: [
              {expand: true, flatten: false, src: workspace.public.replace.src, dest: ''}
            ]
          };

          // 設定快取
          if(resConfig.cache && resConfig.cache.src) {
            resConfig.cache.src = resConfig.cache.src.map(name => {
              return name.replace('project/', `public/${pkg.currentMode}/`);
            });
          }

          if(resConfig.cache && resConfig.cache.resource) {
            resConfig.cache.resource = resConfig.cache.resource.map(name => {
              return `public/${pkg.currentMode}/${name}`;
            });
          }
    
          if(resConfig.revision && resConfig.revision.src) {
            resConfig.revision.src = resConfig.revision.src.map(name => {
              return name.replace('project/', `public/${pkg.currentMode}/`);
            });
          }
        }
      } else {
        replaceDeploy = {
          options: {
            usePrefix: false,
            patterns: [
              {
                match: '/project/',
                replacement: '/public/<%= pkg.currentMode %>/'
              },
              {
                match: '/systemjs/',
                replacement: '/public/<%= pkg.currentMode %>/systemjs/'
              },
              {
                match: '/dependence/',
                replacement: '/public/<%= pkg.currentMode %>/dependence/'
              }
            ]
          },
          files: [
            {expand: true, flatten: false, src: workspace.public.replace.src, dest: ''}
          ]
        };

        // 設定快取
        if(resConfig.cache && resConfig.cache.src) {
          resConfig.cache.src = resConfig.cache.src.map(name => {
            return name.replace('project/', `public/${pkg.currentMode}/`);
          });
        }

        if(resConfig.cache && resConfig.cache.resource) {
          resConfig.cache.resource = resConfig.cache.resource.map(name => {
            return `public/${pkg.currentMode}/${name}`;
          });
        }

        if(resConfig.revision && resConfig.revision.src) {
          resConfig.revision.src = resConfig.revision.src.map(name => {
            return name.replace('project/', `public/${pkg.currentMode}/`);
          });
        }
      }
  
      // change config replace.deploy
      str = grunt.template.process(JSON.stringify(replaceDeploy), {
        data: {
          pkg: pkg
        }
      });
      grunt.config.set('replace.deploy', JSON.parse(str));
    }
  
    // change config clean.public
    str = grunt.template.process(JSON.stringify(cleanPublic), {
      data: {
        pkg: pkg
      }
    });

    if(!isFramework) {
      cmdList.push('shell:eslint');
    }

    grunt.config.set('clean.public', JSON.parse(str));
    if(workspace.public.useClean){
      cmdList.push(cleanName);
    }

    let event = workspace.public.event;
    if(event && event.start) {
      event.start({
        cloneList: workspace.public.cloneList,
        mode: currentMode,
        cmdList:cmdList
      });
    }

    if(workspace.public.cmdList) {
      workspace.public.cmdList.forEach(function(cmd){
        cmdList.push(cmd);
      });
    }

    if(isFramework){
      let files = workspace.public.cloneList;
      if(framework.systemjs && framework.systemjs.data && Array.isArray(framework.systemjs.data)){
        framework.systemjs.data.forEach(function (d){
          d.dest = 'public/' + currentMode + '/';
          files.push(d);
        });
      }
      let srcList = [];
      let names = Object.getOwnPropertyNames(framework.dependence);
      names.forEach(function (name) {
        let libList = framework.dependence[name];
        libList.forEach(function(lib){
          let name = 'dependence/' + lib;
          srcList.push(name);
        });
      });
      
      srcList.push('README.md');
      files.push({expand: true, src: srcList, dest: 'public/' + currentMode + '/'});
      cmdList.push('clone:public');
      // cmdList.push('compress:lib');
      // cmdList.push('compress:lib1');

    } else {
      let set = workspace.set;
      filename = 'builder/setting/' + currentMode + '/system.set.yml';
      let check = yaml.load(fs.readFileSync(filename, 'utf8'));

      if(set) {
        if(set.build && set.build.globalDefs) {
          let chkDefs = check.build.globalDefs;
          let names = Object.getOwnPropertyNames(chkDefs);
          names.forEach( function(name) {
            set.build.globalDefs[name] = chkDefs[name];
          });
        } else {
          set.build.globalDefs = check.build.globalDefs;
        }
      }

      if(hasLog){
        cmdList.push('public:log');
      } else {
        cmdList.push('public');
      }
      cmdList.push('clone:public');

      if(pkg.currentMode !== 'developer') {
        cmdList.push('copy:deploy');
      }

      cmdList.push('replace:deploy');
  
      if(pkg.framework.builder === 'rollup') {
        cmdList.push('replace:importmap');
      }
  
      if(pkg.currentMode === MODE.RELEASE) {
        if('agent' !== pkg.name) {
          cmdList.push('obfuscate:resource');
          cmdList.push('obfuscate:vendor');
        }

        // cmdList.push('cache:deploy');
        // cmdList.push('compress:project');
        // cmdList.push('compress:project1');
      }

      if(event && event.finish) {
        event.finish({
          mode: currentMode,
          cmdList:cmdList
        });
      }
    }

    grunt.task.run(cmdList);
  });
};
