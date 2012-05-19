---
layout: post
title: Ext Core设计模式
comments: true
categories: [javascript, extjs]
---

参考:
[http://docs.sencha.com/core/manual/](http://docs.sencha.com/core/manual/)

## Singletons 单例模式

适用于只有static method或者只需要实例化一次的类，例如应用入口类。可以隐藏私有variables和methods

```js
MyApp = function() {
	var data; //data is private and can't be accessed from outside.
	return {
		init: function() {
			console.log('init');
			//Initialize application here
		},

		getData: function() {
			return data;
		}
	};
} ();
Ext.onReady(MyApp.init, MyApp);
```

## Observable观察者模式

Ext.util.Observable使用events实现在多个objects之间解耦

事件触发流程：state changes -> fire event -> notified

```js
var MyClass = Ext.extend(Ext.util.Observable, {
	constructor: function(config) {
		this.addEvents('datachanged'); //specify the events we're going to fire
	},

	update: function() {
		this.fireEvent('datachanged', this, arguments.length);
	}
});

// To subscribe to an event
var c = new MyClass();
c.on('datachanged', function(obj, num) {
	console.log(num);
});
c.update(2, 8, 'some'); //3
```

## Composite 组合模式

将对象组与单一对象作统一处理，方便用户调用

例如使用select取得的Ext.CompositeElement跟Ext.Element具有同样的调用接口

## Flyweight 享元模式

使用共有的object，避免创建额外对象，减少内存占用，适用于单行原子操作。

* 使用Ext.fly来以享元的方式获取Element,只能一次性使用
* Ext.get可以获取Element，然后保存以供未来使用
* Ext.getDom获取dom node
