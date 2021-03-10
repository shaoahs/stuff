
/**
 * 取得資源
 * @param {String} id 資源代碼
 */
export async function get (id) {
  let res = {};

  switch (id) {

    // 英文-美
    case 'en-us':
      res.texture = await import('res/main/en-us.textureList');
      break;

    // 中文-台灣
    case 'zh-tw':
      res.texture = await import('res/main/zh-tw.textureList');
      break;

    // 中文-大陸
    case 'zh-cn':
      res.texture = await import('res/main/zh-cn.textureList');
      break;

    // -越南
    case 'vi-vn':
      res.texture = await import('res/main/en-us.textureList');
      break;

    // -泰文
    case 'th-th':
      res.texture = await import('res/main/en-us.textureList');
      break;

    // 英文-美
    default:
      res.texture = await import('res/main/en-us.textureList');
  }

  res.spine = await import('res/main/base.spineList');

  res.object = await import('res/main/objectList');

  return res;
}
