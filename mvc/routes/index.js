 /*
 * 路由分发
 *     尚未实现将日志记录插入到mongodb的功能
 */
var url = require('url');
var CONFIG = require('../config/sys.config.js');
var fs = require('fs');
exports.index = function(req,res){
    var currentURL = req.url;
    var urlStr = url.parse(currentURL).pathname;
    urlStr = urlStr.replace(/\/+/g, '/');  //过滤过URL中多余的“/”
    urlStr = urlStr.replace(/\/+$/g, ''); //过滤URL最右边多余的“/”
    if(urlStr == '/' || urlStr == '')  urlStr = '/index';
    var lastIndex = urlStr.lastIndexOf('/');
    var controller = actionName = '';
    if(lastIndex == 0){ //如果URL中只有controller的情况
        controller =    CONFIG.ROOT_PATH + '/controller' + urlStr + '.controller.js';
        actionName = 'indexAction';
    }else{ //URL中即有controller也有action的情况
        var urlStrArray = urlStr.split('/');
        controller = CONFIG.ROOT_PATH + '/controller/' + urlStrArray[urlStrArray.length-2] + '.controller.js';
        actionName = urlStrArray[urlStrArray.length-1] + 'Action';
    }
    try{
        if(!fs.existsSync(controller)){ //fs.existsSync是同步
            throw '控制器不存在。controller:' + controller;
        }else{
            var ctl = require(controller);
            var ctlObj = new ctl(req, res);
            if(typeof(ctlObj[actionName]) != 'function'){
                throw 'action不存在。actionName:' + actionName;
            }else{
                ctlObj[actionName]();
            }
        }
    }catch(e){
        console.log(e);
        //异常信息入日志库
        errorController = CONFIG.ROOT_PATH + '/controller/error.controller.js';
        var ErrorCustomer = require(errorController);
        var errorObj  = new ErrorCustomer(req,res);
        errorObj.page404();
    }
}


//this 是公有的， var 是私有的


