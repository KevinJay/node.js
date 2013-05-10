/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-22
 * Time: 上午10:23
 * To change this template use File | Settings | File Templates.
 */
module.exports = UserController;
function UserController(req, res){
    this.req = req;
    this.res = res;
}

/**
 * 继承自CommonController
 * @type {*}
 */
var CommonController = require('./common.controller.js');
UserController.prototype = new CommonController();

/**
 * 用户注册
 */
UserController.prototype.indexAction = function(){
    var req = this.req,
        res = this.res,
        thisObj = this;
    this.isLogin(req.sessionID, req.headers['user-agent'], function(error, reply){
        if(error){
            return res.redirect('/error');
        }else if(typeof reply == 'undefined' || reply == '' || !reply){
            return res.render('register', {title:'欢迎您注册哦，亲', showMessage:''});
        }else{
            return thisObj.redirect('请先退出登录状态，再申请注册新账号', '首页', '/index', 3);
        }
    });

}

/**
 * 注册处理
 */
UserController.prototype.registerAction = function(){
    var req = this.req,
        res = this.res,
        CONFIG = this.CONFIG,
        crypto = this.crypto,
        thisObj = this;
    try{
        if(!req.body.submit) throw '数据提交非法';
        var username = req.body.username.trim();
        var password = req.body.password.trim();
        var pwdrepeat = req.body.pwdrepeat.trim();
        if(typeof username == 'undefined' || username == '' || !username)
            throw '用户名不能为空，请重新输入';
        if(typeof password == 'undefined' || password == '' || !password)
            throw '密码不能为空，请重新输入';
        if(typeof pwdrepeat == 'undefined' || pwdrepeat == '' || !pwdrepeat)
            throw '确认密码不能为空，请重新输入';
        if(password != pwdrepeat)
            throw '两次输入的密码不一致，请重新输入';

        var UserModel = require(CONFIG.MODEL_PATH + '/user.model.js');
        var UserModelObj = new UserModel();
        password = crypto.createHash('md5').update(password).digest('hex');
        UserModelObj.addUser({'userName':username, 'pass':password}, function(error, insertId){
            if(error){
                return res.render('register', {title:'欢迎您注册哦，亲',showMessage:'注册失败。'});
            }
            return thisObj.redirect('恭喜您，注册成功。', '登录页面',  '/user/login', 3);
        });
    }catch(e){
        return res.render('register',{title:'欢迎您注册哦，亲', showMessage:e});
    }
}

/**
 * 用户登录
 */
UserController.prototype.loginAction = function(){
    this.res.render('login',{title:'登录页面',showMessage:''});
}
/**
 * 登录处理
 */
UserController.prototype.doLoginAction = function(){
    var req = this.req,
        res = this.res,
        CONFIG = this.CONFIG,
        crypto = this.crypto,
        thisObj = this;
    if(typeof req.body.submit != 'undefined'){
        var username = req.body.username.trim(),
            password = req.body.password.trim();
        if(username == '' || typeof username == 'undefined' || !username)
            return res.render('login',{title:'登录页面', showMessage:'用户名不能为空'});
        if(password == '' || typeof password == 'undefined' || !password)
            return res.render('login', {title:'登录页面', showMessage:'密码不能为空'});
        var UserModel = require(CONFIG.MODEL_PATH + '/user.model.js');
        var UserModelObj = new UserModel();
        var searchFields = new Array('uid', 'userName', 'pass');
        password = crypto.createHash('md5').update(password).digest('hex');
        UserModelObj.getUserLists(searchFields, {'userName':username,'pass':password}, function(error, results){
            if(error)
                return res.render('login',{title:'登录页面', showMessage:'登录失败,请尝试重新登录。若一直未能成功登录，请联系网站管理员'});
            if(typeof(results) == 'undefined' || results == '' || !results)
                return res.render('login', {title:'登录页面', showMessage:'用户名或密码错误'});

            var redisCommonObj = new thisObj.RedisCommon();
            thisObj.encrySessionId(req.sessionID, req.headers['user-agent'],function(sessionId){
                redisCommonObj.set(sessionId, results[0]['uid'], undefined, function(error,reply){
                    if(error || reply.toString() != 'OK'){
                        return res.render('login', {title:'登录页面', showMessage:'登录失败,请尝试重新登录。若一直未能成功登录，请联系网站管理员'});
                    }
                    return res.redirect('/u/' + results[0]['uid']);
                    console.log('aaaa');
                });
            });
        });
    }else{
        return res.render('login',{title:'登录页面', showMessage:''});
    }
}

/**
 * 获取用户信息
 */
