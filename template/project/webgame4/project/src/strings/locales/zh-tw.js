/*eslint-disable max-len*/
const ID = {
  opps: '糟糕',
  nickname: '暱稱',
  loading: '讀取中',
  connecting: '連線中',
  yes: '是',
  no: '否',
  my: '玩家',
  close: '關閉',
  window: '視窗',
  record: '紀錄',
  deposit: '儲值',
  home: '官網',
  music: '音樂開關',
  language: '語言 : '
};

/*eslint-enable max-len*/
export function get (name) {
  'use strict';
  return ID[name];
}
