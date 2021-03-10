/*eslint-disable max-len*/
const ID = {
  opps: '糟糕',
  nickname: '昵称',
  loading: '读取中',
  connecting: '连线中',
  yes: '是',
  no: '否',
  my: '玩家',
  close: '关闭',
  window: '视窗',
  record: '纪录',
  deposit: '储值',
  home: '官网',
  music: '音乐开关',
  language: '语言 : '
};

/*eslint-enable max-len*/
export function get (name) {
  'use strict';
  return ID[name];
}
