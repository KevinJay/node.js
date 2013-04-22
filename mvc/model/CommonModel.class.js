/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-22
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */
module.exports = CommonModel;
function CommonModel(){
    this.mysql = require('mysql');
    this.CONFIG = require('../config/config.js');
    this.configArray = '';
    this.db = '';//mysql数据库对象
//    this.connection = function(configArray){
//        console.log('configArray' + configArray);
//        this.configArray = (configArray == '') ? this.CONFIG.dbConfig : configArray;
//        try{
//            this.db = this.mysql.createConnection(this.configArray);
//            this.db.connect(function(error, results){
//                if(error) throw '连接mysql出错。参数：' + this.configArray;
//                this.db.query('SET NAMES UTF8');
//                return true;
//            });
//        }catch(e){
//            console.log(e);
//            return false;
//        }
//    }
}
//CommonModel.prototype.connection = function(configArray){
//    this.configArray = (configArray == '') ? this.CONFIG.dbConfig : configArray;
//    try{
//        this.db = this.mysql.createConnection(this.configArray);
//        this.db.connect(function(error, results){
//            if(error) throw '连接mysql出错。参数：' + this.configArray;
//            this.db.query('SET NAMES UTF8');
//            return true;
//        });
//    }catch(e){
//        console.log(e);
//        return false;
//    }
//}
CommonModel.prototype.insert = function(table, fields, values){
//    try{
//        console.log(this.db);
////        if(this.db){
////            throw '数据库对象获取失败';
////        }else{
////            throw '成功';
////        }
//
//    }catch(e){
//        console.log(e);
//    }
}


//var mysql = require('mysql');
//var connection = mysql.createConnection({
//    host:'localhost',
//    user:'root',
//    password:'admin',
//    database:'test'
//});
//connection.connect(function(error, results){
//    if(error){
//        console.log('connected mysql Error:'+error.message);
//        return false;
//    }
//    console.log('connected to Mysql');
//});
//var insertSql =  "insert into test (`username`) values (?)";
//// connection.query('SET NAMES UTF8');
//connection.query(insertSql, '中国人',  function(err, rows, fields){
//    if(err) throw err;
//    console.log('result:', rows);
//});
//connection.end();