---
layout: post
title: python动态改变对象属性（热插拔）
category: python
---

运用非面向对象的技术，结合动态语言的特性，确实能实现许多很灵活的功能，

本文根据“Mixin 扫盲班 -- 赖勇浩”文后 [沈崴哥的代码](http://wiki.woodpecker.org.cn/moin/FlyintoMixin 改写)

假设现有水果，需要描述它的属性：颜色，熟了没？直接上代码：

```python
#coding=utf-8
class Instance:
    def __init__(self, *args):
        for m in args:
            m(self)

    def config(self, *args):
        for m in args:
            m(self)

#无参数的
def has_harvest(self):
    self.harvest = True

def has_not_harvest(self):
    self.harvest = False

#有参数的
def setColor(color):
    def method(self):
        self.color = color
    return method

apple = Instance(has_not_harvest, setColor('green'))
print 'harvest:%s;color:%s' % (apple.harvest, apple.color)

apple.config(has_harvest, setColor('red'))
print 'harvest:%s;color:%s' % (apple.harvest, apple.color)
```

结果如下：

```python
harvest:False;color:green
harvest:True;color:red
```

如果想再添加一属性：能不能吃？，很简单，代码如下：

```python
#再加一属性
def can_eat(self):
    self.eat = True
apple.config(has_harvest, setColor('red'), can_eat)
print 'harvest:%s;color:%s;eat:%s' % (apple.harvest, apple.color, apple.eat)
```

结果如下：

```python
harvest:True;color:red;eat:True
```

用这种技巧动态增加对象方法非常方便，值得推荐
