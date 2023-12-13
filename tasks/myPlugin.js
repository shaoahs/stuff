import { plugin } from "bun";

import { readFileSync } from "fs";
import { load } from "js-yaml";

// function myPlugin() {
//   return {
//     name: "bun-plugin-my",
//     setup(builder) {
//       builder.onLoad({ filter: /\.(yaml|yml)$/ }, args => {
//         const text = readFileSync(args.path, "utf8");
//         const exports = load(text);
//         console.log(exports);
//         return {
//           exports,
//           loader: "object",
//         };
//       });
//     },
//   };
// }

// export default myPlugin;

let myPlugin = {
  name: "bun-plugin-my",
  async setup(builder) {
    console.log(builder);

    builder.onLoad({ filter: /\.(yaml|yml)$/ }, args => {
      console.log(args);
      const text = readFileSync(args.path, "utf8");
      const exports = load(text);
      console.log(exports);
      let contents = JSON.stringify(exports);
      return {
        contents,
        loader: "json"
      };
    });
  },
};
export default myPlugin;