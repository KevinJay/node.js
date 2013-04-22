/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-22
 * Time: 上午9:46
 * To change this template use File | Settings | File Templates.
 */
module.exports = ErrorController;
function ErrorController(req, res){
    this.req = req;
    this.res = res;
}
/**
 * 404页面
 */
ErrorController.prototype.page404 = function(){
    this.res.render('error', {title:'404，页面不存在'});
}

