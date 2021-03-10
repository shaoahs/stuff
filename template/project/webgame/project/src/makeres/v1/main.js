import spine from 'res/main/base.spineList.yml';
import object from 'res/main/objectList.yml';

import teEn from 'res/main/en-us.textureList.yml';
import teTw from 'res/main/zh-tw.textureList.yml';
import teCn from 'res/main/zh-cn.textureList.yml';

export let resource = {
  'en-us': {
    texture: teEn,
    spine,
    object
  },
  'zh-tw': {
    texture: teTw,
    spine,
    object
  },
  'zh-cn': {
    texture: teCn,
    spine,
    object
  }
};
