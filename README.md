node.js mvc framework
=====

### @version 1.0
	encapsulate routing layer, controller layer, model layer, view layer
	封装路由，控制层（C），数据层（M），视图层（V）
	
### @version 2.0
- 路由分发的顺序是： 路由表规则  >  默认的URL拆分。 即先匹配路由表中的规则。所有的请求都走是app.all。
	路由表规则可以在“/mvc/routes/routes.map.js”文件中自由添加或删除。添加此功能的考虑是为了使URL更简短更好看，也利于SEO。
- bbb