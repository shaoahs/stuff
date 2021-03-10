let base = '../../../';
let func = require(base + 'Gruntfile.js');
module.exports = function(grunt) {
  grunt.dir = __dirname;

  grunt.public = {
//    cmdList:['shell:sass'],
  };
/*
  grunt.config.init({
    shell: {
      sass: {
        command() {
          return 'sass --version';
        }
      }
    }
  });
*/
  func(grunt);
};
