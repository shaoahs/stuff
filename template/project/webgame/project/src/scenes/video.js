import app from 'entity/app';

// 初始值
let player = null;

export async function getPlayer () {
  let obj = await app.game.getProject('video/player');
  return obj.lib.player;
}


export async function init (config) {
  if (!player) {
    player = await getPlayer();
  }
  await player.init(config);
  app.player = player;
}

