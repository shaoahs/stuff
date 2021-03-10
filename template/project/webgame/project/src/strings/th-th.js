/*eslint-disable max-len*/
const ID = {
  opps: 'Opps!',
  nickname: 'nickname',
  loading: 'loading',
  connecting: 'connecting',
  yes: 'Yes',
  no: 'No',
  my: 'my',
  close: 'Close',
  window: 'Window',
  record: 'record',
  deposit: 'deposit',
  home: 'home',
  music: 'music on/off',
  language: 'Language : '
};

/*eslint-enable max-len*/
export function get (name) {
  return ID[name];
}
