
/**
 * 結果
 */
let Command = {
  async handle (obj) {
    console.log('result :' + JSON.stringify(obj));
    let result = obj;

    console.log('[初始化表演子場景]');
    let scene = await import('scene/sub');

    console.log('[開始表演子場景]');
    await scene.play(result);
    console.log('[完成表演子場景]');
  }
};

export default Command;
