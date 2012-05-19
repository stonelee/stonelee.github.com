---
layout: post
title: windows下编译开源代码中的sphinx文档
comments: true
category: python
---

许多python开源代码clone下来后会发现里面附带docs，有许多是Sphinx格式的帮助文件，可以将其编译为html以便在本地查看。 

编译sphinx文档的方法很简单，首先安装Sphinx 

```bash
easy_install Sphinx
```

然后在docs目录下编译 

```bash
make html
```

这样就会在build生成html样式的帮助文档。 

在windows下如果目录中没有make.bat文件，会报错： 

```
'make’不是内部或外部命令，也不是可运行的程序或批处理文件。
```

解决方案：新建目录 

```bash
md temp
cd temp
```

生成sphinx脚手架 

```bash
sphinx-quickstart
```

然后将生成的make.bat复制到原来文档目录下，然后make html。 

有时候会报错 

```
Error:Cannot find source directory
```

这是因为配置路径有问题，按照提示进行相应配置即可。 
