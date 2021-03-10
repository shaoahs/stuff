const path = require('path');
const Dat = require('dat-node');
const term = require('terminal-kit').terminal;
const discovery = require('dns-discovery');

let disc = discovery();

const isTest = false;

function createProgressBar(config) {
  let progressBar , progress = 0 ;
  let network = config.network;
  let isStop = false;
  let state = config.state;

  function doProgress(stop, title) {
    progress = network.uploadTotal / state.byteLength;
    if(isStop){
      return;
    }
    if(stop){
      progressBar.update(1);
      progressBar.stop();
      isStop = true;
    } else {
      if(title){
        if(network.uploadSpeed === 0){
          progressBar.update({
            progress:progress
          });
        } else {
          progressBar.update(progress);
        }
      } else {
        progressBar.update({
          progress:progress,
//        title:title
        });
      }
    }
  }

  progressBar = term.progressBar({
    width: 80 ,
    title: config.title || '[demo]',
    eta: true,
    inline: false,
    items: config.state.files,
    syncMode: true,
    percent: true
  });
  return doProgress;
}
function sendCommand(key, workspace, isFramework, done) {
  let clients = require('restify-clients');
  let domain = 'updateManager';
  if(workspace.framework && workspace.framework.upload){
    domain = workspace.framework.upload[0];
  }
  console.log('domain : ' + domain);
  function send(url) {
    let client = clients.createJsonClient({
      url: url
    });
  
    let isDepend = !!isFramework;
    let name = workspace.current;
    if(isFramework){
      name = 'framework';
    }
    client.post('/upload', {
      key: key,
      name: name,
      mode:workspace.mode,
      isDepend: isDepend
    },function (err/*, req, res, obj*/) {
      if(err){
        console.log(err);
      }
    });
  }
  disc.on('peer', function (name, peer) {
//    console.log(name, peer);
    if(domain === name){
      let url = 'http://' + peer.host + ':' + peer.port;
      send(url);
    }
  });
  disc.lookup(domain);
  
}

exports.create = function(workspace, isFramework, done) {
  let stats;
  let netTimerID = -1;
  let dirname;
  let ignore = [];
  let filenameList = [];

  let barConf = {
    title: workspace.current,
    state: null
  };
  // reset
  term.clear();



  if(isFramework){
    ignore = [
      '**/.directory',
      '**/Thumbs.db',
      'release/**',
      'test/**'
    ];
    barConf.title = '[framework]';
    dirname = '/../public';
  } else {
    dirname = '/../public/release/' + workspace.current;
  }

  let src = path.join(__dirname, dirname);
  console.log('src : ' + src);
  
  if(isTest){
    let key = Date.now().toString();
    sendCommand(key, workspace, isFramework, done);
    return;
  }

  Dat(src, {temp: true}, function (err, dat) {
    let doProgress = null;
    if (err) {
      throw err;
    }
    let opts = {
      upload: true, // announce and upload data to other peers
      download: true, // download data from other peers
      port: 3282,
      utp: true, // use utp in discovery swarm
      tcp: true // use tcp in discovery swarm
    };
    let network = dat.joinNetwork(opts);
    network.on('connection', function (/*connection, info*/) {
    });
    network.on('connection-closed', function(/*connection, info*/) {
  
      if(!barConf.state){
        return;
      }
      if(stats.network.uploadTotal >= barConf.state.byteLength){
        if(netTimerID >= 0){
          clearInterval(netTimerID);
          netTimerID = -1;
        }
        if(doProgress){
          doProgress(true);
        }
        term('\n');
        console.log('uploadTotal : ' + stats.network.uploadTotal);
        done();
      }
    });
    stats = dat.trackStats();
    console.log('upload : '+ dat.key.toString('hex') + '\n');
  
    function checkData(){
      if(netTimerID < 0){
        let str = 'waiting';
//        term.eraseLine();
        term.slowTyping(str, checkData);
        term.left(str.length);
      }
    }
    checkData();

    let progress = dat.importFiles(src, {
      count: true,
      ignore: ignore
    }, function (err) {
      if (err) {
        console.log(err);
        done();
        return;
      }
      let state = dat.stats.get();
      console.log(state);
      console.log('Done importing');
      console.log('Archive size:', dat.archive.content.byteLength);
      
      if(netTimerID >= 0){
        clearInterval(netTimerID);
        netTimerID = -1;
      }
      let key = dat.key.toString('hex');
      sendCommand(key, workspace, isFramework, done);
  
      term('\n');
      barConf.state = state;
      barConf.filenameList = filenameList;
      barConf.network = stats.network;

      // 顯示上傳狀態
      doProgress = createProgressBar(barConf);
      netTimerID = setInterval(function(){
        doProgress(false, '[speed: '+ stats.network.uploadSpeed + ']');
      }, 200);
    });
    
    progress.on('put', function (src, dest) {
      term("added %s\n" , dest.name);
      filenameList.push(dest.name);
    });
  });
};
