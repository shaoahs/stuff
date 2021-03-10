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

let langID = 'enus';
export function setLang (id) {
  langID = id.replace('-', '');
}

let baseURL = '.';
export function setBaseURL (url) {
  baseURL = url;
}

export function getBaseURL () {
  return baseURL;
}

/**
 * 取得資源
 * @param {string} name 名稱
 */
export async function get (name) {

  let str = nameMap[`${langID}${name}`];
  let res = await import(`${baseURL}/${str}`);
  return res.default;
}
