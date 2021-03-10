

let attr = {
  event: null,
  game: null
};

/**
 * 處理鍵盤事件
 * @param event
 */
function quickDown (event) {
  const keyName = event.key || event.code;
  console.log(keyName);
  let e = attr.event;
  let game = attr.game;
  if (!game || game.isPause()) {
    return;
  }

  switch (keyName) {
    case 'ArrowDown':
      e.clickRule();
      break;
    case 'ArrowUp':
      e.clickBet();
      break;
    case 'ArrowLeft':
      e.play();
      break;
    case 'ArrowRight':
      e.stop();
      break;
    case 'Enter':
      e.clickStart();
      break;
  }
}
function quickUp (event) {
  const keyName = event.key || event.code;
  console.log(keyName);
  let e = attr.event;
  let game = attr.game;
  if (!game || game.isPause()) {
    return;
  }
  console.log(e);

}
let isInit = false;

/**
 * 初始化
 * @param config
 * @returns {boolean}
 */
export function init (config) {
  console.log('init key event !');
  if (isInit || !window || !window.parent) {
    return false;
  }
  isInit = true;
  attr.event = config.event;
  attr.game = config.game;
  window.parent.addEventListener('keydown', quickDown);
  window.parent.addEventListener('keyup', quickUp);
  window.addEventListener('keydown', quickDown);
  window.addEventListener('keyup', quickUp);
  window.focus();
  return true;
}

/**
 * 釋放資源
 * @returns {boolean}
 */
export function release () {
  if (!isInit || !window || !window.parent) {
    return false;
  }
  isInit = false;
  window.parent.removeEventListener('keydown', quickDown);
  window.parent.removeEventListener('keyup', quickUp);
  window.removeEventListener('keydown', quickDown);
  window.removeEventListener('keyup', quickUp);
  return true;
}
