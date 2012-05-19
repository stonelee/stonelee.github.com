---
layout: post
title: ExtJS 4打包工具
comments: true
categories: [javascript, extjs]
---

ExtJS 4采用新的MVC思路进行开发。 在项目开发阶段这种分散式的代码组织方式是很爽的，但是应用到生产环境中时为了减少服务端压力，需要对js文件进行压缩打包。 为解决这一问题，官方提供了打包工具[JSBuilder](http://www.sencha.com/products/jsbuilder), 使用方法如下：

```bash
创建jsb文件：$sencha create jsb -a http://localhost/helloext/index.html -p app.jsb3
构建：$sencha build -p app.jsb3 -d .
```

但在实际使用时发现，不知道是因为水土不服还是我们的项目结构不合sencha的胃口。在构建jsb3文件的时候不是完全找不到任何路径，就是缺少大量项目文件，可以说是相当鸡肋。

不如自己来吧！

经测试发现，只要按照依赖顺序，将所有文件归置到一个文件中，然后压缩，项目即可正常调用。

打包工具已经放到github上:[https://github.com/stonelee/extjs4-build-tool](https://github.com/stonelee/extjs4-build-tool)

## 思路

将app下的js文件按照model, store, view, controller的顺序来创建jsb3。

如果view中使用requires加载其它view，则按照依赖顺序先行加载。

然后针对项目需求做了点修改，将app.js按Ext.application分成两部分，分别加载到最后生成的文件中。

## 技术点

* 按照依赖加载关系进行排列[sort.py](https://github.com/stonelee/extjs4-build-tool/blob/master/sort.py)
* 文本解析[parse.py](https://github.com/stonelee/extjs4-build-tool/blob/master/parse.py)

## 使用方法

本工具仅仅将项目开发中自己创建的位于app文件夹中的model, store, view, controller以及用于项目整合的app.js打包成一个文件。
其它ExtJS或者ux文件还需要自己打包。
将build-tool放到app同级目录下，项目文档结构如下：

```
|app
|--controller
|--model
|--store
|--view
|build-tool
|all.js
```

最终生成文件：

* app.jsb3 压缩文件路径信息
* all-debug.js 未压缩的打包文件,供调试使用
* all.js 压缩打包文件,生产环境使用

ps:

从开始研究Ext打包，形成思路，到最终完成完整的打包工具并应用到项目中一共用了两天时间，其中纯python编码时间也就半天时间，看来经过这半年的js编码之后，我的python还没太手生嘛哈哈。动态语言之间的学习可以互相促进？待验证~
