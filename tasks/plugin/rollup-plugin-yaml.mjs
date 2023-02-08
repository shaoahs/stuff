import YAML from 'js-yaml';
import { createFilter, makeLegalIdentifier, dataToEsm } from '@rollup/pluginutils';

const ext = /\.ya?ml$/;

export default function yaml(options = {}) {
	const filter = createFilter(options.include, options.exclude);

	return {
		name: 'yaml',

		transform(yaml, id) {
			if (!ext.test(id)) return null;
			if (!filter(id)) return null;

			const data = YAML.load(yaml);
			const keys = Object.keys(data).filter(
				key => key === makeLegalIdentifier(key)
      );
      
			let code = dataToEsm(data, {
        preferConst: false,
        compact: false,
        namedExports: true,//options.namedExports,
        indent: '  '
      });

			// console.log(id, code);

			return {
				code: code,
				map: { mappings: '' }
			};
		}
	};
}