---
layout: post
title: 使用热键控制python程序
comments: true
category: python
---

## 需求

按一个热键，程序开始循环执行某项操作，按另一个热键，操作终止；可以如此反复。此需求广泛应用于自动脚本执行等工作。

## 技术点

* 全局热键的绑定
* 热键的阻塞问题

绑定多个全局热键时，如果一个热键执行的操作未停止，程序不会响应其他热键，因此我采用另外开启线程的方法解决。

```python
#coding=utf-8
'''
Created on 2010-10-12
@author: lxd
'''
import wx
import win32con
import time
import threading

class WorkThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.timeToQuit = threading.Event()
        self.timeToQuit.clear()

    def stop(self):
        self.timeToQuit.set()

    def run(self):
        while True:
            if not self.timeToQuit.isSet():
                print 'work'
                time.sleep(1)
            else:
                break

class FrameWithHotKey(wx.Frame):
    def __init__(self, *args, **kwargs):
        wx.Frame.__init__(self, *args, **kwargs)
        self.regHotKey()
        self.Bind(wx.EVT_HOTKEY, self.OnHotKeyStart, id=self.hotKeyId_start)
        self.Bind(wx.EVT_HOTKEY, self.OnHotKeyEnd, id=self.hotKeyId_end)
        self.Bind(wx.EVT_HOTKEY, self.OnHotKeyQuit, id=self.hotKeyId_quit)
        self.work = None

    def regHotKey(self):
        self.hotKeyId_start = 100
        self.RegisterHotKey(self.hotKeyId_start, win32con.MOD_ALT, win32con.VK_F1)
        self.hotKeyId_end = 101
        self.RegisterHotKey(self.hotKeyId_end, win32con.MOD_ALT, win32con.VK_F2)
        self.hotKeyId_quit = 102
        self.RegisterHotKey(self.hotKeyId_quit, win32con.MOD_ALT, win32con.VK_F3)

    def OnHotKeyStart(self, evt):
        if not self.work:
            self.work = WorkThread()
            self.work.setDaemon(True)
            self.work.start()

    def OnHotKeyEnd(self, evt):
        if self.work:
            self.work.stop()
            self.work = None

    def OnHotKeyQuit(self, evt):
        exit()

app = wx.App()
FrameWithHotKey(None)
app.MainLoop()
```

程序运行后，按Alt+F1会重复打印‘work’，按Alt+F2停止打印，按Alt+F3结束程序。
