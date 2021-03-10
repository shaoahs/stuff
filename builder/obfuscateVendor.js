// const yaml = require('js-yaml');
// const fs   = require('fs');
// 
// console.log(__dirname);
// let filename = '../builder.config.yml';
// console.log(filename);
// 
// let buf = fs.readFileSync(filename, 'utf8');
// console.log(buf);
// let config = yaml.load(buf);
// 
// console.log(config);

module.exports = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  debugProtectionInterval: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'mangled',
  log: false,
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: false,
  stringArray: true,
  splitStringsChunkLength: 5,
  stringArrayEncoding: false,
  stringArrayThreshold: 0.25,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  reservedNames: [
  ],
  domainLock: [
    'http://127.0.0.1:3000/'
  ]
};
