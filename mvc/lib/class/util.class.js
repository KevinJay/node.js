/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-9
 * Time: 下午4:45
 * To change this template use File | Settings | File Templates.
 */
module.exports = Util;
function Util(){

}

Util.prototype.fs = require('fs');
Util.prototype.CONFIG = require('../../config/sys.config.js');
Util.prototype.customeFunc = require('../func/common.func.js');

/**
 * 将日志信息写入文件中（当mongodb操作失败时）
 * @param filename  文件名
 * @param content   日志内容
 * @param callback
 */
Util.prototype.writeLog = function(filename, content, callback){
    var thisObj = this,
        filepath = this.CONFIG.LOG_PATH + '/' + filename + '-' + this.customeFunc.getCurrentDate() + '.log',
        temp = thisObj.customeFunc.getNowFormatTime() + "\t" + content + "\n",
        contentBuff = new Buffer(temp);
    this.fs.open(filepath, 'a+', function(error, fd){
        if(error){
            console.log('打开日志文件失败，文件路径：' + filepath + ',日志内容：' + content);
        }else{
            thisObj.fs.write(fd, contentBuff, 0, contentBuff.length, null, function(error, written){
                if(error){
                    console.log('写入日志文件失败，文件路径:' + filepath + '，日志内容：' + temp);
                }else{
                    console.log('写入日志成功');
                }
                thisObj.fs.close(fd);
                return callback(error, written);
            });
        }
    });
}