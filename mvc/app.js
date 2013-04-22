
/**
 * Module dependencies.
 *  系统入口
 */

var express = require('express')
  , routes = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);  //必须入在express指定静态文件路径的后面，否则所有的静态文件会进行路由分发
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//路由入口
app.all('/*',routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
