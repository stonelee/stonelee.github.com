---
layout: post
title: RLock来实现多线程同步
category: python
---

## 问题场景

有多个线程，分别负责建造房子，种树，养花之类的工作，这些工作都需要一定的等待时间，在等待过程中需要与服务端通信来保持连接。连接的提交不能太过频繁，最好2-3秒一次。

对于这种多线程之间的同步问题可以利用RLock来实现锁机制。

```python
#coding=utf-8
'''
Created on 2010-9-14
@author: stonelee
'''
import time
import random
import threading
p_lock = threading.RLock()
s_lock = threading.RLock()

def my_post(str):
    p_lock.acquire()
    print str
    time.sleep(random.random() * 2)
    p_lock.release()

def my_sleep(seconds):
    s_lock.acquire()
    time.sleep(seconds)
    s_lock.release()

def my_wait(name, seconds):
    last_time = time.time()
    last_seconds = 0
    while last_seconds < seconds:
        my_post('%s:%s' % (time.time(), name))
        my_sleep(3)
        last_seconds = time.time() - last_time

class ThreadA(threading.Thread):
    def run(self):
        for i in range(10000):
            my_post('%s:==================build house' % time.time())
            my_wait('a wait', 20)

class ThreadB(threading.Thread):
    def run(self):
        for i in range(10000):
            my_post('%s:=================plant tree' % time.time())
            my_wait('b wait', 5)

threadA = ThreadA()
threadA.setDaemon(True)
threadB = ThreadB()
threadB.setDaemon(True)

threadA.start()
threadB.start()
threadA.join()
threadB.join()
```
