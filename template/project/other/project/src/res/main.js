
import sound from 'res/main/base.soundList.yml';
import spine from 'res/main/base.spineList.yml';
import object from 'res/main/base.objectList.yml';

import teEn from 'res/main/en-us.textureList.yml';
import teTw from 'res/main/zh-tw.textureList.yml';
import teCn from 'res/main/zh-cn.textureList.yml';

let resource = {
  'en-us': {
    sound: sound,
    texture: teEn,
    spine: spine,
    object: object
  },
  'zh-tw': {
    sound: sound,
    texture: teTw,
    spine: spine,
    object: object
  },
  'zh-cn': {
    sound: sound,
    texture: teCn,
    spine: spine,
    object: object
  }
};

export default resource;
