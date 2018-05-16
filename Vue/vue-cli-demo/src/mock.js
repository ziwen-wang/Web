//参照mock文档
//配置mock路径

const Mock = require('mockjs')
//使用mockjs模拟数据
var obj = {'aa':'11', 'bb':'22', 'cc':'33', 'dd':'44'};
Mock.mock('/api/data', {
  'list|1-10':[{
    'name': '@cname',  // 中文名称
    'id|+1': 88,    // 属性值自动加 1，初始值为88
    'age|18-28': 0,   // 18至28以内随机整数, 0只是用来确定类型
    'birthday': '@date("yyyy-MM-dd")',  // 日期
    'city': '@city(true)',   // 中国城市
    'color': '@color',  // 16进制颜色
    'isMale|1': true,  // 布尔值
    'isFat|1-2': true,  // true的概率是1/3
    'fromObj|2': obj,  // 从obj对象中随机获取2个属性
    'fromObj2|1-3': obj,  // 从obj对象中随机获取1至3个属性
    'brother|1': ['jack', 'jim'], // 随机选取 1 个元素
    'sister|+1': ['jack', 'jim', 'lily'], // array中顺序选取元素作为结果
    'friends|2': ['jack', 'jim'] // 重复2次属性值生成一个新数组
   }]
})