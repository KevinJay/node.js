/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-8
 * Time: 下午3:24
 * To change this template use File | Settings | File Templates.
 */
module.exports = Mongodb;
function Mongodb(){

}
Mongodb.prototype.mongodb = require('mongodb');
Mongodb.prototype.CONFIG = require('../../config/sys.config.js');
Mongodb.prototype.Util = require('./util.class.js');

/**
 * 初始化mongodb连接对象
 * @param callback
 */
Mongodb.prototype.init = function(callback){
    var CONFIG = this.CONFIG,
        host = CONFIG.mongodbConfig.host,
        port = CONFIG.mongodbConfig.port,
        options = CONFIG.mongodbConfig.options,
        database = CONFIG.mongodbConfig.database,
        thisObj = this;
    port = (typeof port == 'undefined' || port == '' || !port) ? '27017' : port;
    Mongodb.prototype.server = new this.mongodb.Server(host, port, options);
    Mongodb.prototype.db = new this.mongodb.Db(database, this.server);
    this.db.open(function(error, db){
        if(error){
            var utilObj = new thisObj.Util();
            utilObj.writeLog('mongodb', '初始化mongodb连接对象失败,' + error, function(error, result){});
        }
        return callback(error, db);
    });
}

/**
 * 封装mongodb的insert方法
 * @param collection  集合，相当于关系型数据库中的表
 * @param logJson  日志内容，JSON格式
 * @param callback
 */
Mongodb.prototype.insert = function(collection, logJson, callback){
    var thisObj = this;
    this.init(function(error, db){
        if(error){
            var utilObj = new thisObj.Util();
            utilObj.writeLog('mongodb', '日志入库失败，日志内容：' + JSON.stringify(logJson) + ',错误信息：' + error, function(error, result){});
        }else{
            db.collection(collection, function(error, collection){
                if(error){
                    var utilObj = new thisObj.Util();
                    utilObj.writeLog('mongodb', '选择集合' + collection + '失败，错误信息：' + error, function(error, result){});
                }else{
                    collection.insert(logJson, {safe:true}, function(error, result){
                        if(error){
                            var utilObj = new thisObj.Util();
                            utilObj.writeLog('mongodb', '插入数据失败：' + error, function(error, result){});
                        }
                        return callback(error, result);
                    });
                }
            });
        }
    });
}