/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-9
 * Time: 上午9:52
 * To change this template use File | Settings | File Templates.
 */
/**
 * 获取当前时间 格式：YYYY-MM-dd HH:mm:ss
 * @returns {string}
 */
exports.getNowFormatTime = function () {
    var date = new Date(); seperator1 = "-"; seperator2 = ":"; month = date.getMonth() + 1;
    var strDate = date.getDate(); hour = date.getHours(); minute = date.getMinutes(); second = date.getSeconds();
    var tempArray = new Array(month, strDate, hour, minute, second);
    for(var key in tempArray){
        if(key >= 2){
            if(tempArray[key] >=0 && tempArray[key] <= 9)
                tempArray[key] = '0' + tempArray[key];
        }else{
            if(tempArray[key] >= 1 && tempArray[key] <= 9)
                tempArray[key] = '0' + tempArray[key];
        }
    }
    var currentdate = date.getFullYear() + seperator1 + tempArray[0] + seperator1 + tempArray[1]
        + " " + tempArray[2] + seperator2 + tempArray[3] + seperator2 + tempArray[4];
    return currentdate;
}

/**
 * 获取当前日期   格式：YYYY-MM-dd
 * @returns {number}
 */
exports.getCurrentDate = function(){
    var date = new Date(); seperator1 = "-"; seperator2 = ":"; month = date.getMonth() + 1;
    var strDate = date.getDate();
    var tempArray = new Array(month, strDate);
    for(var key in tempArray){
        if(tempArray[key] >= 1 && tempArray[key] <= 9)
            tempArray[key] = '0' + tempArray[key];
    }
    var currentdate = date.getFullYear() + seperator1 + tempArray[0] + seperator1 + tempArray[1];
    return currentdate;
}