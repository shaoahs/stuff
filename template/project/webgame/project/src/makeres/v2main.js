
/**
 * 取得資源
 * @param {String} id 資源代碼
 */
export async function get (id) {
  let res = {};

  res.texture  = await import(`../../res/main/v2.${id}.textureList.yml`);

  res.spine = await import('res/main/base.spineList');

  res.object = await import('res/main/objectList');

  return res;
}
