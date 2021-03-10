let base = '../../../';
let func = require(base + 'Gruntfile.js');
module.exports = function(grunt) {
  grunt.dir = __dirname;

  grunt.public = {
    skipHash: true,
    useClean: false
  };

  func(grunt);
};

