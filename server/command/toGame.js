(function() {
  var description = "說明";
  var fs = require('fs');
  var commandEvent = require('./commandEvent');
  var command = commandEvent.create(module.filename);
  var logger = commandEvent.logger;
  var gameConfig = require("./../data/gameConfig.js");

  exports.init = function(conf) {
    var user = conf.user;
    var net = conf.net;
    var cmd = {
      proc : function(data, fn){
        logger.info("recv : " + command.id);

        var RESULT = commandEvent.RESULT;
        var resultCode = RESULT.OK;
        var gameCmd = {};
        var game = null;

        if(data && data.gid){
          game = user.game[data.gid];
          if(data.packet.command === 'create') {
            game = null;
          }
  
          if(!game){
            var gameName = data.gid.split('.')[0];
            console.log('gameName : ' + gameName);
            var config = gameConfig.get(gameName);
            if(!config) {
              config = {
                id : gameName,
                appConfig: gameName,
                group : (user.mainGame && user.mainGame.group) || 'slot'
              }
            }

            var filename = "project/" + config.group + '/' + config.appConfig +"/test/data/game.json";
            console.log('filename:' + filename);
            var buf = null;
            if(fs.existsSync(filename)){
              buf = fs.readFileSync(filename, {encoding:'utf8'});
            }
            if(buf){
              game = user.game[data.gid] = {
                gid:data.gid,
                cmdIdx: 0,
                cmdList:JSON.parse(buf).cmdList
              };
            }
            else{
              logger.debug("no found game data ! gid : " + data.gid);
            }
          }
          if(game){
            if(game.cmdIdx >= game.cmdList.length){
              game.cmdIdx = 1;
            }

            gameCmd = game.cmdList[game.cmdIdx];
            logger.debug('gid: ' + data.gid + ' < ' + gameCmd.doc + ' command > ' + gameCmd.gameData.command);
//            logger.debug('data : ' + gameCmd.gameData.data);
            //--
            game.cmdIdx += 1;
          } else {
            resultCode = RESULT.ERROR;
            logger.debug('game data error ');
          }
        }
        else{
          resultCode = RESULT.ERROR;
          logger.debug('game data error ');
        }
        var package = {
          resultCode: resultCode,
          gid: data.gid,
          packet : gameCmd.gameData
        };
        if(fn) {
          setTimeout(function (){
            fn(package);
          }, 100);
          // setTimeout(function (){
          //   commandEvent.send(user.socket, command.id, package);
          // }, 2000);
        } else {
          setTimeout(function (){
            commandEvent.send(user.socket, command.id, package);
          }, 100);
        }
        
/*
        setTimeout(function (){
          // 廣播測試
          let json = {
            balance: 161192200
//            text: 'this account log in elsewhere'
          };
          //{\"json\":\"{\\\"balance\\\":161192200}\",\"proto\":\"updateBalance\"}
          let broadcast = {
//            proto:'disconnectMsg',
            proto: 'updateBalance',
            json: JSON.stringify(json)
          };
          let broadcastData = JSON.stringify(broadcast);
          commandEvent.send(user.socket, commandEvent.CMD.BROADCAST, broadcastData);
        }, 3000);
*/
      
      }
    };
    return cmd;
  };
  exports.id = command.id;
  exports.description = description;
}).call(this);
