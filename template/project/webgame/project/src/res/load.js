import * as strings from 'language/strings';

/**
 * 取得資源
 * @param {String} id 資源代碼
 */
export async function get (id) {
  let res = {};
  let obj;

  if (!id) {
    id = strings.getID();
  }

  // 取得材質
  switch (id) {

    // 英文-美
    case 'en-us':
      obj = await import('res/load/en-us.textureList');
      res = obj;
      break;

    // 中文-台灣
    case 'zh-tw':
      obj = await import('res/load/zh-tw.textureList');
      res = obj;
      break;

    // 中文-大陸
    case 'zh-cn':
      obj = await import('res/load/zh-cn.textureList');
      res = obj;
      break;

    // 英文-美
    default:
      obj = await import('res/load/en-us.textureList');
      res = obj;
  }

  // 取得音效
  obj = await import('res/load/base.soundList');
  res.sounds = obj.sounds;

  return res;
}

