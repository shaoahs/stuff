
/**
 * 結果
 */
let Command = {
  async handle (obj) {
    console.log('result :' + JSON.stringify(obj));
    let result = obj;

    let lib = await import('entity/main');
    let Main = lib.default;
    let main = Main.getSingleton();
    let center = main.getCenter();

    console.log('[初始化表演子場景]');
    let scene = await import('scene/sub');

    console.log('[開始表演子場景]');
    await scene.play(center.game, result);
    console.log('[完成表演子場景]');
  }
};

export default Command;

