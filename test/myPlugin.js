import { plugin } from "bun";

await plugin({
  name: "YAML",
  async setup(build) {
    const { load } = await import("js-yaml");

    console.log('[js-yaml]', load);

    // when a .yaml file is imported...
    build.onLoad({ filter: /\.(yaml|yml)$/ }, async (args) => {

      // read and parse the file
      const text = await Bun.file(args.path).text();
      const exports = {
        default: load(text)
      };

      console.log('[exports] ', exports);

      // and returns it as a module
      return {
        exports,
        loader: "object", // special loader for JS objects
      };
    });
  },
});