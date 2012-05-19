---
layout: post
title: yield使用心得
category: python
---

看高手的源码经常可以看到yield，特地查了一下用法，总结如下： 

包含yield表达式的函数是特殊的函数，叫做生成器函数(generator function)，被调用时将返回一个迭代器（iterator），调用时可以使用next或send(msg)。它的用法与return相似，区别在于它会记住上次迭代的状态，继续执行。 

send(msg)与next()的区别在于send可以传递参数给yield表达式，这时传递的参数会作为yield表达式的值，而yield的参数是返回给调用者的值。初始调用时必须先next()或send(None)，否则会报错。 

举个例子： 

![](/images/blog/yield1.png)
 
首先生成一个迭代器f，f.next()会使生成器函数执行到yield，生成一个值然后挂起。 
 
![](/images/blog/yield2.png)

然后f.next()或f.send(msg)会在生成器函数内部返回值，执行到下一个yield，生成值后挂起 

![](/images/blog/yield3.png)
 
然后f.next()或f.send(msg)会在生成器函数内部返回值，意图执行到下一个yield，但是后面没有yield了，所以抛出异常。 

使用yield可以有效简化代码，并减少空间浪费。 

举个简单例子：列表中的每个元素+1 

传统写法： 

```python
def addlist(alist):
    r = []
    for i in alist:
        r.append(i+1)
    return r
```

yield写法： 

```python
def addlist(alist):  
    for i in alist:  
        yield i + 1 
```

当然对于这种简单的问题： 

```python
[i+1 for i in alist]
```

参考资料： 

* [2.5版yield之学习心得-limodou](http://blog.donews.com/limodou/archive/2006/09/04/1028747.aspx)
* [Python yield具体使用方法探讨](http://developer.51cto.com/art/201003/186451.htm)
