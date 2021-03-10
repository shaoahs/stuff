(function() {
  var fs = require('fs');
  var description = "說明";
  //----
  var roomID = "asdf";
  var tableList = [
  ];
  var tableMap = {
  };
  var currentDate = "0000";
  var tableIndex = 0;

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
  
  exports.enter = function(id){
    var room = {
      id : id,
      tableID : -1,
      tableMap : tableMap
    };
    return room
  };
  /**
   * 建立遊戲桌
   * @param info {Object} 遊戲桌資訊
   * @param user {Object} 使用者資訊
   */
  exports.createTable = function(info, user){
    // 座位資訊
    var seatList = [];
    for(var i = 0; i<info.config.maxUsers; i++){
      seatList[i] = null;
    }
    var seatID = info.seatID;
    seatList[seatID] = {
      nickname : user.nickname,
      coin : user.coin
    };
    //  桌資訊
    var table = {
      id : getCurrentDate() + '.' + tableIndex,
      name : info.name,
      config : info.config,
      seatList : seatList
    };
    tableMap[table.id] = table;
    //--
    tableIndex += 1;
    return table;
  };
  /**
   * 找尋遊戲桌
   */
  exports.findTable = function(id){
    var table = null;
    if(tableMap.hasOwnProperty(id)){
      table = tableMap[id];
    }
    return table;
  };
  /**
   * 取得遊戲桌
   */
  exports.getTable = function(startIndex, counts){
    var names = Object.getOwnPropertyNames(tableMap);
    var tableList = [];
    var end = startIndex + counts;
    if (end > names.length) {
      end = names.length;
    }
    names = names.slice(startIndex, end);
    names.forEach(function(name){
      tableList.push(tableMap[name]);
    });
    return tableList;
  };
  
  exports.description = description;
}).call(this);
