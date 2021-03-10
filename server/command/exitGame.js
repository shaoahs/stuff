(function() {
  var description = "說明";
  var commandEvent = require('./commandEvent');
  var command = commandEvent.create(module.filename);
  var logger = commandEvent.logger;
  var gameConfig = require("./../data/gameConfig.js");

  exports.init = function(conf) {
    var user = conf.user;
    var cmd = {
      proc : function(data){
        logger.info("recv : " + command.id);
        logger.debug(data);
        var resultCode = commandEvent.RESULT.OK;
        var config = gameConfig.get(data.gid);
        if(!config){
          resultCode = commandEvent.RESULT.ERROR;
        }
        //====================================
        //封包資料
        var package = {
          packet: null,
          gid:data.gid,
          resultCode:resultCode
        };
        //----
        commandEvent.send(user.socket, command.id, package);
      }
    };
    return cmd;
  };
  exports.id = command.id;
  exports.description = description;
}).call(this);
