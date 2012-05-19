---
layout: post
title: python中类方法、类实例方法、静态方法的使用与区别
category: python
---

参考自 [http://stackoverflow.com/questions/1669445/what-is-the-difference-between-a-static-method-and-class-method-in-python](http://stackoverflow.com/questions/1669445/what-is-the-difference-between-a-static-method-and-class-method-in-python)

使用方法:

```python
class A(object):
    def foo(self,x):
        #类实例方法
        print "executing foo(%s,%s)"%(self,x)

    @classmethod
    def class_foo(cls,x):
        #类方法
        print "executing class_foo(%s,%s)"%(cls,x)

    @staticmethod
    def static_foo(x):
        #静态方法
        print "executing static_foo(%s)"%x
```

调用方法：

```python
a = A()
a.foo(1)

a.class_foo(1)
A.class_foo(1)

a.static_foo(1)
A.static_foo(1)
```

运行结果：

```python
executing foo(<__main__.A object at 0xb77d67ec>,1)
executing class_foo(<class '__main__.A'>,1)
executing class_foo(<class '__main__.A'>,1)
executing static_foo(1)
executing static_foo(1)
```

区别：

* 类方法和静态方法都可以被类和类实例调用，类实例方法仅可以被类实例调用
* 类方法的隐含调用参数是类，而类实例方法的隐含调用参数是类的实例，静态方法没有隐含调用参数
