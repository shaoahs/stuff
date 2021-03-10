import sound from 'res/sub/base.soundList.yml';
import spine from 'res/sub/base.spineList.yml';
import object from 'res/sub/base.objectList.yml';

import teEn from 'res/sub/en-us.textureList.yml';
import teTw from 'res/sub/zh-tw.textureList.yml';
import teCn from 'res/sub/zh-cn.textureList.yml';

export let resource = {
  'en-us': {
    texture: teEn,
    sound,
    spine,
    object
  },
  'zh-tw': {
    texture: teTw,
    sound,
    spine,
    object
  },
  'zh-cn': {
    texture: teCn,
    sound,
    spine,
    object
  }
};
