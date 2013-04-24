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
RedisCommon.prototype.redis = require('redis');
//此处勿用 this.redis来创建redis客户端，因为这里的 this 指向了原型，并未指向 RedisCommon
RedisCommon.prototype.client = require('redis').createClient();
RedisCommon.prototype.expire = 20 * 60; //过期时间，默认为20分钟

/**
 * 连接redis
 * @param callback
 */
RedisCommon.prototype.connection = function(callback){
   try{
       this.client.on('error', function(error){
            if(error) throw '连接出错';
       });
   }catch(e){
       callback(e);
   }

}

/**
 * 封装redis的set方法
 * @param key 键名
 * @param value 值
 * @param expire  过期时间，默认为20分钟 （单位秒）
 * @param callback
 */
RedisCommon.prototype.set = function(key, value, expire, callback){
    var redis = this.redis, client = this.client;
    if(expire == '' || expire == undefined) expire = this.expire;
    this.connection(function(error){
        console.log('bbbb');
        if(error){
            console.log('error:' + error);
            return callback(error);
        }
    });
    client.on('connect', function(error){
        if(error){
            console.log('connect error');
        }else{
            client.set(key, value, function(error, reply){
                if(!error){
                    client.expire(key, expire);
                }
                callback(error, reply);
            });
        }
    });
}

/**
 * 封装redis的get方法
 * @param key 需要获取的值的键名
 * @param callback
 */
RedisCommon.prototype.get = function(key,callback){
    var redis = this.redis, client = this.client;
    this.connection(function(error){
        if(error){
            return callback(error, undefined);
        }else{
            client.get(key, function(error, reply){
                return callback(error,reply);
            });
        }
    });
}