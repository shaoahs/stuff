
/**
 * 取得資源
 * @param {String} id 資源代碼
 */
export async function get (id) {
  let res = {};
  res.texture  = await import(`../../res/sub/${id}.textureList.yml`);

  res.spine = await import('res/sub/base.spineList');
  res.object = await import('res/sub/base.objectList');
  res.sound = await import('res/sub/base.soundList');

  return res;
}
