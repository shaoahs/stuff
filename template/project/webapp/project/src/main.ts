/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */
// import 'src/vendor';
// import * as component from 'src/component';
// component.run();


// 程式進入點
async function run() {
  await import('src/vendor');
  let component = await import('src/component');
  component.run();
}

run().then(()=> {
  console.log('!!!! run !!!!');
}).catch((err)=> {
  console.error(err);
});