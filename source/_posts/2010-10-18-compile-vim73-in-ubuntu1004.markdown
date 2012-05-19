---
layout: post
title: 在ubuntu 10.0.4上编译vim7.3
comments: true
category: vim
---

## 编译前准备

如果要编译GVIM，需要先安装必要的库，否则可能会报各种编译错误

```bash
sudo apt-get install libncurses5-dev libgnome2-dev libgnomeui-dev libgtk2.0-dev libatk1.0-dev libbonoboui2-dev libcairo2-dev libx11-dev libxpm-dev libxt-dev
```

要添加python支持， 另外还需要python2.6-dev

## 开始编译

```bash
$ cd src
$ make distclean	#防止缓存
$ ./configure --with-features=huge --enable-gui=gnome2 --enable-cscope  --enable-fontset --enable-multibyte --enable-pythoninterp --with-python-config-dir=/usr/lib/python2.6/config
$ make
$ sudo make install
```

## 查看特性添加与否

```vim
:version
```
