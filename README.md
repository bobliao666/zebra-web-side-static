# zebra-web-side-static
a kind of javascript lib just like jquery


//zTool.Core - alpha 1.1.4 - Beta 1.1.0 
//廖力编写@2012-12-27 ~ 2013-12-18
//DOM集成对象操作器
//-----------------------------------------

/*
------------------------------------代码大纲------------------------------------
一.基本功能：
1.zTool核心/基本/选择器
2.HTML对象操作
3.HTML属性操作
4.HTML事件操作

二.富功能：
1.动画操作
2.ajax通讯
3.辅助工具
:2013-06-10
--------------------------------------------------------------------------------
【zTool.Core】
向使用者说明如何剔除/组合这些代码：
除去“基本功能”的“zTool核心/基本/选择器”这一块无论如何不可剔除之外，
其他的模块都可以由一些方式自由组合/剔除/或者修改。
依赖关系如下：
一.基本功能：
1.zTool核心/基本/选择器
↑ 【2.HTML对象操作】必须依赖【1.zTool核心/基本/选择器】
2.HTML对象操作
↑ 【3.HTML属性操作】必须依赖【2.HTML对象操作】
3.HTML属性操作
↑ 【 4.HTML事件操作】必须依赖【3.HTML属性操作】
4.HTML事件操作

以上为“基本功能”内模块之间的依赖关系，如果打破上文所示的依赖关系，笔者
未在这种情况下做过严格测试，如果您打算这么做，笔者认为容易出现一些问题。
富功能中的依赖关系如下图：

【基本功能】
↑         ↑          ↑
1.动画操作  2.ajax通讯  3.辅助工具

“富功能”中的任意模块可以和“基本功能”搭配，但是请确保“富功能”中的任
何模块在和“基本功能”搭配的同时，“基本功能”中的四个子模块一并存在，笔者在
开发过程中并未考虑更为灵活的搭配方式，假如您想尝试，可能会出现一些问题。
:2013-06-10
*/

本工具特点：
1.压缩后整体大小不超过20kb。
2.支持js动画。
3.模块化代码，可以将不用的功能删除。
4.全中文注释，方便阅读。
5.支持ie6/7/8/9/10 以及其他主流浏览器。
6.如果和其他插件混用不会发生冲突。