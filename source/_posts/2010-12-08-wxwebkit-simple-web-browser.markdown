---
layout: post
title: 基于wxwebkit实现简单的浏览器
comments: true
category: python
---

如何在python应用程序中嵌入浏览器？google半天之后发现 [wxWebKit](http://wxwebkit.wxcommunity.com/) 是一个相对给力的webkit封装，虽然也有相当多的不足之处，但是对于简单的html渲染是没用问题的，直接给出代码。 

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

__revision__ = '0.1'
__author__ = 'lxd'

import wx
import wx.webview

class MainFrame(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self, None, -1, 'name', size=(800, 600))
        self.url = wx.TextCtrl(self, -1)
        self.html = wx.webview.WebView(self, -1)
        self.btnLoad = wx.Button(self, -1, u'进入')
        self.Bind(wx.EVT_BUTTON, self.OnLoadClick, self.btnLoad)  
        self.layout()

    def layout(self):
        self.Center()

        setupBox = wx.StaticBox(self, -1, u'基本设置')
        setupSizer = wx.StaticBoxSizer(setupBox, wx.VERTICAL)
        setupSizer.Add(self.url, 0, wx.EXPAND|wx.ALL, 5)
        setupSizer.Add(self.btnLoad, 0, wx.ALL, 5)

        mainSizer = wx.BoxSizer(wx.VERTICAL)
        mainSizer.Add(setupSizer, 0, wx.EXPAND|wx.ALL, 5)
        mainSizer.Add(self.html, 1, wx.EXPAND|wx.ALL, 5)

        self.SetSizer(mainSizer)
        
    def OnLoadClick(self, evt):
        self.html.LoadURL(self.url.GetValue())

if __name__ == '__main__':
    app = wx.PySimpleApp()
    main = MainFrame()
    main.Show()
    app.MainLoop()
```

输入www.baidu.com没有问题，如果登录的话就杯具了...还有很多工作要做...貌似没有flash，没有cookie...希望有人能在这个基础上继续完善。 

