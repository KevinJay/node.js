/**
 * 系统配置文件
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-19
 * Time: 下午2:29
 * To change this template use File | Settings | File Templates.
 *      系统配置文件
 */
var currentDir = __dirname.replace(/\\/g, '/');
var lastIndex = currentDir.lastIndexOf('/');
exports.ROOT_PATH = currentDir.slice(0, lastIndex);
exports.dbConfig = {'host':'192.168.12.216', 'user':'root', 'password':'r1234567', 'database':'nojsTest'};
exports.MODEL_PATH =  this.ROOT_PATH + '/model/';
exports.LIB_PATH = this.ROOT_PATH + '/lib/';
