
// import { watch } from "fs";
import myPlugin from "./myPlugin";
import { Glob, plugin } from "bun";


plugin({
  name: "YAML",
  async setup(build) {
    const { load } = await import("js-yaml");
    const { readFileSync } = await import("fs");

    // when a .yaml file is imported...
    build.onLoad({ filter: /\.(yaml|yml)$/ }, (args) => {

      // read and parse the file
      const text = readFileSync(args.path, "utf8");
      const exports = load(text);

      console.log(exports);

      // and returns it as a module
      return {
        exports,
        loader: "object", // special loader for JS objects
      };
    });
  },
});

// import res from "./res.config.yml";
// console.log('[res]', res);

import data from "res/main/objectList.yml";
console.log('aa', data);

// const glob = new Glob([
//   'gamecard/*.{png,jpg}', 
//   'res/**/*.{png,jpg}'
// ]);
const glob = new Glob('**/*.{png,jpg,yml}');


console.log('[res gamecard]');
for await (const path of glob.scan("res")) {
  console.log(path); //
}

console.log('[gamecard]');
for await (const path of glob.scan("gamecard")) {
  console.log(path); //
}
// for await (const path of glob.scan("src")) {
//   console.log(path); //
// }


async function run() {
  let obj = await Bun.build({
    "entrypoints": [
      "./src/main.js"
    ],
    "outdir": "./debug",
    "external": [
      "nuts",
      "mithril",
      "tweenjs",
      "mustache",
      "howler",
      "apng-js",
      "babylonjs",
      "pixi.js",
      "pixi",
      "pixi-spine",
      "pixi-particles",
      "pixi-heaven",
      "dragonBones",
      "dragonBonesPixi"
    ],
    plugins: [
      myPlugin
    ],
    "target": "browser",
    "format": "esm",
    "sourcemap": "inline"
  });
  console.log(obj);
}

run();

// const watcher = watch(`${import.meta.dir}/src`, 
//   { recursive: true },
//   (event, filename) => {
//     console.log(`Detected ${event} in ${filename}`);

//     run();
//   });

// process.on("SIGINT", () => {
//   // close watcher when Ctrl-C is pressed
//   console.log("Closing watcher...");
//   watcher.close();

//   process.exit(0);
// });

