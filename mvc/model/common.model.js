/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-22
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 *      mysql数据库操作基类
 */
module.exports = CommonModel;
function CommonModel(){

}
CommonModel.prototype.CONFIG = require('../config/sys.config.js'); //引入系统配置文件，子类可直接调用
CommonModel.prototype.mysql = require('mysql');
/**
 * 连接数据库的配置数组
 *      说明：默认情况下，程序连接数据库根据"../config/sys.config.js"文件中的“dbConfigArray”的配置来连接的。
 *            如果还需要连接其他的mysql数据库，可在子类MODEL中重写此属性即可。
 *            具体请参考"./user.model.js"中的“UserModel.prototype.configArray...”
 * @type {string}
 */
CommonModel.prototype.configArray = '';

/**
 * 连接mysql数据库
 * @param configArray
 *      eg: configArray = {'host':'192.168.12.216', 'user':'root', 'password':'r1234567', 'database':'nojsTest'};
 * @param callback
 */
CommonModel.prototype.connection = function(configArray, callback){
    var dbConfigArray = (configArray == '' || configArray == undefined) ? this.CONFIG.dbConfig : configArray;
    var db = this.mysql.createConnection(dbConfigArray);
    db.connect(function(error){
        if(error) {
            //日志信息入库
            console.log('连接MYSQL出错，参数：' + dbConfigArray);
            return callback(error,db);
        }else{
            db.query('SET NAMES UTF8');
            console.log('连接mysql成功');
            return callback(error,db);
        }
    });
}

/**
 * 封装 insert 操作
 * @param table 表名
 * @param params  需要插入的参数数组（必须是关联数组）
 * @param callback
 */
CommonModel.prototype.insert = function(table, params, callback){
    this.connection(this.configArray,function(error, db){
        var rows = 0;
        if(error){
            return callback(error, rows);
        }else{
            var fields = new Array(); var values = new Array(); var prepares = new Array();
            for(var key in params){
                fields.push("`"+key+"`"); prepares.push('?'); values.push(params[key]);
            }
            var insertSql = 'INSERT INTO ' + table + ' (' + fields + ')  VALUES (' + prepares + ')';
            db.query(insertSql, values, function(error, rows){
                return callback(error, rows);
            });
        }
    });
}

/**
 * 封装select操作
 * @param table 表名
 * @param searchFeilds  需要查询的字段名，默认为“*”
 * @param whereCondition  查询条件，可以传字符串( 'userName,pass')、数组( new Array('userName', 'pass') )或空值
 * @param sort
 * @param start
 * @param limit
 * @param callback
 *      尚未实现 排序，分页的查询功能
 *      及链接断开的BUG
 */
CommonModel.prototype.select = function(table, searchFeilds, whereCondition, callback){
    this.connection(this.configArray, function(error, db){
        if(error){
            return callback(error, undefined);
        }else{
            var fields = ''; var where = ''; var preparesValues = new Array();
            if(searchFeilds == '' || searchFeilds == undefined){
                fields = '*';
            }else if(searchFeilds.constructor === Array){
                for(var i=0 in searchFeilds){
                    fields += (fields == '' || fields == undefined) ? searchFeilds[i] : ',' + searchFeilds[i];
                }
            }else{
                fields = searchFeilds;
            }
            if(whereCondition == '' || whereCondition == undefined){
                where = ' 1=1 ';
            }else{
                for(var key in whereCondition){
                    where += (where == '' || where == undefined) ? (key + '=' + '?') : (' AND ' + key + '=' + '?');
                    preparesValues.push(whereCondition[key]);
                }
            }
            var selectSql = 'SELECT ' + fields + ' FROM ' + table + ' WHERE ' + where;
           // console.log(selectSql);
            db.query(selectSql, preparesValues, function(error, results){
                return callback(error, results);
            });
        }
    });
}

