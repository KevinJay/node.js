node.js mvc framework
=====

### 此项目已不再更新，请知悉~

### 系统说明：
- 系统是用node.js(version:0.10.1) + express(version:3.1.1) + mysql(存储业务数据) + mongodb(存储日志记录) + redis(存储会话数据) 来搭建的。
- 运行之前所需环境：node.js、redis和mysql。其中，在node_modules目录下已经安装了redis和mysql的驱动，但是还需要安装相应的客户端软件。
- express已经安装在node_modules目录下，默认模板是使用的ejs。
- 所需环境配好后，请修改  '/config/sys.config.js' 文件里相应的配置信息。
- 系统中使用到的mysql表结构为：<br />
	create table `t_user` (<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`uid` double ,<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`userName` varchar (150),<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`pass` varchar (300),<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`pass_salt` varchar (150),<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`fullName` varchar (150),<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`roleID` double ,<br />
		&nbsp;&nbsp;&nbsp;&nbsp;`createdDate` datetime <br />
	); 
	

### @version 1.0
- encapsulate routing layer, controller layer, model layer, view layer ---> 封装路由，控制层（C），数据层（M），视图层（V）
	
### @version 2.0
- 路由分发的顺序是： 路由表规则  >  默认的URL拆分。 即先匹配路由表中的规则。所有的请求都走是app.all。路由表规则可以在“/mvc/routes/routes.map.js”文件中自由添加或删除。添加此功能的考虑是为了使URL更简短更好看，也利于SEO。
- 默认的URL拆分是取URL中path部分的最后两个路径，如"[http://localhost:3000/sasas/fasasdf/user/index](http://localhost:3000/sasas/fasasdf/user/index)"取user做控制器，index做action。 index也可以省略，默认的action即为indexAction。即"[http://localhost:3000/user/index](http://localhost:3000/user/index)"和 "[http://localhost:3000/user/](http://localhost:3000/user/)"和"[http://localhost:3000/sasas/fasasdf/user/index](http://localhost:3000/sasas/fasasdf/user/index)"会分发到同一控制器的同一个action里面。
- 控制器的分发顺序是: 钩子类控制器(hook)  >  普通控制器(controller)
- 日志记录模块的顺序是：mongodb > 文件日志 > 终端。  即先将日志记录到mongodb库里；若操作失败，再记录到日志文件里；若也操作失败，直接在终端打印出来。
- MODEl层是用类似于PHP中的PDO预处理形式来封装的。

### The problems in the development:
	1、静态文件（如CSS文件，图片文件等等）请求服务器时，也进入了路由分发控制里。
		解决方案：将“app.use(express.static(path.join(__dirname, 'public'))); ”放在“app.use(app.router); ”之前即可。
		解决方法很简单，却困扰了我两天。。
		
	2、MODEL层做压力测试时，并发100就失败了。
		解决方案：用 node-mysql 自带的连接池封装下 mysql连接对象 即可。
		
	3、 系统一段时间不进行任何操作，mysql连接对象自动断开，引发node.js终止运行。
		解决方案：用 mysql连接对象的事件监听来处理。 
		mysqlObject.on('error', function(error){
			if(error){
				这里调用初始化mysql连接对象代码，重新创建新的连接对象
			}
		}) 
		
	4、 EventEMitter的事件监听内存溢出。
		解决方案：用 emitter.setMaxListeners()  设置最大监听数
		
	5、 程序报：Can't set headers after they are sent  的错误
		解决方案：（这个解决方案是纯个人理解）
		问题是由于服务器给浏览器发送了响应数据后，又继续发送header头部数据引起的。在每次
		向浏览器发送数据时（res.render、res.redirect等等)，在前边加个 “return”,即“return res.redirect(...)”
		在一个function内，调用callback时，最好也 return 一次 ---> return callback(error, result);
		现在系统中，如果一段时间之后不进行任何操作，还是会报这个错误，但是又不影响系统运行。
		有外国朋友说这个是node core 的BUG。0.8的版本不会出现此问题(https://github.com/visionmedia/express/issues/751）。

### My opinion:
- node.js 的性能非常好，请求和响应速度都非常快，MODEL层应该封装成 ORM 框架能更好的体现出 node.js 的性能优势（系统中暂时是用的PDO形式）。
- 用 javascript 的面向对象来编写，更能节省系统资源开支和代码重用。
- 钩子类控制器（hook）用于处理特殊情况下的 action 	
