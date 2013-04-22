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
    this.crypto = require('crypto');
    this.CONFIG = require('../config/config.js');
    this.md5 = this.crypto.createHash('md5');
}

/**
 * 注册处理
 */
UserController.prototype.registerAction = function(){
    try{
        if(!this.req.body.submit){
            throw '数据提交非法';
        }
        var username = this.req.body.username.trim();
        var password = this.req.body.password.trim();
        var pwdrepeat = this.req.body.pwdrepeat.trim();
        if(username == '' || password == '' || pwdrepeat == ''){
            throw '用户名或密码不能为空';
        }
        if(password != pwdrepeat){
            throw '两次输入的密码不一致';
        }

        var CommonModel = require(this.CONFIG.MODEL_PATH + '/CommonModel.class.js');
        var CommonModelObj = new CommonModel();
        console.log(CommonModelObj);


    }catch(e){
        console.log(e);
    }

}
