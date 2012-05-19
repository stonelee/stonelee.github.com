---
layout: post
title: 打造纯净前端开发环境(附nginx反向代理解决跨域问题)
comments: true
category: web
---

最近在搞前端javascript编码, 公司项目使用的后台语言是.net和java,这些东西对于我而言太笨重了。而我钟爱的python又由于种种原因不能应用到项目中。因此需要一个比较纯净的前端开发测试环境，开发出来的代码可以容易的供其他后端语言使用。

## 要求

* 能够实现前后台数据通信
* 保持前端纯洁性，不掺杂过多服务端代码
* 前端js使用相对url来获取数据,需要解决跨域问题

## 解决方案

### 静态服务器nginx

提供前端html+js+css的静态展示

需要配置nginx.conf:
alias可以指定映射路径,
autoindex可以自动列出文件目录

```bash
location /develop {
	alias       "/home/lxd/Develop";
	autoindex   on;
}
```

### 后台测试服务器tornado

不使用template_path和static_path,直接使用write来返回字符串数据,
服务端简化到只需一个文件,
tornado只用来产生数据，以独立应用的形式提供服务

### 跨域问题

使用nginx反向代理tornado服务器，来解决跨域问题

nginx.conf添加反向代理

```bash
location /develop/gmf/zhunqi/tornado {
	proxy_pass       "http://localhost:8888";
	proxy_redirect   off;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

tornado文件指定url映射

```python
(r"/develop/gmf/zhunqi/tornado/mines", MineHandler),
```

