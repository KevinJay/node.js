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
CommonController.prototype.CONFIG = require('../config/sys.config.js');