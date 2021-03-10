
import data from 'res/sub/base.config.yml';
import spine from 'res/sub/base.spineList.yml';
import object from 'res/sub/base.objectList.yml';

import teEn from 'res/sub/en-us.textureList.yml';
import teTw from 'res/sub/zh-tw.textureList.yml';
import teCn from 'res/sub/zh-cn.textureList.yml';

let resource = {
  'en-us': {
    data: data,
    texture: teEn,
    spine: spine,
    object: object
  },
  'zh-tw': {
    data: data,
    texture: teTw,
    spine: spine,
    object: object
  },
  'zh-cn': {
    data: data,
    texture: teCn,
    spine: spine,
    object: object
  }
};

export default resource;
