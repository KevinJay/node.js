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
IndexController.prototype.indexAction = function(){
    this.res.render('index', {title:'aaaaaaaaa'});
}

