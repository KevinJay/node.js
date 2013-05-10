/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-19
 * Time: 下午4:22
 * To change this template use File | Settings | File Templates.
 */
module.exports =  IndexController;
function IndexController(req, res){
    this.req = req;
    this.res = res;
}

/**
 * 继承自基类控制器
 * @type {*}
 */
var CommonController = require('./common.controller.js');
IndexController.prototype = new CommonController();

/**
 * 首页 action
 */
IndexController.prototype.indexAction = function(){
    var req = this.req,
        res = this.res;
    this.isLogin(req.sessionID, req.headers['user-agent'], function(error, reply){
        if(error){
            res.render('index', {title:'内部服务器错误', isLogin:false, uid:false});
        }else if(reply == '' || reply == undefined){
            res.render('index', {title:'请登录', isLogin:false, uid:false});
        }else{
            res.render('index', {title:'已登录', isLogin:true, uid:reply});
        }
    });
}

