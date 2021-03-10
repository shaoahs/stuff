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
  reservedStrings: ['\/data/'],
  selfDefending: false,
  shuffleStringArray: true,
  splitStrings: false,
  stringArray: true,
  splitStringsChunkLength: 5,
  stringArrayEncoding: 'base64',
  stringArrayThreshold: 0.25,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  domainLock:[
    'http://127.0.0.1:3000/'
  ]
};
