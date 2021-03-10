(function() {
  var fs = require('fs');
  var description = "說明";
  //----
  var userList = {};

  function getCurrentDate() {
    var now = new Date();
    var num;
    var str = now.getFullYear().toString();
    num = now.getMonth() + 1;
    if(num >= 10) {
      str += num.toString();
    }
    else{
      str += '0' + num.toString();
    }
    num = now.getDate();
    if(num >= 10) {
      str += num.toString();
    }
    else{
      str += '0' + num.toString();
    }
    if (currentDate != str) {
      currentDate = str;
      tableIndex = 0;
    }
    return str;
  }
  
  /**
   * 建立使用者
   * @param user {Object} 使用者資訊
   */
  exports.create = function(user){
    userList[user.nickname] = user;
  };
  /**
   * 找尋使用者
   * @param nickname {String} 暱稱
   */
  exports.find = function(nickname){
    var user = null;
    if(userList.hasOwnProperty(nickname)){
      table = userList[nickname];
    }
    return user;
  };
  /**
   * 移除使用者
   */
  exports.remove = function(user){
    delete userList[user.nickname];
  };

  //--------------------------------------------  
  
  exports.description = description;
}).call(this);
