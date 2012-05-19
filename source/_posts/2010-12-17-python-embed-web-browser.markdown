---
layout: post
title: python嵌入IE浏览器
comments: true
category: python
---

今天在研究visual studio 2008中的WebBroswer时忽然想到，对于我的简单需求（只想在程序中嵌入一个浏览器，而不是开发一个浏览器程序与Chrome、Firefox竞争）来说，只需要简单的调用IE就可以了（我的程序只是针对windows用户），这样的另一个好处是如果用户用IE曾经载入过的文件（如Flash游戏），用我的嵌入式浏览器就不用再次载入的。比以前的思路更符合我的需求，因此我决定顺着这个思路找找看，结果发现人家wxpython早就有了web.lib.iewin，骑驴找驴的事情再次发生~ 

关键代码： 

```python
self.ie = wx.lib.iewin.IEHtmlWindow(self)
```

打开网页： 

```python
self.ie.LoadUrl(url)
```

如此简单~ 
