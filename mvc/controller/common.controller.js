/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-23
 * Time: 下午4:13
 * To change this template use File | Settings | File Templates.
 *      控制器基类
 *          主要用于引入一些公用的变量，函数等
 */
module.exports = CommonController;
function CommonController(){
}
CommonController.prototype.crypto = require('crypto');
CommonController.prototype.url = require('url');
CommonController.prototype.CONFIG = require('../config/sys.config.js');
CommonController.prototype.RedisCommon = require('../lib/class/redis.class.js');
CommonController.prototype.Mongodb = require('../lib/class/mongodb.class.js');
CommonController.prototype.customFunc = require('../lib/func/common.func.js');

/**
 * 解析URL
 * @param req
 * @param callback
 */
CommonController.prototype.parseURL = function(req,callback){
    urlArray = this.url.parse(req.url, true);
    //将pathname拆分为数组
    pathArray = urlArray.pathname.split('/');
    var HelperArray = require(this.CONFIG.LIB_PATH + '/Helper/HelperArray.js');
    pathArray = HelperArray.array_filter(pathArray);
    urlArray['pathArray'] = pathArray;
    return callback(urlArray);
}

/**
 * 根据sessionId和user-agent加密sessionId
 * @param sessionId
 * @param userAgent  访问者的user-agent
 * @param callback
 */
CommonController.prototype.encrySessionId = function(sessionId, userAgent,callback){
    var sessionIdStr = sessionId + '|' + this.crypto.createHash('md5').update(userAgent).digest('hex');
    var sessionId = this.crypto.createHash('md5').update(sessionIdStr).digest('base64');
    return callback(sessionId);
}

/**
 * 判断用户是否处于登录状态
 * @param sessionId
 * @param userAgent
 * @param callback
 */
CommonController.prototype.isLogin = function(sessionId, userAgent,callback){
    var res = this.res,
        CONFIG = this.CONFIG,
        RedisCommon = this.RedisCommon;
    this.encrySessionId(sessionId, userAgent, function(sessionId){
        var redisCommonObj = new RedisCommon();
        redisCommonObj.get(sessionId, function(error, reply){
            if(error){
                return res.redirect('/error');
            }else{
                return callback(error, reply);
            }
        });
    });
}

/**
 * 带提示信息的页面跳转。如果是直接跳转到某个页面，请直接用res.redirect
 * @param message  提示信息
 * @param title  跳转到的页面标题
 * @param returnURL  跳转的URL
 * @param times  定时跳转，默认为5秒，单位为秒
 */
CommonController.prototype.redirect = function(message, title, returnURL, times){
    var res = this.res;
    if(typeof times == 'undefined' || times == '' || !times) times = 3;
    res.render('redirect', {message:message, title:title, returnURL:returnURL, times:times});
}
