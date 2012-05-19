---
layout: post
title: ExtJS 4 mvc架构演化
comments: true
categories: [javascript, extjs]
---

从年前技术选型开始算起，使用Extjs 4已经四五个月时间了。对比之前的3.x版本，Extjs 4给了我们太多的惊喜：全新的mvc架构、强大的class体系、灵活的js加载方式、纯div布局页面。因此，项目组毫不犹豫地选择其作为前端架构进行新项目的开发。  

项目初始时，我们一直遵循推荐的MVC架构：在view中配置页面控件，controller中编写业务逻辑。但随着项目的推进，模块代码越来越多，加之由于种种原因开发时间严重缩短，没有时间进行代码评审，controller中的代码灵活性过强，调用页面控件方式相对繁琐等问题逐渐暴露出来，页面基本无法复用，controller一片狼藉。

第一次重构
----------

在用户桌面widget开发时，发现新widget与原模块中的view很像，但是在store,pagingtoolbar等方面略有差别，而controller中的逻辑非常杂乱，一个文件包含了整个模块的业务逻辑，维护和复用都相当困难。

重构结果总结如下:

-   将controller中的业务逻辑尽量移到view中，采用js闭包实现逻辑的相对隔离，跨多view的逻辑依然放在controller中，达到维护容易和代码复用的目的。
-   采用extend的方式简化view开发
-   操作按钮尽量使用inline方式，便于用户使用，也有利于集成到其他view中。
-   add和edit两个界面合为一个，简化开发和维护工作量
-   store.sync后回传的数据可能与grid中的column不符，这时无法享用自动load的好处，因此应该使用model来save。grid同时使用pagingtoolbar时必须用model来save，然后load，否则pagingtoolbar不能更新。

第二次重构
----------

业务逻辑移到view中，满足了页面间高内聚、低耦合的设计要求，但是view之间相对独立的特点导致了无法实现逻辑代码复用的问题。

经研究，可以使用mixin来实现逻辑的复用。

例如Grid可以拆分为Columns（基本列）,Crud（增删改）,Operate（操作）,filter（筛选）等minin类,这几个类都包含了控件和业务逻辑,可以灵活配置在各个view中。

![](/images/blog/Extjs-New-MVC.png)
