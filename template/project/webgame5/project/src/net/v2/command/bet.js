/**
 * 下注
 */
export async function send (bet) {
  let net =  await import('net/network');
  let actionTypes = net.getActionTypes();
  let ActionType = actionTypes.data;

  let data = {
    actionType: ActionType.BET,
    bet: bet,
    userinfo: {
      subbet: 1,
      ppl: 2
    }
  };

  console.log('[傳送] 下注');
  let result = await net.send(data);
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
