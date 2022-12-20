
/**
 * 取得資源
 * @param {String} id 資源代碼
 */
export async function get (id) {
  let res = {};

  res.texture  = await import(`../../res/load/v1.${id}.textureList.yml`);

  res.sound = await import('res/load/base.soundList');

  return res;
}

