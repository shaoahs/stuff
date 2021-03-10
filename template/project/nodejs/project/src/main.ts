import * as func from 'src/func';



let isDone: boolean = false;
let list:Array<number> = [1,2,3,4];

enum Color {
  Red = 'pppp',
  Green = 'oooo',
  Blue = 'iiii'
}
let c:Color = Color.Blue;
console.log(c);

console.log(`isDone ${isDone}`);
console.log(list);

console.log('func.abcd : ' + func.abcd(5));
