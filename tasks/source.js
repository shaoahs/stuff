
import { watch } from "fs";
import myPlugin from "./myPlugin";

import { Glob } from "bun";

console.log(process.env);

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

const watcher = watch(`${import.meta.dir}/src`, 
  { recursive: true },
  (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);

    run();
  });

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});