UserController.prototype.userInfoAction = function(){
    var req = this.req,
        res = this.res,
        CONFIG = this.CONFIG,
        thisObj = this;
    this.isLogin(req.sessionID, req.headers['user-agent'], function(error, reply){
        if(error)
            return res.redirect('/error');
        if(typeof  reply == 'undefined' || reply == '' || !reply)
            return thisObj.redirect('页面已失效，请重新登录', '登录页面', '/user/login', 3);
        thisObj.parseURL(req, function(urlArray){
            var mongodbObj = new thisObj.Mongodb(),
                currentTime = thisObj.customFunc.getNowFormatTime(),
                uid = reply,
                UserModel = require(CONFIG.MODEL_PATH + '/user.model.js'),
                UserModelObj = new UserModel();
            UserModelObj.getUserLists(undefined, {'uid':uid}, function(error, results){
                if(error)
                    return res.render('userInfo', {title:'拉取用户信息失败', userInfoArray:false});
                if(results == '' || typeof results == 'undefined' || !results){
                    //日志入mongodb库
                    var logJson = {
                        'log':'用户不存在', 'params':'uid:' + uid, 'code': null,
                        'fatal':null, 'message':null, 'create_time': currentTime
                    };
                    mongodbObj.insert('syslog', logJson, function(error, result){});
                    return res.render('userInfo', {title:'用户不存在', userInfoArray:false});
                }else{
                    return res.render('userInfo',{title:results[0]['userName'] + '，欢迎您，这里是您的主页', userInfoArray:results, a:urlArray.query.a});
                }
            });
        });
    });
}

/**
 * 用户列表（用作mysql的压力测试，所以没有做是否处于登录状态的验证）
 */
UserController.prototype.userListAction = function(){
    var req = this.req,
        res = this.res,
        CONFIG = this.CONFIG,
        UserModel = require(CONFIG.MODEL_PATH + '/user.model.js'),
        UserModelObj = new UserModel();
    UserModelObj.getUserLists(undefined, undefined, function(error, results){
        if(error){
            return res.render('userInfo', {title:'获取用户列表失败', userInfoArray:false});
        }else{
            return res.render('userInfo',{title:'用户列表', userInfoArray:results});
        }
    });
}

/**
 * 编辑用户信息
 */
UserController.prototype.editAction = function(){
    var req = this.req,
        res = this.res,
        CONFIG = this.CONFIG,
        thisObj = this;
    this.isLogin(req.sessionID, req.headers['user-agent'], function(error, reply){
        if(error)
            return res.redirect('/error');
        if(typeof  reply == 'undefined' || reply == '' || !reply )
            return thisObj.redirect('页面已失效，请重新登录', '登录页面', '/user/login', 3);
        var uid = reply,
            userName = req.body.username.trim(),
            fullName = req.body.fullName.trim(),
            UserModel = require(CONFIG.MODEL_PATH + '/user.model.js'),
            userModelObj = new UserModel(),
            updateArray = new Array(),
            whereCondition = new Array();
        updateArray['userName'] = userName,
        updateArray['fullName'] = fullName,
        whereCondition['uid'] = uid;
        userModelObj.updateUser(updateArray, whereCondition, function(error, affectedRows){
            if(affectedRows){
                return thisObj.redirect('修改个人信息成功', '个人主页', '/u/'+uid, 3);
            }else{
                return thisObj.redirect('修改个人信息失败', '个人主页', '/u/'+uid, 3);
            }
        });
    });
}

/**
 * 退出登录状态
 */
UserController.prototype.logoutAction = function(){
    var req = this.req,
        res = this.res,
        RedisCommon = this.RedisCommon,
        thisObj = this;
    this.encrySessionId(req.sessionID, req.headers['user-agent'], function(sessionId){
        var redisCommonObj = new RedisCommon();
        redisCommonObj.get(sessionId, function(error, reply){
            //查找不到此用户的sessionId值，说明已注销
            if(typeof(reply) == 'undefined' || reply == '' || !reply)
                return thisObj.redirect('注销登录状态成功', '首页', '/', 3);
            redisCommonObj.del(sessionId, function(error, reply){
                if(reply == 1){
                    return thisObj.redirect('注销登录状态成功', '首页', '/', 3);
                }else{
                    return thisObj.redirect('注销登录状态失败', '首页', '/', 3);
                }
            });
        });
    });
}

/**
 * 删除用户
 */
UserController.prototype.delUserAction = function(){
    var req = this.req,
        res = this.res,
        RedisCommon = this.RedisCommon,
        CONFIG = this.CONFIG,
        thisObj = this;
    this.encrySessionId(req.sessionID, req.headers['user-agent'], function(sessionId){
        var redisCommonObj = new RedisCommon();
        redisCommonObj.get(sessionId, function(error, reply){
            if(typeof(reply) == 'undefined' || reply == '' || !reply)
                return thisObj.redirect('页面已失效，请重新登录', '登录页面', '/user/login', 3);
            //删除用户表中的数据
            var UserModel = require(CONFIG.MODEL_PATH + '/user.model.js'),
                userModelObj = new UserModel(),
                whereCondition = new Array();
            whereCondition['uid'] = reply;
            userModelObj.delUser(whereCondition, function(error, affectedRows){
                if(affectedRows){
                    redisCommonObj.del(sessionId, function(error, reply){
                        if(typeof reply != 'undefined' && reply != ''){
                            return thisObj.redirect('删除用户资料成功', '首页', '/', 3);
                        }
                    });
                }

            });
        });
    });
}
