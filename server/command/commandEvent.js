(function() {
  var description = "建立命令用";
  var path = require('path');
  var id = require("./id.js");
  var RESULT = id.RESULT;
  var CMD = id.CMD;
  var logger = id.logger;
  /**
   * 建立命令
   */
  exports.create = function(moduleFilename){
    var command = {
      id : id.filenameToCommand(path.basename(moduleFilename))
    };
    logger.debug("loading : " + command.id);
    return command;
  };
  /**
   * 傳送資料
   */
  exports.send = function(socket, cmdID, packages){
    // 顯示封包資料
    logger.info("send command : " + cmdID);
//    console.log(JSON.stringify(packages));
    //傳送資料
    socket.compress(true).emit(cmdID, packages);
  };
  //----
  exports.logger = logger;
  exports.CMD = CMD;
  exports.RESULT = RESULT;
  exports.description = description;
}).call(this);
