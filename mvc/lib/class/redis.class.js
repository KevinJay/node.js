/**
* Created with JetBrains WebStorm.
* User: kuangwenjie
* Date: 13-4-24
* Time: 下午3:04
* To change this template use File | Settings | File Templates.
*      redis 操作类
*/
module.exports = RedisCommon;
function RedisCommon(){

}

RedisCommon.prototype.CONFIG = require('../../config/sys.config.js');
RedisCommon.prototype.redis = require('redis');
RedisCommon.prototype.pool = require('generic-pool').Pool;
RedisCommon.prototype.pools = {};
RedisCommon.prototype.expire = 20 * 60; //过期时间，默认为20分钟
RedisCommon.prototype.Mongodb = require('./mongodb.class.js');
RedisCommon.prototype.customeFunc = require('../func/common.func.js');

/**
*   初始化redis 连接池
* @param database  连接池名称
* @param callback
*/
RedisCommon.prototype.initPool = function(database,callback){
    if(typeof(this.pools[database]) == 'undefined'){
        this.pools[database] = this.makePool(database);
    }
    this.pools[database].acquire(function(error, client){
        return callback(error, client);
    });
}

/**
*  将连接对象压入连接池里
* @param database  连接池名称
* @param client
*/
RedisCommon.prototype.release = function(database,client){
    if(this.pools[database]){
        this.pools[database].release(client);
    }
}

/**
*   创建池连接
* @param database  连接池名称
* @returns {*}
*/
RedisCommon.prototype.makePool = function(database){
    var CONFIG = this.CONFIG,
        redis = this.redis;
    return this.pool({
        name: database,
        create: function(callback){
            var client = redis.createClient(CONFIG.redisConfig.port, CONFIG.redisConfig.host, CONFIG.redisConfig.options);
            client.on('connect', function (error) {
                if(error){
                    return client.quit();
                }else{
                    client.send_anyway = true;
                    client.select(database);
                }
            });
            return callback(null, client);
        },
        destroy: function(client) {
            return client.quit();
        },
        max: 10,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        log: false
    });
}

/**
 * 监听错误
 * @param callback
 */
RedisCommon.prototype.monitorError = function(callback){
    var thisObj = this;
    this.initPool('redis', function(error, client){
        if(error){
            var mongodbObj = new thisObj.Mongodb();
            var logJson = {
                'log':'初始化redis连接对象失败', 'params':'', 'code':error.code,
                'fatal':error.fatal, 'message':error.message, 'create_time':thisObj.customeFunc.getNowFormatTime()
            };
            mongodbObj.insert('syslog', logJson, function(error, result){});
        }
        client.on('error', function(error){
            if(error){
                var mongodbObj = new thisObj.Mongodb();
                var logJson = {
                    'log':'redis连接对象出错', 'params':'', 'code':error.code,
                    'fatal':error.fatal, 'message':error.message, 'create_time':thisObj.customeFunc.getNowFormatTime()
                };
                mongodbObj.insert('syslog', logJson, function(error, result){});
                return client.quit();
            }
        });
        return callback(error, client);
    })
}

/**
* 封装redis 的 set 方法
* @param key  键名
* @param value   键值
* @param expire   过期时间，默认为20分钟
* @param callback
*/
RedisCommon.prototype.set = function(key, value, expire, callback){
    var thisObj = this;
    this.monitorError(function(error, client){
        if(typeof expire == 'undefined' || expire == '' || !expire) expire = thisObj.expire;
        client.set(key, value, function(error, reply){
            if(error){
                var mongodbObj = new thisObj.Mongodb();
                var logJson = {
                    'log':'redis set 失败', 'params':'', 'code':error.code,
                    'fatal':error.fatal, 'message':error.message, 'create_time':thisObj.customeFunc.getNowFormatTime()
                };
                mongodbObj.insert('syslog', logJson, function(error, result){});
            }else{
                client.expire(key, expire);
            }
            return callback(error, reply);
        });
    });
}

/**
* 封装redis的get方法
* @param key 键名
* @param callback
*/
RedisCommon.prototype.get = function(key, callback){
    var thisObj = this;
    this.monitorError(function(error, client){
        client.get(key, function(error, reply){
            if(error){
                var mongodbObj = new thisObj.Mongodb();
                var logJson = {
                    'log':'redis get 出错', 'params':'', 'code':error.code,
                    'fatal':error.fatal, 'message':error.message, 'create_time':thisObj.customeFunc.getNowFormatTime()
                };
                mongodbObj.insert('syslog', logJson, function(error, result){});
            }else{
                thisObj.release('redis',client);
            }
            return callback(error,reply);
        });
    });
}

/**
 * 封装redis的del方法
 * @param key 键名
 * @param callback
 */
RedisCommon.prototype.del = function(key, callback){
    this.monitorError(function(error, client){
        client.del(key, function(error, reply){
            if(error){
                var mongodbObj = new thisObj.Mongodb();
                var logJson = {
                    'log':'redis del 出错', 'params':'', 'code':error.code,
                    'fatal':error.fatal, 'message':error.message, 'create_time':thisObj.customeFunc.getNowFormatTime()
                };
                mongodbObj.insert('syslog', logJson, function(error, result){});
            }
            return callback(error, reply);
        });
    });
}



///**
// * 不用redis connection pool的版本
// * @type {Function}
// */
//module.exports = RedisCommon;
//function RedisCommon(){
//
//}
//RedisCommon.prototype.redis = require('redis');
////此处勿用 this.redis来创建redis客户端，因为这里的 this 指向了原型，并未指向 RedisCommon
//RedisCommon.prototype.client = require('redis').createClient();
//RedisCommon.prototype.expire = 20 * 60; //过期时间，默认为20分钟
//
///**
//* 连接redis
//* @param callback
//*/
//RedisCommon.prototype.connection = function(callback){
//    var pool = require('connection_pool'); console.log('pool:' + pool);
//    this.client.on('error', callback);
//}
//
///**
//* 封装redis的set方法
//* @param key 键名
//* @param value 值
//* @param expire  过期时间，默认为20分钟 （单位秒）
//* @param callback
//*/
//RedisCommon.prototype.set = function(key, value, expire, callback){
//    var redis = this.redis, client = this.client;
//    if(expire == '' || expire == undefined) expire = this.expire;
////    this.connection(function(error){
////        if(error){
////            console.log('error:' + error);
////            return callback(error);
////        }
////    });
//    client.on('connect', function(error){
//        if(error){
//            console.log('connect error');
//        }else{
//            console.log('connect success');
//        }
//    });
//    client.set(key, value, function(error, reply){
//        if(!error){
//            client.expire(key, expire);
//        }
//        return callback(error, reply);
//    });
//}
//
///**
//* 封装redis的get方法
//* @param key 需要获取的值的键名
//* @param callback
//*/
//RedisCommon.prototype.get = function(key,callback){
//    var redis = this.redis, client = this.client;
////    this.connection(function(error){
////        if(error){
////            return callback(error);
////        }
////    });
//    client.on('connect', function(error){
//        if(error){
//            console.log('connect error');
//        }else{
//            console.log('key:' + key);
//        }
//    });
//    client.get(key, function(error, reply){
//        return callback(error,reply);
//    });
//}
