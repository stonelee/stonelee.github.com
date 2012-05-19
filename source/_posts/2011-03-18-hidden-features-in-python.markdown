---
layout: post
title: 你可能所不知道的python中有用的特性
comments: true
category: python
---

来自stackoverflow中python标签下按投票数排列第一位的问题：
[Hidden features of Python](http://stackoverflow.com/questions/101268/hidden-features-of-python?tab=votes#tab-top)

> 题记：我们没有黑魔法，我们是可读的。 

> Python is a dynamically and strongly typed programming language that encourages readability. 

## 1.链式操作符，要注意执行顺序问题，方法是加括号。 

```python
>>> x = 5
>>> 10 < x < 20 
False
>>> x < 10 < x*10 < 100
True
```

## 2.debug regex 

```python
>>> re.compile("""
 ^              # start of a line
 \[font         # the font tag
 (?:=(?P<size>  # optional [font=+size]
 [-+][0-9]{1,2} # size specification
 ))?
 \]             # end of tag
 (.*?)          # text between the tags
 \[/font\]      # end of the tag
 """, re.DEBUG|re.VERBOSE|re.DOTALL)
```

另附name match： 

```python
>>> p = re.compile(r'(?P<word>\b\w+\b)')
>>> m = p.search( '(((( Lots of punctuation )))' )
>>> m.group('word')
'Lots'
```

## 3.generator object 

可以节省内存，但是只能使用一次 

## 4.同时yield列表中的项和序号。 

```python
>>> a = ['a', 'b', 'c', 'd', 'e']
>>> for index, item in enumerate(a): print index, item
```

## 5.iter() can take a callable argument 

```python
def seek_next_line(f):
    for c in iter(lambda: f.read(1),'\n'):
        pass
```

## 6.Decorators 

下面的评论中有人说这已经不算太hidden了 

## 7.yield中send的使用 

## 8.

```python
a = [1,2,3,4,5]
>>> a[::2]  # iterate over the whole list in 2-increments
[1,3,5]
```

反转

```python
>>> a[::-1]
[5,4,3,2,1]
```

对比

```python
>>> list(reversed(range(4)))#这种方法返回的是iterator
[3, 2, 1, 0] 
```

## 9.默认参数可能会变 

```python
>>> def foo(x=[]):
...     x.append(1)
...     print x
... 
>>> foo()
[1]
>>> foo()
[1, 1]
>>> foo()
[1, 1, 1]
```

Instead, you should use a sentinel value denoting "not given" and replace with the mutable you'd like as default: 

```python
>>> def foo(x=None):
...     if x is None:
...         x = []
...     x.append(1)
...     print x
>>> foo()
[1]
>>> foo()
[1]
```

默认参数不过是函数的一个属性foo.func_defaults而已，因此对于list类型的可能会变动 

## 10.defaultdict可以增强dict 

```python
>>> s = [('yellow', 1), ('blue', 2), ('yellow', 3), ('blue', 4), ('red', 1)]
>>> d = defaultdict(list)
>>> for k, v in s:
...     d[k].append(v)
...
>>> d.items()
[('blue', [2, 4]), ('red', [1]), ('yellow', [1, 3])]
```

相当于 

```python
>>> d = {}
>>> for k, v in s:
...     d.setdefault(k, []).append(v)
```

对于列表中的每个key，如果该defaultdict中不存在，会使用default_factory来创建该值 

## 11.for..else 

对于丑陋的代码 

```python
found = False
for i in foo:
    if i == 0:
        found = True
        break
if not found:
    print("i was never 0")
```

可以使用下面代码来替代 

```python
for i in foo:
    if i == 0:
        break
else:
    print("i was never 0")
```

else在for循环从来没有break时调用，有人提议这个关键字else实际上用finally更合适。 

## 12.值替换，“，”隐含的构成了一个tuple 

```python
>>> a = 10
>>> b = 5
>>> a, b
(10, 5)

>>> a, b = b, a
>>> a, b
(5, 10)
```
