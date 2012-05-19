---
layout: post
title: 基于twisted的SSL服务器开发
comments: true
category: python
---

## 基于OpenSSL建立自己的CA和签发证书 

参考自 [http://rhythm-zju.blog.163.com/blog/static/310042008015115718637/](http://rhythm-zju.blog.163.com/blog/static/310042008015115718637/)

建立CA目录 

```bash
$ mkdir -p ./demoCA/{private,newcerts} 
$ touch ./demoCA/index.txt 
$ echo 01 > ./demoCA/serial 
```

生成CA证书的RSA密钥 

```bash
$ openssl genrsa -des3 -out ./demoCA/private/cakey.pem 2048 
```

生成 CA 证书请求 

```bash
$ openssl req -new -days 365 -key ./demoCA/private/cakey.pem -out careq.pem 
```

对 CA 证书请求进行自签名 

```bash
$ openssl ca -selfsign -in careq.pem -out cacert.pem 
```

这样我们就建立了一个私有根CA，包括密钥文件cakey.pem和由此签名的CA根证书文件cacert.pem 

签发证书： 

生成客户密钥： 

```bash
$ openssl genrsa -des3 -out userkey.pem 
```

生成客户证书： 

```bash
$ openssl req -new -days 365 -key userkey.pem -out userreq.pem 
```

签发客户证书： 

```bash
$ openssl ca -in userreq.pem -out usercert.pem 
```

注意CA证书和客户证书的国家组织等信息要对应相同，人名邮箱之类的不能相同 
我在ubuntu上生成的证书，放到windows上也可以使用。 

## 基于SSL的twisted服务器： 

参考自 [http://twistedmatrix.com/documents/current/core/howto/ssl.html](http://twistedmatrix.com/documents/current/core/howto/ssl.html)
只要注意将生成的key和证书文件改名后发到相应的文件夹下，然后照搬上面的例子就可以了。 

## todo：基于SSL的客户端数据发送程序实现 

项目需要客户端SSL验证后不断向服务器发送数据，参考 [这篇文档](http://twistedmatrix.com/documents/current/web/howto/client.html)发现只能发送一条数据，貌似需要自己开发SSL连接，留下记号，等待研究~ 
