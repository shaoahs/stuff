import sound from 'res/load/base.soundList.yml';
import teEn from 'res/load/en-us.textureList.yml';
import teTw from 'res/load/zh-tw.textureList.yml';
import teCn from 'res/load/zh-cn.textureList.yml';

export let resource = {
  'en-us': {
    sound,
    texture: teEn
  },
  'zh-tw': {
    sound,
    texture: teTw
  },
  'zh-cn': {
    sound,
    texture: teCn
  }
};
