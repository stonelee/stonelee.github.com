---
layout: post
title: 盖房子种树记好时间
category: python
---

## 问题描述

设想以下场景：盖个房子，房子需要m秒才能盖好；然后种了棵树，树需要n秒才能长好。盖房子、种树等行为都是连续的操作，手动即可，不能间断，而时间的存储一般人是需要存到脑子中，或者记到笔记本上，或者定个闹钟。时间到后再进行相应的处理。

## 解决方案

模拟人的行为：手动操作作为主线程顺序执行，需要存储时间时开启新的一个线程来保存时间并计时（也就是说两者需要做到异步）。仅仅存储时间是不够的，还需要将该时间所对应的状态信息保存下来，以供时间到后的下步操作。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Last Update:

__revision__ = '0.1'
__author__ = 'lxd'
import threading
import time

class TimeThread(threading.Thread):
    """等待线程
    """
    def __init__(self, name, seconds):
        threading.Thread.__init__(self, name = name)
        self.seconds = seconds

    def run(self):
        time.sleep(self.seconds)

class TimeWorks(object):
    def __init__(self):
        self.wait_works = {}#等待工作列表，包括工作的所有细节
        self.wait_times_threads = []#线程列表

    def setTime(self, name, data, seconds):
        """将data放入等待工作列表中，并将工作放入线程中等待
        name如果已存在，则会覆盖原来的
        """
        self.wait_works.update({name:data})
        atime = TimeThread(name, seconds)
        atime.setDaemon(True)
        atime.start()
        self.wait_times_threads.append(atime)

    def checkTimeThread(self):
        """获得时间已到的工作
        """
        for atime in self.wait_times_threads:
            if not atime.isAlive():
                self.wait_times_threads.remove(atime)
                return self.wait_works.pop(atime.name)

if __name__ == '__main__':
    print 'start'
    timeWorks = TimeWorks()

    build = {'kind':'build', 'name':'build1', 'pos':(1, 2)}
    timeWorks.setTime('build1', build, 5)

    farm = {'kind':'farm', 'name':'tom', 'pos':(3, 5)}
    timeWorks.setTime('farm1', farm, 3)

    def build_something(data):
        print 'build_something', str(data)

    def farm_something(data):
        print 'farm_something', str(data)

    i = 0
    while True:
        print 'do_something', i
        i += 1
        time.sleep(1)

        data = timeWorks.checkTimeThread()
        if data:
            if data['kind'] == 'build':
                build_something(data)
            elif data['kind'] == 'farm':
                farm_something(data)
```

 结果如下：

![](/images/blog/plant_build.png)

改进了一下代码，去掉了不必要的线程名，这样就不用去考虑命名重复的问题了。另外把线程类简化成一个内部函数：

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Last Update:

__revision__ = '0.1'
__author__ = 'lxd'
import threading
import time

class TimeWorks(object):
    def __init__(self):
        self.wait_works = {}#等待工作列表，包括工作的所有细节
        self.wait_times_threads = []#线程列表

    def setTime(self, data, seconds):
        """将data放入等待工作列表中，并将工作放入线程中等待
        """
        def sleep(seconds):
            time.sleep(seconds)

        atime = threading.Thread(target = sleep, args = (seconds, ))
        atime.setDaemon(True)
        atime.start()
        self.wait_times_threads.append(atime)

        self.wait_works.update({atime.name:data})

    def checkTimeThread(self):
        """获得时间已到的工作
        """
        for atime in self.wait_times_threads:
            if not atime.isAlive():
                self.wait_times_threads.remove(atime)
                return self.wait_works.pop(atime.name)

if __name__ == '__main__':
    print 'start'
    timeWorks = TimeWorks()

    build = {'kind':'build', 'name':'build1', 'pos':(1, 2)}
    timeWorks.setTime(build, 5)

    farm = {'kind':'farm', 'name':'tom', 'pos':(3, 5)}
    timeWorks.setTime(farm, 3)

    def build_something(data):
        print 'build_something', str(data)

    def farm_something(data):
        print 'farm_something', str(data)

    i = 0
    while True:
        print 'do_something', i
        i += 1
        time.sleep(1)

        data = timeWorks.checkTimeThread()
        if data:
            if data['kind'] == 'build':
                build_something(data)
            elif data['kind'] == 'farm':
                farm_something(data)
```
