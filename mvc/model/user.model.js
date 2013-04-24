/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-24
 * Time: 上午10:08
 * To change this template use File | Settings | File Templates.
 *
 */
module.exports = UserModel;
function UserModel(){

}
/**
 * 继承自基类MODEl ----> CommonModel
 * @type {*}
 */
var CommonModel = require('./common.model.js');
UserModel.prototype = new CommonModel;

/**
 * 重写数据库配置数组。也可以在 config/sys.config.js 文件中定义，在这里直接调用即可。
 * @type {{host: string, user: string, password: string, database: string}}
 */
//UserModel.prototype.configArray = {'host':'localhost', 'user':'root', 'password':'admin', 'database':'test'};
UserModel.prototype.table = 't_user'; //表名

/**
 * 添加用户
 * @param params
 * @param callback
 */
UserModel.prototype.addUser = function(params,callback){
    this.insert(this.table, params, callback);
}
UserModel.prototype.getUserLists = function(searchFields, whereCondition, callback){
   this.select(this.table, searchFields, whereCondition, callback);
}
