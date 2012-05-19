---
layout: post
title: lxml中xpath的text()陷阱
category: python
---

lxml中使用xpath方法获取html标签中的内容时经常会使用text() 

```python
tree = etree.HTML(html)
s = tree.xpath('//p[@id="lk"]/a[3]/text()')[0]
```

这段代码是从百度首页html中解析hao123这段文字。 

使用一下这个变量s，很普通吧~ 

```python
>>> print s
hao123
>>> s=='hao123'
True
```

但是如果想把这个变量使用pickle序列化 

```python
import pickle
pickle.dumps(s)
```

报错了~ 

```python
TypeError:can't pickle _Element objects
```

为什么呢？ 

我们被s=='hao123'骗了，这个s并不是str类型，而是lxml.etree._ElementStrinResult类型，比str多了getparent、is_text等多个方法，pickle对这个类型不能识别，因此转换一下类型即可。 

自己写个转换类型函数 

```python
def get_text(nodes):
    return [unicode(node.xpath('text()')[0]) for node in nodes]
```

以后需要使用text()的时候，改为调用这个函数了： 

```python
nodes = tree.xpath('//p[@id="lk"]/a[3]')
s = get_text(nodes)[0]
```

## 总结

在pickle时，请谨慎使用text() 
