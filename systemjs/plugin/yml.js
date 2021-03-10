/*
  YAML plugin
*/
var jsyaml = require('js-yaml');

// this code allows named exports of valid identifiers in yaml to work with rollup
// so you can effectively "pick" a yaml value and have the other base-level yaml values excluded
// not comprehensive of course
function isValidIdentifier(exportName) {
  return exportName.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*$/);
}

module.exports = {
  translate: function(load) {
    var yaml = jsyaml.safeLoad(load.source);
    if (this.builder && this.transpiler && !Array.isArray(yaml)) {
      load.metadata.format = 'esm';

      var namedExports = Object.keys(yaml);
      var validIdentifiers = namedExports.filter(isValidIdentifier);

      var output = ['exp' + 'ort var __useDefault = true;\n'];

      validIdentifiers.forEach(function (exportName) {
        output.push('exp' + 'ort var ' + exportName + ' = ' + JSON.stringify(yaml[exportName]) + ';\n');
      });

      output.push('exp' + 'ort default {\n');
      namedExports.forEach(function (exportName) {
        if (validIdentifiers.indexOf(exportName) !== -1) {
          output.push(exportName + ': ' + exportName + ',\n');
        }
        else {
          output.push(JSON.stringify(exportName) + ': ' + JSON.stringify(yaml[exportName]) + ',\n');
        }
      });

      output.push('};');

      return output.join('');
    }
    if (this.builder) {
      load.metadata.format = 'cjs';
      return 'module.exports = ' + JSON.stringify(yaml);
    }
  },
  instantiate: function(load) {
    if (!this.builder) {
      return jsyaml.safeLoad(load.source);
    }
  }
}
