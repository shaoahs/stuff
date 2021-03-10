
import app from 'entity/app';
import * as strings from 'language/strings';
import nameMap from 'src/nameMap';


// 網路版本
export const NET_VERSION = {
  V0: 'v0',
  V1: 'v1',
  V2: 'v2'
};

let currentVersion = NET_VERSION.V0;

/**
 * 取得網路版本
 */
export function getNetVersion () {
  return currentVersion;
}
export function useNetV1 () {
  return currentVersion = NET_VERSION.V1;
}
export function useNetV2 () {
  return currentVersion = NET_VERSION.V2;
}


/**
 * 取得資源
 * @param {string} name 名稱
 * @param {string} lang 語言,可以不輸入
 */
export async function get (name, lang) {
  if (!lang) {
    lang = strings.getID();
  }
  let id = lang.replace('-', '');

  let str = nameMap[`${id}${name}`];
  let res = await import(`${app.baseURL}${str}`);
  console.log(res);
  return res.default;
}
