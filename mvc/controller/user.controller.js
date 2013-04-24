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
    this.res.render('register', {title:'欢迎您注册哦，亲', showMessage:''});
}

/**
 * 注册处理
 */
UserController.prototype.registerAction = function(){
    var req = this.req; var res = this.res; var CONFIG = this.CONFIG; var crypto = this.crypto;
    try{
        if(!req.body.submit) throw '数据提交非法';
        var username = req.body.username.trim();
        var password = req.body.password.trim();
        var pwdrepeat = req.body.pwdrepeat.trim();
        if(username == '' || password == '' || pwdrepeat == '' || username == undefined || password == undefined || pwdrepeat == undefined)
            throw '用户名或密码不能为空，请重新输入';
        if(password != pwdrepeat) throw '两次输入的密码不一致，请重新输入';

        var UserModel = require(CONFIG.MODEL_PATH + '/user.model.js');
        var UserModelObj = new UserModel();
        password = crypto.createHash('md5').update(password).digest('hex');
        UserModelObj.addUser({"userName":username, 'pass':password}, function(error, rows){
            if(error){
                console.log(error);
                res.render('register', {title:'欢迎您注册哦，亲',showMessage:'注册失败。'});
            }else if(rows){
                res.render('register', {title:'欢迎您注册哦，亲',showMessage:'恭喜您，注册成功'});
            }
        });
    }catch(e){
        res.render('register',{title:'欢迎您注册哦，亲', showMessage:e});
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
    var req = this.req; var res = this.res; var CONFIG = this.CONFIG; var crypto = this.crypto;
    if(req.body.submit){
        var username = req.body.username.trim(); var password = req.body.password.trim();
        if(username == '' || username == undefined){
            res.render('login',{title:'登录页面', showMessage:'用户名不能为空'});
        }else if(password == '' || password == undefined){
            res.render('login', {title:'登录页面', showMessage:'密码不能为空'});
        }else{
            var UserModel = require(CONFIG.MODEL_PATH + '/user.model.js');
            var UserModelObj = new UserModel();
            var searchFields = new Array('uid', 'userName', 'pass');
            password = crypto.createHash('md5').update(password).digest('hex');
            UserModelObj.getUserLists(searchFields, {'userName':username,'pass':password}, function(error, results){
                if(error){
                    res.render('login',{title:'登录页面', showMessage:e});
                }else if(results.constructor === Array){
                    var RedisCommon = require(CONFIG.LIB_PATH + '/class/redis.class.js');
                    var redisCommonObj = new RedisCommon();
                    redisCommonObj.set(results[0]['uid'], results[0]['userName'], 10, function(error,reply){
                        if(error || reply.toString() != 'OK'){
                            res.render('login', {title:'登录页面', showMessage:'内部服务器服务'});
                        }else{
                            res.render('login', {title:'登录页面', showMessage:'恭喜您，登录成功。'});
                        }
                    });
                }
            });
        }
    }else{
        res.render('login',{title:'登录页面', showMessage:'数据提交非法'});
    }
}
