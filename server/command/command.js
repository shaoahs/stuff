(function() {
  var description = "命令列清單列表";
  //----
  var commandList = [
    require("./login.js"),
    require("./inGame.js"),
    require("./toGame.js"),
    require("./exitGame.js"),
    require("./ping.js"),
    require("./pong.js"),
    require("./reconnect.js"),
    require("./disconnect.js")
    // require("./broadcast.js")
  ];
  exports.list = commandList;
  
  exports.description = description;
}).call(this);
