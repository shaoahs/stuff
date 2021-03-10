(function() {
  var description = "說明";
  var commandEvent = require('./commandEvent');
  var command = commandEvent.create(module.filename);
  var logger = commandEvent.logger;

  exports.init = function(conf) {
    var user = conf.user;
    var cmd = {
      proc : function(data){
        logger.info("recv : " + command.id);
        console.log(data);
      }
    };
    return cmd;
  };
  exports.id = command.id;
  exports.description = description;
}).call(this);
