---
layout: post
title: 基于签名的数据传输
category: python
---

来自PyCon上的演讲：

[Hidden Treasures of the Standard Library](http://www.slideshare.net/doughellmann/hidden-treasures-of-the-python-standard-library)

发送方： 

* pickle序列化 
* 生成md5签名 
* 生成包，格式"签名\n数据长度\n数据" 

**数据传输**

接收方： 

* 解析数据包 
* 根据解析出来的数据生成签名 
* 将新生成的签名与数据包中的签名对比，如果正确说明无篡改, 否则抛出异常 
* pickle反序列化 

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

__revision__ = '0.1'
__author__ = 'lxd'

import hmac
from StringIO import StringIO
import pickle

def create_signature(key, msg):
    h = hmac.new(key)
    h.update(msg)
    return h.hexdigest()

##########send##########
def send_buffer(signature, msg):
    #模拟数据传输
    return StringIO('%s\n%d\n%s' %(signature, len(msg), msg))

def send_msg(key, message):
    msg = pickle.dumps(message)
    signature = create_signature(key, msg)
    return send_buffer(signature, msg)

##########get##########
def parse_buffer(buffer):
    signature = buffer.readline().rstrip()#strip \n
    msg_length = int(buffer.readline())
    msg = buffer.read(msg_length)
    return signature, msg

def check_signature(signature, key, msg):
    new_signature = create_signature(key, msg)
    if new_signature == signature:
        return msg
    else:
        raise ValueError('signature error')

def get_msg(key, buffer):
    signature, msg = parse_buffer(buffer)
    message = check_signature(signature, key, msg)
    return pickle.loads(message)

msg = 'some_message'
key = 'some_key'
buffer = send_msg(key, msg)
print get_msg(key, buffer)
```
