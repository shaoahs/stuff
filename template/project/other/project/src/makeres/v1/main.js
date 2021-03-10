import sound from 'res/main/base.soundList.yml';
import spine from 'res/main/base.spineList.yml';
import object from 'res/main/base.objectList.yml';

import teEn from 'res/main/en-us.textureList.yml';
import teTw from 'res/main/zh-tw.textureList.yml';
import teCn from 'res/main/zh-cn.textureList.yml';

export let resource = {
  'en-us': {
    sound,
    texture: teEn,
    spine,
    object
  },
  'zh-tw': {
    sound,
    texture: teTw,
    spine,
    object
  },
  'zh-cn': {
    sound,
    texture: teCn,
    spine,
    object
  }
};
