/**
 * 路由分发
 * @type {*}
 */
var url = require('url');
var CONFIG = require('../config/sys.config.js');
var fs = require('fs');
var routesMap = require('./routes.map.js');
var Mongodb = require(CONFIG.LIB_PATH + '/class/mongodb.class.js');
var customFunc = require(CONFIG.LIB_PATH + '/func/common.func.js');
exports.index = function(req,res){
    var currentURL = req.url;
    var urlStr = url.parse(currentURL).pathname;
    urlStr = urlStr.replace(/\/+/g, '/');  //过滤过URL中多余的“/”
    urlStr = urlStr.replace(/\/+$/g, ''); //过滤URL最右边多余的“/”
    if(urlStr == '/' || urlStr == '')  urlStr = '/index';
    var lastIndex = urlStr.lastIndexOf('/');
    var hook = controller = actionName = '';
    if(lastIndex == 0){ //如果URL中只有controller的情况
        hook = CONFIG.ROOT_PATH + '/hook' + urlStr + '.hook.js';
        controller = CONFIG.ROOT_PATH + '/controller' + urlStr + '.controller.js';
        actionName = 'indexAction';
    }else{ //URL中即有controller也有action的情况
        var urlStrArray = urlStr.split('/');
        hook = CONFIG.ROOT_PATH + '/hook/' + urlStrArray[urlStrArray.length-2] + '.hook.js';
        controller = CONFIG.ROOT_PATH + '/controller/' + urlStrArray[urlStrArray.length-2] + '.controller.js';
        actionName = urlStrArray[urlStrArray.length-1] + 'Action';
    }
    for(var i in routesMap){
        if(urlStr.match(routesMap[i]['url'])){
            hook =  CONFIG.ROOT_PATH + '/hook/' + routesMap[i]['hook'] + '.hook.js';
            controller = CONFIG.ROOT_PATH + '/controller/' + routesMap[i]['controller'] + '.controller.js';
            actionName = (routesMap[i]['action'] == '' || routesMap[i]['action'] == undefined) ? indexAction : routesMap[i]['action'] + 'Action';
        }
    }
    routerDispatcher(hook,controller, actionName,req, res);
}
var routerDispatcher = function(hook, controller, actionName, req, res){
    try{
        if(!fs.existsSync(controller) && !fs.existsSync(hook)){ //fs.existsSync是同步
            throw '控制器不存在。controller:' + controller + ', hook:' + hook;
        }else if(fs.existsSync(hook)){
            var hookController = require(hook);
            var hookCtlObj = new hookController(req, res);
            if(typeof hookCtlObj[actionName] != 'function'){
                throw 'action不存在。actionName:' + actionName + ',controller:' + controller + ',hook:' + hook;
            }else{
                hookCtlObj[actionName]();
            }
        }else if(fs.existsSync(controller)){
            var ctl = require(controller);
            var ctlObj = new ctl(req, res);
            if(typeof(ctlObj[actionName]) != 'function'){
                throw 'action不存在。actionName:' + actionName;
            }else{
                ctlObj[actionName]();
            }
        }else{
            throw '未知错误';
        }
    }catch(e){
        var mongodbObj = new Mongodb(),
            logJson = {
                'log':'路由分发失败,' + e,
                'params':'',
                'message':'', 'code':'',
                'fatal':'', 'create_time':customFunc.getNowFormatTime()
            };
        mongodbObj.insert('syslog', logJson, function(error, result){});

        errorController = CONFIG.ROOT_PATH + '/controller/error.controller.js';
        var ErrorCustomer = require(errorController);
        var errorObj  = new ErrorCustomer(req,res);
        errorObj.page404();
    }
}


//this 是公有的， var 是私有的


