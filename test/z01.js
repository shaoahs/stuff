import { $ } from "bun";

let aa = 'hello world !!';

let result = await $`rollup --help`.text();
console.log(result);

for await (let line of $`ls"`.lines()) {
  console.log('[]' + line); // Hello World!
}