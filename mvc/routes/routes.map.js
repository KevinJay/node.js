/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-25
 * Time: 上午10:16
 * To change this template use File | Settings | File Templates.
 */
module.exports = [{
    url:/^\/u\/(?:([^\/]+?))\/?$/i,
    //hook:'test',   //特殊控制器
    controller:'user',
    action:'userInfo'
},
{
    url:'bbbb'
}
];

