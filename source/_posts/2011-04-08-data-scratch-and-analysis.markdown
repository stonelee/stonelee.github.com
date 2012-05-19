---
layout: post
title: 数据抓包及分析经验小结
comments: true
category: web
---

* 分析网络包——Wireshark
* 查看AMF数据结构工具——AMF Explorer
* 查看cookie工具——Firecookie
* cookie操作
* cookie分析

## 1.分析网络包——Wireshark


* ubuntu下需要sudo wireshark启动
* Capture-interfaces:Start有ip的Device
* 本机网络包无法抓取
* filter中填写:
	* http and ip.src==192.168.1.103只显示本机发送的http协议包
	* http and ip.addr==192.168.1.103只显示本机发送和接收的http协议包

## 2.查看AMF数据结构工具——AMF Explorer

AMF Explorer基于Firebug的AMF查看插件

## 3.查看cookie工具——Firecookie

Firecookie基于Firebug的cookie查看、删除修改等操作插件，还可以下断点

## 4.cookie操作

```python
import urllib2
import cookielib
#自动记录cookie
cj = cookielib.CookieJar()
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
request = urllib2.Request('http://www.pythonchallenge.com/pc/def/linkedlist.php?busynothing=12345')
response = opener.open(request)

#获取服务器返回的cookie
cookies = cj.make_cookies(response, request) # extract all cookies that this request-response pair added to the jar

#修改cookie
cookie = cookies[0]
cookie.value = 'the flowers are on their way' # 将其值设为要发送的，不必自己转码
request = urllib2.Request('http://www.pythonchallenge.com/pc/stuff/violin.php')
cj.set_cookie(cookie) 
cj.add_cookie_header(request) #将cookies放入请求头部
print urllib2.urlopen(request).read()  
```

## 5.cookie分析

```html
Connection	keep-alive
```

说明使用的是长连接，应该使用Httplib2而不是Urllib2

网站登录信息往往保存在基于session的cookie里，因此在发送数据包的时候提供

服务端Response Headers	set-cookie发送给客户端cookie然后

客户端Request Headers	Cookie才能保存
