/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-5-10
 * Time: 下午2:29
 * To change this template use File | Settings | File Templates.
 */
module.exports = TestHook;
function TestHook(req, res){
    this.req = req;
    this.res = res;
}

TestHook.prototype.userInfoAction = function(){
    this.res.render('hook/index', {title:'这里是钩子类控制器'});
}
