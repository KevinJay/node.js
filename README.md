node.js mvc framework
=====

### @version 1.0
- encapsulate routing layer, controller layer, model layer, view layer ---> 封装路由，控制层（C），数据层（M），视图层（V）
	
### @version 2.0
- 路由分发的顺序是： 路由表规则  >  默认的URL拆分。 即先匹配路由表中的规则。所有的请求都走是app.all。
	路由表规则可以在“/mvc/routes/routes.map.js”文件中自由添加或删除。添加此功能的考虑是为了使URL更简短更好看，也利于SEO。
- 默认的URL拆分是取URL中path部分的最后两个路径，如"[http://localhost:3000/sasas/fasasdf/user/index](http://www.google.com)"取user做控制器，
	index做action。 index也可以省略，默认的action即为indexAction。即"http://localhost:3000/user/index"和
	 "http://localhost:3000/user/"和"http://localhost:3000/sasas/fasasdf/user/index"会分发到同一控制器的同一个action里面。
-