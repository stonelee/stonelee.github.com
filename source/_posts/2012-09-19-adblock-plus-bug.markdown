---
layout: post
title: 当前端遇到Adblock Plus
comments: true
categories: [javascript]
---

今天将最近开发的演示程序集成到同事的业务框架中去，结果在同事的浏览器中报错：

![](/images/blog/adblock-bug.png)

Firebug中显示报错，但是没有具体错误提示，只显示问题所在代码

```
r.open('GET', url, true)
```

点进去看发现其上下文只是一般的ajax调用而已，why？

##排错

###浏览器问题？

最初怀疑跟浏览器有关,我测试使用的是chrome和firefox14，而同事使用firefox15.
于是在测试服务器上安装firefox15，木有报错...

###调用库代码问题？

报错的代码属于seajs，google搜索关键字无果，更新到最新版本还是没效果

###冷静思考

一共有5个tpl模板文件需要加载，此处加载了4个，出问题的为track.tpl.
于是怀疑模板文件是否格式有问题，难道有未闭合的html标签？
反复对照查看发现没有问题...

索性将调用改为其他模板，这下不再报错了，虽然模板渲染还是有问题。

难道是文件编码问题？隐藏字符？还是文件内容有瑕疵？

猛然想到，同事使用firefox多年，而测试服务器是新安装的纯净版，难道是插件造成的问题?

##原因

Firefox插件Adblock Plus的过滤列表ChinaList+EasyList中
有规则：

```
|http://*/track.
```

导致模板文件track.tpl被屏蔽，从而ajax加载该文件失败

因此解决方案是将该文件改名为tracks.tpl

苦逼前端，除了应付各种浏览器兼容问题，尼玛还要应付浏览器插件兼容!!!
摔！！！

