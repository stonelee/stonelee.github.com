---
layout: post
title: orbited中最好不要使用demjson，会导致twisted报错
category: python
---

Orbited是一个非常好用的推（comet）服务器，它内置了twisted作为异步服务器，集成了MorbidQ来作为消息队列服务器，对于服务端直接推数据到客户端的应用参考 [这篇文档](http://cometdaily.com/2008/10/10/scalable-real-time-web-architecture-part-2-a-live-graph-with-orbited-morbidq-and-jsio/)就可以了。 

实际编码中问题来了。 

```python
class DataProducer(StompClientFactory):
    def recv_connected(self, msg):
        print 'Connected; producing data'
        self.timer = LoopingCall(self.send_data)
        self.timer.start(1)

    def recv_message(self,msg):
        pass
        
    def send_data(self):
        data = {'type':'num', 'num':random()}
        self.send(CHANNEL_NAME, json.encode(data))

def main():
    reactor.connectTCP('localhost', 61613, DataProducer())
    reactor.run()
```

执行程序的话会报错： 

```python
TypeError:Data must not be unicode 
```

看twisted源码： 

```python
if isinstance(data, unicode): # no, really, I mean it
    raise TypeError("Data must not be unicode")
```

看注释的意思，好像作者非常强调这个类型啊，不让改就不改呗 

再看orbited.json源码： 
提供了cjson、simplejson、demjson的调用 

在我本机上实际上调用的是demjson,它序列化的对象是unicode类型的，而我常用的json.dumps()返回的对象是str类型，符合twisted的需要，因此直接使用后者即可。 

关于这个bug我已经 [提交](https://bitbucket.org/site/master/issue/2419/demjson-cause-typeerror-in-twisted)了，Orbited开发者很活跃，应该很快就会有回应。 
