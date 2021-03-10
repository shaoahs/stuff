
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

  switch (id) {
    case ID.EN_US:
      lang = await import('language/en-us');
      break;
    case ID.ZH_TW:
      lang = await import('language/zh-tw');
      break;
    case ID.ZH_CN:
      lang = await import('language/zh-cn');
      break;
    case ID.TH_TH:
      lang = await import('language/th-th');
      break;
    case ID.VI_VN:
      lang = await import('language/vi-vn');
      break;
    default:
      currentID = ID.EN_US;
      lang = await import('language/en-us');
  }

}

/**
 * 取得目前語言代碼
 * @return {*} 傳回語言代碼
 */
export function getID () {
  return currentID;
}
