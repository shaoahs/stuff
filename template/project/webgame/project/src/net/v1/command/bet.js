
/**
 * 下注
 */
let Command = {
  async handle (obj) {
    console.log('bet :' + JSON.stringify(obj));
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

/**
 * 下注
 */
export async function send (bet) {
  let net =  await import('net/network');
  let netCmd =  net.getCommand();
  let CMD = netCmd.CMD;
  let data = {
    bet: bet,
    userinfo: {
      subbet: 1,
      ppl: 2
    }
  };

  console.log('[傳送] 下注');
  let result = await net.sendCommand(CMD.BET, data);

  // 判斷是否是舊版
  if ((typeof result === 'number') || (typeof result === 'boolean')) {
    return null;
  }
  if (!result) {
    return;
  }

  console.log('[收到] 下注');
  console.log(result);

  console.log('[初始化表演子場景]');
  let scene = await import('scene/sub');

  console.log('[開始表演子場景]');
  let lib = await import('entity/main');
  let Main = lib.default;
  let main = Main.getSingleton();
  let center = main.getCenter();
  await scene.play(center.game, result);
  console.log('[完成表演子場景]');

  return result;
}
