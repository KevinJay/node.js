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
/**
 * 网站根目录
 * @type {string}
 */
exports.ROOT_PATH = currentDir.slice(0, lastIndex);

/**
 * mysql库配置
 * @type {{host: string, user: string, password: string, database: string, charset: string}}
 */
exports.dbConfig = {
    'host':'192.168.12.216',
    'user':'root',
    'password':'r1234567',
    'database':'nojsTest',
    'charset':'utf8'
};

/**
 * redis库配置
 * @type {{port: string, host: string, options: {connect_timeout: string}}}
 */
exports.redisConfig = {
    'port':'6379',
    'host':'127.0.0.1',
    'options':{
        'connect_timeout':'5000'
    }
};

/**
 * mongodb库配置
 * @type {{host: string, port: string, options: {auto_reconnect: boolean, poolSize: number}, database: string}}
 */
exports.mongodbConfig = {
    'host':'127.0.0.1',
    'port':'27017',
    'options':{
        'auto_reconnect': true,
        'poolSize':10
    },
    'database':'nodeLog'
};

/**
 * MODEL文件夹路径
 * @type {string}
 */
exports.MODEL_PATH =  this.ROOT_PATH + '/model/';

/**
 * lib文件夹路径
 * @type {string}
 */
exports.LIB_PATH = this.ROOT_PATH + '/lib/';

/**
 * log文件夹路径
 * @type {string}
 */
exports.LOG_PATH = this.ROOT_PATH + '/log/';


