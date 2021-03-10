(function() {
  var description = "登入用";
  var commandEvent = require('./commandEvent');
  var command = commandEvent.create(module.filename);
  var logger = commandEvent.logger;

  exports.init = function(conf) {
    var user = conf.user;
    var cmd = {
      proc : function(data, fn) {
        logger.info("recv : " + command.id);
        var resultCode = commandEvent.RESULT.OK;
        if(!data.token) {
          resultCode = commandEvent.RESULT.ERROR;
        }
        else {
          user.token = parseInt(Math.random()*100000000).toString();
          //--
          user.id = parseInt(Math.random()*10000).toString() + '.' + parseInt(Math.random()*10000).toString();
          user.nickname = "暱稱 " + parseInt(Math.random()*10000).toString();
          user.coin = 10000 + parseInt(Math.random()*10000) * 100;
          user.round = 0;
        }
        //====================================
        //封包資料
        var package = {
          userInfo: {
            nickname: user.nickname,
            coin: user.coin
          },
          resultCode:resultCode,
          token:user.token
        };
        //----
        if(fn) {
          setTimeout(function () {
            logger.info("send " + command.id);
            fn(package);
          }, 1000);
        } else {
          setTimeout(function (){
            commandEvent.send(user.socket, command.id, package);
          }, 100);
        }

        //
        // 廣播測試
        // setTimeout(function (){
        //   var json = {
        //     text: 'this account log in elsewhere'
        //   };
          
        //   var broadcast = {
        //     proto:'disconnectMsg',
        //     json: JSON.stringify(json)
        //   };
        //   var broadcastData = JSON.stringify(broadcast);
        //   commandEvent.send(user.socket, commandEvent.CMD.BROADCAST, broadcastData);
        // }, 2000);
      }
    };
    return cmd;
  };
  exports.id = command.id;
  exports.description = description;
}).call(this);
