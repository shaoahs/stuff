(function() {
  var description = "說明";
  var fs = require('fs');
  var commandEvent = require('./commandEvent');
  var command = commandEvent.create(module.filename);
  var logger = commandEvent.logger;
  var gameConfig = require("./../data/gameConfig.js");

  exports.init = function(conf) {
    var user = conf.user;
    var cmd = {
      proc : function(data, fn){
        logger.info("recv : " + command.id);
        logger.debug(data);
        var resultCode = commandEvent.RESULT.OK;
        var config = gameConfig.get(data.gid);
        if(!config) {
          config = {
            group: 'slot',
            appConfig: data.gid
          }
        }
        if(!config){
          resultCode = commandEvent.RESULT.ERROR;
          user.game = null;
          logger.debug("!!!! no found game config ! gid : " + data.gid);
        } else {
          user.game = {};
          var filename = "project/" + config.group + '/' + config.appConfig +"/test/data/game.json";
          logger.info('filename : ' + filename);
          var buf = null;
          if(fs.existsSync(filename)){
            buf = fs.readFileSync(filename, {encoding:'utf8'});
          } else {
          
          }
          if(buf){
            user.game[data.gid] = {
              id: config.id,
              group: config.group,
              gid:data.gid,
              cmdIdx: 0,
              cmdList:JSON.parse(buf).cmdList
            };
            if(!user.mainGame){
              user.mainGame = user.game[data.gid];
            }
          }
          else{
            logger.debug("no found game data ! gid : " + data.gid);
          }
        }
        //====================================
        //封包資料
        var package = {
          packet: null,
          gid:data.gid,
          resultCode:resultCode
        };
        //----
        if(fn) {
          fn(package);
        } else {
          commandEvent.send(user.socket, command.id, package);
        }
      }
    };
    return cmd;
  };
  exports.id = command.id;
  exports.description = description;
}).call(this);
