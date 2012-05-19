---
layout: post
title: 搭建基于github的免费博客
category: web
---

## 优势

* 国外著名开源网站，影响力大（无声无息倒掉的风险较少）
* 基于git的本地源码控制，安全（防GFW）
* 纯文本写作，适合程序控
* 可以绑定自己的域名
* 空间免费

## 使用 

* fork我的博客
* git clone
* 修改一下页面代码，在\_posts中写自己的博客
* github page服务后台使用jekyll，为了在本地写作博客， 修改满意后再进行同步，自己安装jekyll是很有必要的。
然后可以在本地启动

```bash
jekyll --server
```

## 功能增强

* 添加评论[disqus](http://disqus.com)
* [Google Analytics](http://www.google.com/intl/zh-CN/analytics/)
* blog订阅:[FeedSky](http://www.feedsky.com)
* 社会化推荐:[JiaThis](http://www.jiathis.com)

## 绑定域名

修改 A record并指向207.97.227.245

我在Godaddy买的域名，还没用就被封DNS了。更换Nameservers后成功访问。使用的是 [dnspod](https://www.dnspod.cn/),据说是国内最早提供免费智能DNS产品的网站，需要邮箱和手机验证。

## 参考

* [saberma的使用心得](http://saberma.me/other/2010/09/20/saberma-github-page-blog-build-with-jekyll.html)
* [官方pages简介](http://pages.github.com/)
* [其他人的博客列表](https://github.com/mojombo/jekyll/wiki/sites)

#### 模板引擎liquid,是模版使用的语法

* [用法](https://github.com/shopify/liquid/wiki/liquid-for-designers)
* [扩展](https://github.com/mojombo/jekyll/wiki/liquid-extensions)

### textile
 
* [语法参考](http://redcloth.org/hobix.com/textile/)
* [练习](http://textile.thresholdstate.com/)

### 语法高亮支持语言

[pygments](http://pygments.org/docs/lexers/)

### 模版网址

[基于html5、css3的免费模板](http://freehtml5templates.com)

## PS

### 2012-05-05更新

jekyll安装:

```bash
$ gem install jekyll 0.11.0
```

遇到问题：

```bash
Liquid error: undefined method `join’ for #
```

解决方法: liquid降级

```bash
$ gem uninstall liquid
$ gem install liquid -v 2.2.2
```
