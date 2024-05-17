import { $ } from "bun";

import content from "./content.config.yml";

console.log('[!!!!]', content.author);

let aa = 'hello world !!';

console.log(process.env.abcd);
console.log(process.env.zzzz);

// let result = await $`rollup --help`.text();
// console.log(result);

// for await (let line of $`ls"`.lines()) {
//   console.log('[]' + line); // Hello World!
// }