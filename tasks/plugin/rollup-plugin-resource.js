// import rollup from 'rollup';

export default function myExample (options = {}) {
  console.log(options);
  return {
    name: 'my-example', // this name will show up in warnings and errors
    resolveId ( source ) {
      if (source === 'virtual-module') {
        return source; // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return null; // other ids should be handled as usually
    },
    load ( id ) {
      if (id === 'virtual-module') {
        return 'export default "This is virtual!"'; // the source code for "virtual-module"
      }
      return null; // other ids should be handled as usually
    },
    async buildEnd() {
      console.log('buildEnd');
      // let obj = await System.import('../../'+ options.input);
      // console.log(obj);

      return null;
    }
  };
}