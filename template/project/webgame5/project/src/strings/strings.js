
/**
 * 語言代碼
 * @type {{EN_US: string, ZH_TW: string, ZH_CN: string}}
 */
export const ID = {
  EN_US: 'en-us',
  ZH_TW: 'zh-tw',
  ZH_CN: 'zh-cn',
  TH_TH: 'th-th',
  VI_VN: 'vi-vn'
};

let lang = null;
let currentID = ID.EN_US;
export function get (name) {
  'use strict';
  let str = 'null';
  if (lang) {
    str = lang.get(name);
    if (!str) {
      str = 'no found !';
    }
  }

  return str;
}

/**import
 */
export async function setLanguage (id) {
  currentID = id;
  lang = await import(`./locales/${currentID}.js`);
}

/**
 * 取得目前語言代碼
 * @return {*} 傳回語言代碼
 */
export function getID () {
  return currentID;
}
