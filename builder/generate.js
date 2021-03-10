const path = require("path");
const fs = require("fs");
const Mustache = require('mustache');
// const yaml = require('js-yaml');


let basePackage = {
  "main":"src/main.js",
  "defaultExtension": "js",
  "format": "amd",
  "meta": {
    "*.js": {
      "loader": "plugin-babel",
      "babelOptions": {
        "plugins": [
        ]
      }
    },
    "*.ts": {
      "typescriptOptions":{
        "tsconfig": true
      },
      "loader": "ts"
    },
    "*.css": {
      "loader": "css"
    },
    "*.yml": {
      "loader": "yml"
    }
  }
};
let basic = {};
basic.build = {
  format: 'amd',
  sourceMaps: false,
  mangle: false,
  minify: false,
  runtime: false
};
basic.config = {
  packages: {
    "typescript": {
      "main": "lib/typescript.js",
      "meta": {
        "lib/typescript.js": {
          "exports": "ts"
        }
      }
    }
  }
};

function generateFile(workspace, rule, output){
  let set = workspace.set;
  let buf;
  let view = {
    def(){
      return 'var ' + this.name + ' = ' + this.state + ';';
    },
    main(){
      return set.package.main;
    },
    defaultExtension(){
      return set.package.defaultExtension;
    },
    pathName() {
      let str = '"' + this.shortName + '": "' + this.realPath + '"';
      if(!this.isLast){
        str += ',';
      }
      return str;
    },
    mapName(){
      let str = '"' + this.key + '": "' + this.realPath + '"';
      if(!this.isLast){
        str += ',';
      }
      return str;
    },
    packageName(){
      return workspace.current;
    }
  };
  let names = Object.getOwnPropertyNames(set.config);
  names.forEach(name => {
    let obj = set.config[name];
    switch(name){
      case 'paths':
        let pathList = [];
        let paths = Object.getOwnPropertyNames(obj);
        paths.forEach(path => {
          let o = {
            shortName: path,
            realPath: obj[path],
          };
          pathList.push(o);
        });
        pathList[pathList.length-1].isLast = true;

        view.paths = pathList;
        break;
      case 'map':
        let mapList = [];
        let maps = Object.getOwnPropertyNames(obj);
        maps.forEach(key => {
          let o = {
            key: key,
            realPath: obj[key],
          };
          mapList.push(o);
        });
        mapList[mapList.length-1].isLast = true;

        view.map = mapList;
        break;

      default:
        view[name] = obj;
    }
  });
  if(!view.hasOwnProperty('transpiler')){
    view.transpiler = 'plugin-babel';
    set.config.transpiler = 'plugin-babel';
  }
  if(!view.hasOwnProperty('baseURL')){
    view.baseURL = 'project/';
    set.config.baseURL = 'project/';
  }
  if(!rule.release && set.build && set.build.globalDefs){
    let defs = set.build.globalDefs;
    let names = Object.getOwnPropertyNames(defs);
    view.globalDefs = [];
    names.forEach(name => {
      let def = defs[name];
      let o = {
        name: name,
        state: def
      };
      view.globalDefs.push(o);
    });
  }
  view.current = workspace.current;

  let filename = rule.template;
  buf = fs.readFileSync(filename, 'utf8');
  buf = Mustache.render(buf, view);

  // output
  let str = path.parse(output);
  if(!fs.existsSync(str.dir)){
    fs.mkdirSync(str.dir);
  }

  fs.writeFileSync(output, buf, 'utf8');
}


exports.build = function(workspace, rule, done){
  let set = workspace.set;
  let paths = set.config.paths;
  let baseURL = set.config.baseURL || 'project/';
  let rootPath = 'project/';

  let pkgName = workspace.current;

  set.config.packages = basic.config.packages;
  set.config.packages[pkgName] = basePackage;
  if(set.package){
    if(typeof set.package.main === 'string'){
      basePackage.main = set.package.main;
    }
    if(typeof set.package.defaultExtension === 'string'){
      basePackage.defaultExtension = set.package.defaultExtension;
    }
  }
  basePackage.meta['*.ts'].typescriptOptions.tsconfig = pkgName + '/tsconfig.json';

  // debug
  if(rule.debug){
    rule.template = 'template/debug.config.mustache';
    set.config.baseURL = '/' + baseURL;
    paths['depend:'] = '/dependence/';
    paths['node:'] = '/node_modules/';
    paths['sys:'] = '/systemjs/';

    // 測試用
    if(set.test && set.test.paths){
      let names = Object.getOwnPropertyNames(set.test.paths);
      names.forEach(name => {
        paths[name] = set.test.paths[name];
      });
    }
    let output = rootPath + pkgName + '/debug/debug.config.js';
    generateFile(workspace, rule, output);
  }

  // release
  if(rule.release){
    rule.template = 'template/debug.config.mustache';
    set.config.baseURL = baseURL;
    paths['depend:'] = './dependence/';
    paths['node:'] = './node_modules/';
    paths['sys:'] = './systemjs/';
    let output = rootPath + pkgName + '/release/node.config.js';
    generateFile(workspace, rule, output);

    rule.template = 'template/release.config.mustache';
    if(set.generate && (typeof set.generate.baseURL === 'string')){
      set.config.baseURL = set.generate.baseURL;
    } else {
      set.config.baseURL = '/' + baseURL;
    }

    //reset (browser used)
    paths = {};
    paths['depend:'] = '/dependence/';

    // 測試用
    if(set.test && set.test.paths){
      let names = Object.getOwnPropertyNames(set.test.paths);
      names.forEach(name => {
        paths[name] = set.test.paths[name];
      });
    }
    let tmp = set.config.paths;
    set.config.paths = paths;
    output = rootPath + pkgName + '/config/browser.config.js';
    generateFile(workspace, rule, output);

    // reset
    set.config.paths = tmp;
    set.config.baseURL = baseURL;
  }
  done();
};
