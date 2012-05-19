---
layout: post
title: 糅合Markdown和语法高亮，快速写作技术博客
comments: true
category: tornado
---

之前博客在javaeye，不知道触犯了老大哪根神经，不声不响就给封了，现在来到CSDN，又正好赶上改版，好好的博客写完后格式乱七八糟。国内的其他博客商也都好不到哪里去，不知道什么时候就被封，算了，自己动手丰衣足食，自己搞个独立博客吧。

## 要求

代码写惯了，觉得可视化编辑器非常不靠谱，写代码花时间，写文档花时间，调格式更得花时间，而且不利于备份。因此要求纯文本，标记语言简单易学，实现代码高亮。

## 技术选型

* 标记语言 Markdown
* python封装库 python-markdown2
* 代码高亮工具 Javascript code prettifier

## 实现

### 1. markdown实现：

```python
import markdown2
content="something"
markdown = markdown2.markdown(content)
```

字符串content会按照markdown的语法生成相应的html标签，直接输出到页面上即可。

### 2. Javascript code prettifier使用：

引入js文件和选择的css模板

```html
<script src="prettify.js"></script>
<link rel="stylesheet" href="desert.css" type="text/css" />
```

函数加载到页面中：

```html
<script src="prettify.js"></script>
<body onload="prettyPrint(); ">
```

代码插入：

```html
<div style="width: 40em; display: inline-block">
    <pre class="prettyprint">
        somecode
    </pre>
</div>
```

python-markdown2中已经实现了代码高亮，无奈语焉不详，而且语法也着实丑陋。本着“quick and dirty”的原则，直接定义

```
{{ '<code></code>'|escape }}
```

来包裹想高亮的代码，然后用replace来替换上面的div,pre标签。

实现如此简单~

## 样例

![](/images/blog/markdown.gif)

## 源文件

```
标题
====

前言

**目录**

* 第一章
 * 第一节
 * 第二节
* 第二章
* 第三章

第一章
------

**第一节**

内容内容内容内容内容内容

**第二节**

<code>
def hello()
    print "hello"
</code>

第二章
------

内容内容内容内容内容内容

```

## 附有用的网址

Markdown

* [入门](http://daringfireball.net/projects/markdown/basics)
* [语法参考](http://daringfireball.net/projects/markdown/syntax)
* [练习场](http://daringfireball.net/projects/markdown/dingus)，熟练后直接使用这个
* [markdown解析程序](https://github.com/trentm/python-markdown2)

代码高亮 Javascript code prettifier

* [入门](http://google-code-prettify.googlecode.com/svn/trunk/README.html)

