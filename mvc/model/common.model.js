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
 * 初始化连接池和引入相关文件
 * @param configArray
 *      eg: configArray = {'host':'127.0.0.1', 'user':'admin', 'password':'admin', 'database':'nojsTest'};
 * @param callback
 */
CommonModel.prototype.init = function(configArray){
    //初始化连接池
    var dbConfigArray = (configArray == '' || configArray == undefined) ? this.CONFIG.dbConfig : configArray;
    CommonModel.prototype.mysqlPool = this.mysql.createPool(dbConfigArray);
    //引用相关文件
    CommonModel.prototype.Mongodb = require(this.CONFIG.LIB_PATH + '/class/mongodb.class.js');
    CommonModel.prototype.customFunc = require(this.CONFIG.LIB_PATH + '/func/common.func.js');
}

/**
 * 创建mysql连接对象
 * @param callback
 */
CommonModel.prototype.connection = function(callback){
    var thisObj = this; Mongodb = require(this.CONFIG.LIB_PATH + '/class/mongodb.class.js'); thisObj = this;
    if(this.mysqlPool == '' || this.mysqlPool == undefined){
        this.init(this.configArray);
    }
    this.mysqlPool.getConnection(function(error, dbConn){
        if(error){
            var mongodbObj = new thisObj.Mongodb();
            var currentTime = thisObj.customFunc.getNowFormatTime();
            var logMessage = {
                'log':'连接MYSQL出错',  'params':'', 'message':error.message, 'code':error.code,
                'fatal':error.fatal, 'create_time':currentTime
            };
            mongodbObj.insert('syslog', logMessage, function(error, result){});
            return callback(error, dbConn);
        }else{
            dbConn.on('error', function(error){
                if(error){
                    //dbConn.setMaxListeners(0);
                    return thisObj.connection(callback);
                }
            });
            return callback(error, dbConn);
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
    var thisObj = this; currentTime = this.customFunc.getNowFormatTime();
    this.connection(function(error, db){
        if(error){
            return callback(error, db);
        }else{
            var fields = new Array(); var values = new Array(); var prepares = new Array();
            for(var key in params){
                fields.push("`"+key+"`"); prepares.push('?'); values.push(params[key]);
            }
            var insertSql = 'INSERT INTO ' + table + ' (' + fields + ')  VALUES (' + prepares + ')';
            db.query(insertSql, values, function(error, results){
                db.end();
                if(error){
                    var mongodbObj = new thisObj.Mongodb();
                    var logJson = {
                        'log':'数据入库失败，插入语句：' + insertSql,  'params':JSON.stringify(params),
                        'message':error.message, 'code':error.code, 'fatal':error.fatal, 'create_time':currentTime
                    };
                    mongodbObj.insert('syslog', logJson, function(error, result){});
                }
                return callback(error, results['insertId']);
            });
        }
    });
}

/**
 * 封装select操作
 * @param table 表名
 * @param searchFeilds  需要查询的字段名，默认为“*” (可以传字符串( 'userName,pass')、数组( new Array('userName', 'pass') )或空值)
 * @param whereCondition  查询条件，关联数组或空值
 * @param sort
 * @param start
 * @param limit
 * @param callback
 *      尚未实现 排序，分页的查询功能
 */
CommonModel.prototype.select = function(table, searchFeilds, whereCondition, callback){
    var thisObj = this;
    this.connection(function(error, db){
        if(error){
            return callback(error, db);
        }else{
            var fields = '',
                where = '',
                preparesValues = new Array();
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
            db.query(selectSql, preparesValues, function(error, results){
                db.end();
                if(error){
                    var mongodbObj = new thisObj.Mongodb();
                    var logJson = {
                        'log':'数据查询失败，查询语句：' + selectSql,
                        'params':'查询字段：' + JSON.stringify(searchFeilds) + ',查询条件：' + JSON.stringify(whereCondition),
                        'message':error.message, 'code':error.code,
                        'fatal':error.fatal, 'create_time':currentTime
                    };
                    mongodbObj.insert('syslog', logJson, function(error, result){});
                }
                return callback(error, results);
            });
        }
    });
}

/**
 * 封装update方法
 * @param table  表名
 * @param updateArray  更新的字段值，必须为关联数组
 * @param whereCondition 查询的条件数组，必须为关联数组
 * @param callback
 */
CommonModel.prototype.update = function(table, updateArray, whereCondition, callback){
    var thisObj = this;
    this.connection(function(error, db){
        if(error){
            return callback(error, db);
        }else{
            var updateStr = ''; //更新字符串
            for(var key in updateArray){
                updateStr += (typeof(updateStr) == 'undefined' || updateStr == '' || !updateStr) ?
                            key + '="' + updateArray[key] +'"' :
                            ', ' + key + '="' + updateArray[key] + '"';
            }
            var where = '';  whereValueArray = new Array();
            for(var key in whereCondition){
                where += (typeof(where) == 'undefined' || where == '' || !where) ? key + '= ? ' : ' AND ' + key + '= ? ';
                whereValueArray.push(whereCondition[key]);
            }
            var sql = 'UPDATE ' + table + ' SET ' + updateStr + ' WHERE ' + where ;
            db.query(sql, whereValueArray, function(error, results){
                db.end();
                if(error){
                    var mongodbObj = new thisObj.Mongodb();
                    var logJson = {
                        'log':'数据更新失败，更新语句：' + sql,
                        'params':'更新字段：' +JSON.stringify(updateArray) + ',更新条件：' + JSON.stringify(whereCondition),
                        'message':error.message, 'code':error.code,
                        'fatal':error.fatal, 'create_time':currentTime
                    };
                    mongodbObj.insert('syslog', logJson, function(error, result){});
                }
                return callback(error, results['affectedRows']);
            });
        }
    });
}

/**
 * 封装SQL 的 del方法
 * @param table  表名
 * @param whereCondition  删除条件字段，必须是关联数组
 * @param callback
 */
CommonModel.prototype.del = function(table, whereCondition, callback){
    this.connection(function(error, db){
        if(error){
            return callback(error, db);
        }else{
            var where = ''; whereValueArray = new Array();   console.log(whereCondition);
            for(var key in whereCondition){
                where += (typeof(wehre) == 'undefined' || where == '' || !where) ? key + '= ? ' : ' AND ' + key + '= ? ';
                whereValueArray.push(whereCondition[key]);
            }
            var sql = 'DELETE FROM  ' +  table + ' WHERE ' + where;
            db.query(sql, whereValueArray, function(error, results){
                if(error){
                    var mongodbObj = new thisObj.Mongodb();
                    var logJson = {
                        'log':'数据删除失败，删除语句：' + sql,
                        'params':'删除条件：' + JSON.stringify(whereCondition),
                        'message':error.message, 'code':error.code,
                        'fatal':error.fatal, 'create_time':currentTime
                    };
                    mongodbObj.insert('syslog', logJson, function(error, result){});
                }
                return callback(error, results['affectedRows']);
            });
        }
    });
}



