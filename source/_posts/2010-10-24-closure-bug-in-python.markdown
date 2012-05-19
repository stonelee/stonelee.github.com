---
layout: post
title: python闭包实现的所谓bug
comments: true
category: python
---

思路来自 [http://groups.google.com/group/python-cn/browse_thread/thread/895f25d6303de2ec?hl=zh-CN#](http://groups.google.com/group/python-cn/browse_thread/thread/895f25d6303de2ec?hl=zh-CN#)
整理记录下来，让墙内的人也看看。 

## 问题描述 

```python
fs = []
for i in range(10):
    def f(n):
        return i + n
    fs.append(f)
print [f(4) for f in fs]
print [id(f(4)) for f in fs]
```

结果为： 

```
[13, 13, 13, 13, 13, 13, 13, 13, 13, 13] 
[145743064, 145743064, 145743064, 145743064, 145743064, 145743064, 145743064, 14 
5743064, 145743064, 145743064] 
```

很奇怪的结果吧。 
问题所在： 

```python
fs = []
for i in range(10):
    def f(n):
        print locals()
        print 'i' in globals()
        return i + n
    fs.append(f)
print [f(4) for f in fs]
print [id(f(4)) for f in fs]
```

结果为 

```
locals: {'n': 4} 
i in globals is: True    
```

可以看到i根本就没有封闭在f()里，而是个全局变量，因此出现上面的结果也就不奇怪了。 
解决方案： 

```python
fs = []
for i in range(10):
    def f(n,i = i):
        return i + n
    fs.append(f)
print [f(4) for f in fs]
print [id(f(4)) for f in fs]
```

将全局变量i引入f中，这下结果正确了。 

```
[4, 5, 6, 7, 8, 9, 10, 11, 12, 13] 
[143334724, 143334712, 143334700, 143334688, 143334676, 143334664, 143334652, 14 
3334640, 143334628, 143334616]    
```
