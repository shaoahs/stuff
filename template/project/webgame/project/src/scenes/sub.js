import app from 'entity/app';


let isCreate = false;
let isPlay = false;
let scene = null;

export function reset () {
  isPlay = false;
}

export async function play (game, result) {
  let sceneManager = app.nuts.scene.sceneManager;
  let ui = app.nuts.ui;

  let loading = ui.loading;
  const NUM = ui.Number.NUM;

  if (isPlay) {
    return;
  }
  isPlay = true;

  // 是否需要建立
  if (!isCreate) {

    // 讀取資源檔
    let vendor = await import('src/vendor');
    let res = await vendor.get('sub');

    let config = {
      game,
      loading,
      infoList: [
        { eventName: 'texture', obj: res},
        { eventName: 'spine', obj: res},
        { eventName: 'object',  obj: res},
        { eventName: 'sound',   obj: res}
      ]
    };
    console.log('[讀取資源檔]');
    scene = await sceneManager.createScene(config);
    isCreate = true;

    let container = new PIXI.Container();

    let textures = scene.textures;
    let teCoin = textures.demo.coin;
    for (var i = 0; i < 25; i++) {
      var bunny = new PIXI.Sprite(teCoin['100']);
      bunny.anchor.set(0.5);
      bunny.x = (i % 5) * 50;
      bunny.y = Math.floor(i / 5) * 50;
      container.addChild(bunny);
    }

    // Move container to the center
    container.x = 200 + 512 / 2;
    container.y = 512 / 2;

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    scene.container = container;
  }

  let container = scene.container;
  console.log(scene);
  let obj;

  obj = scene.entity.cash;
  obj.setAlign(NUM.HORI_ALIGN.CENTER, NUM.VERTI_ALIGN.CENTER);
  obj.fixVal = 2;
  obj.setValue(654321);

  // 顯示
  scene.show();

  let layer = game.layer.main;
  layer.addChild(container);

  let update = {
    update (offsetTime) {
      container.rotation -= 0.5 * offsetTime;
    }
  };

  game.addUpdate(update);
  console.log('等待 1 秒');
  await game.idle(1.0);
  console.log('1 秒後');
  let example = scene.example;
  if (!example) {
    let obj = new PIXI.Container();
    obj.x = 100;
    obj.y = 250;
    example = scene.example = obj;
  }
  layer.addChild(example);

  let spines = scene.spines.demo;
  let light01 = scene.light01;
  if (!light01) {
    let spine = new PIXI.spine.Spine(spines.contbo.tom.star[0]);
    spine.skeleton.setToSetupPose();
    spine.autoUpdate = false;
    light01 = scene.light01 = spine;
  }
  light01.state.setAnimation(0, 'demo', false);

  example.addChild(light01);
  game.addUpdate(light01);

  await game.idle(1.0);
  console.log('1 秒後');

  let light02 = scene.light02;
  if (!light02) {
    let spine = new PIXI.spine.Spine(spines.contbo.tom.star[1]);
    spine.skeleton.setToSetupPose();
    spine.autoUpdate = false;
    light02 = scene.light02 = spine;
  }
  light02.state.setAnimation(0, 'demo', false);
  example.addChild(light02);
  game.addUpdate(light02);

  example.removeChild(light01);
  game.removeUpdate(light01);

  await game.idle(1.0);
  console.log('1 秒後');

  let star1 = scene.star1;
  if (!star1) {
    let spine = new PIXI.spine.Spine(spines.contbo.tom.loop[0]);
    spine.skeleton.setToSetupPose();
    spine.autoUpdate = false;
    star1 = scene.star1 = spine;
  }
  star1.state.setAnimation(0, 'demo', false);
  example.addChild(star1);
  game.addUpdate(star1);

  example.removeChild(light02);
  game.removeUpdate(light02);

  await game.idle(1.0);
  console.log('1 秒後');

  let star2 = scene.star2;
  if (!star2) {
    let spine = new PIXI.spine.Spine(spines.contbo.tom.loop[1]);
    spine.skeleton.setToSetupPose();
    spine.autoUpdate = false;
    star2 = scene.star2 = spine;
  }

  star2.state.setAnimation(0, 'demo', false);
  example.addChild(star2);
  game.addUpdate(star2);

  await game.idle(1.0);
  console.log('1 秒後');

  let text = scene.text;
  if (!text) {
    let spine = new PIXI.spine.Spine(spines.contbo.tom.loop[4]);
    spine.skeleton.setToSetupPose();
    spine.autoUpdate = false;
    text = scene.text = spine;
  }
  text.state.setAnimation(0, 'demo', true);
  example.addChild(text);
  game.addUpdate(text);

  example.removeChild(star1);
  example.removeChild(star2);
  game.removeUpdate(star1);
  game.removeUpdate(star2);

  let btnSystem = scene.btnSystem;
  if (!btnSystem) {
    obj = scene.entity.btnSystem;
    let btn = obj.clone();
    btn.x = 500;
    btn.y = 50;
    btnSystem = scene.btnSystem = btn;
  }
  layer.addChild(btnSystem);

  console.log(result);

  // reset
  await game.idle(1.0);
  console.log('1 秒後');
  game.removeUpdate(text);
  game.removeUpdate(update);

  layer.removeChild(container);
  layer.removeChild(example);
  example.removeChild(text);
  layer.removeChild(btnSystem);

  scene.hide();
  isPlay = false;
}


