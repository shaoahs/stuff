import { createFilter, makeLegalIdentifier, dataToEsm } from '@rollup/pluginutils';

class TextureAtlasReader {
  constructor(text) {
    this.index = 0;
    this.lines = text.split(/\r\n|\r|\n/);
  }
  readLine() {
    if (this.index >= this.lines.length)
      return null;
    return this.lines[this.index++];
  }
  readValue() {
    let line = this.readLine();
    let colon = line.indexOf(":");
    if (colon == -1)
      throw new Error("Invalid line: " + line);
    return line.substring(colon + 1).trim();
  }
  readTuple(tuple) {
    let line = this.readLine();
    let colon = line.indexOf(":");
    if (colon == -1)
      throw new Error("Invalid line: " + line);
    let i = 0, lastMatch = colon + 1;
    for (; i < 3; i++) {
      let comma = line.indexOf(",", lastMatch);
      if (comma == -1)
        break;
      tuple[i] = line.substr(lastMatch, comma - lastMatch).trim();
      lastMatch = comma + 1;
    }
    tuple[i] = line.substring(lastMatch).trim();
    return i + 1;
  }
}

const ext = /\.atlas/;

export default function atlas(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
  name: 'atlas',

  transform(atlas, id) {
    if (!ext.test(id)) return null;
    if (!filter(id)) return null;

    // const data = new TextureAtlasReader(atlas);
    const data = atlas.toString();
    const keys = Object.keys(data).filter(
      key => key === makeLegalIdentifier(key)
    );
    // console.log('====');
    // console.log(`atlas : ${id}`);
    // console.log('----------');
    // console.log(data);
    
    let code = dataToEsm(data, {
      preferConst: options.preferConst,
      compact: options.compact,
      namedExports: false,
      indent: '  '
    });
    // console.log('======================');
    // console.log(code);
    // console.log('======================');

    return {
      code: code,
      map: { mappings: '' }
    };
  }
  };
}