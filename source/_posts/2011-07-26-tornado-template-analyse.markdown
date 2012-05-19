---
layout: post
title: Tornado模板机制分析
comments: true
category: tornado
---

Tornado自带的模板系统非常有特色，相对django等框架来说，可以任意插入python语句，这对于前后台通吃的小团队和个人开发者来说非常方便，而且可以方便的从Tornado框架中剥离出来单独使用。下面简单研究一下模板的实现机制。

模板的实现集中在template.py中，之所以可以随意在模板文本中插入python语句，是因为代码运行时会直接将文本转成python代码。这是如何实现的呢？

```python
exec self.compiled in namespace  
```

exec是python的内置语句，其作用是动态执行python代码，第一个参数可以是string，可以是打开的file object，也可以是code object。可以使用in来引入环境变量。这句代码的意思就是在namespace所设定的环境变量中，执行self.compiled的代码。

那么self.compiled从何而来呢？

```python
self.compiled = compile(self.code, self.name, "exec")  
```

使用exec执行python字符串时，需要先用解释器将其编译为字节代码，为避免多次编译导致没必要的时间消耗，可以预先进行编译。

compile(source,filename,mode[,flags[,dont_inherit]])可以将字符串编译为字节代码，其中source是要被编译的字符串，filename是定义该字符串变量的文件，如果不需要的话推荐设置为<string>,mode指定编译类型（single指单个语句，exec指多个语句，eval指一个表达式）。

exec实际上会动态生成函数_execute()，而且将环境变量插入namespace中，这样就可以从namespace中再取出该函数，然后执行，其结果就是以python代码的方式完成模板文本的解析。

```python
execute = namespace["_execute"]  
try:  
     return execute()  
```

那么self.code是怎么生成的呢？

```python
reader = _TemplateReader(name, template_string)  
self.file = _File(_parse(reader))  
self.code = self._generate_python(loader, compress_whitespace)  
```

详细代码可以参见template.py,纯粹是字符串的解析，有时间再看吧。
