/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-25
 * Time: 上午11:49
 * To change this template use File | Settings | File Templates.
 */

/**
 * 过滤数组中的空元素 （只对索引数组有效）
 * @param paramArray
 * @returns {*}
 */
exports.array_filter = function(paramArray){
    if(paramArray.constructor === Array){
        for(var key in paramArray){
            if(paramArray[key] == '' || paramArray[key] == undefined){
                paramArray.splice(key, 1);
            }
        }
    }
    return paramArray;
}