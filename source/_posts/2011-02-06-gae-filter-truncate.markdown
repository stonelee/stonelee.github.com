---
layout: post
title: GAE中使用自定义filter，实现文字截断
category: python
---

来自于 [http://daily.profeth.de/2008/04/using-custom-django-template-helpers.html](http://daily.profeth.de/2008/04/using-custom-django-template-helpers.html)，原网站被墙，故记录于此 

目录结构： 

![](/images/blog/filter.png)

templatefilters.py实现只显示固定数目文字的功能 

```python
from google.appengine.ext import webapp
register = webapp.template.create_template_register()

def truncate(value,maxsize,stopper = '...'):
    """ truncates a string to a given maximum
        size and appends the stopper if needed """
    stoplen = len(stopper)
    if len(value) > maxsize and maxsize > stoplen:
       return value[:(maxsize-stoplen)] + stopper
    else:
       return value[:maxsize]

register.filter(truncate)
```

base.py中注册此filter 

```python
webapp.template.register_template_library('common.templatefilters')
```

html中可以使用该filter了 

```
{ { somevalue|truncate:20 } }
```
