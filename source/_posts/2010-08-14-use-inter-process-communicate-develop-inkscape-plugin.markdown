---
layout: post
title: 使用进程间通信开发Inkscape插件
category: python
---

Inkscape是一款功能强大的svg图形绘制软件,开源免费，而且可以用python写扩展。

正好项目需要借助Inkscape来绘制图形，需要开发相应的插件，翻遍Inkscape的插件系统，觉得它的实现比较弱，尤其是界面控件，仅仅提供了基本的文本、下拉框几种，不给力啊~

在与同事谈论许久之后，给出以下方案：

1.Extensions调用子进程，传递参数。

```python
import subprocess
f = open('lxd/error.txt', 'w')
subproc = subprocess.Popen(['python', 'lxd/lxd.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
f.close()
r = subproc.communicate('inkscape')[0]#传递参数，返回子进程的stdout
draw_sth(tri, r)#Inkscape画图
```

2.子进程中进行实际功能开发。此段略过~可以借助强大丰富的python库实现理想的效果。

3.子进程与Extensions进程间通信，返回参数。

```python
import sys
s = sys.stdin.readline()#获取主进程Extensions传递的参数
sys.stdout.write(s + '123')#向主进程Extensions传递参数
```
