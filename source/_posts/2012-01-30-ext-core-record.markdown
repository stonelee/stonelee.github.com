---
layout: post
title: Ext Core学习笔记
categories: [javascript, extjs]
---

Ext Core与jQuery类似，提供了跨浏览器的js封装。
主要功能包括DOM操作，Ajax，Event，Animation，template，OO等。
作为类库它提供了更高层次的抽象，方便具体问题的解决
参考: [http://docs.sencha.com/core/manual/](http://docs.sencha.com/core/manual/)

```js
Ext.onReady(function() {
    Ext.DomHelper.append(document.body, {tag: 'p', cls: 'some-class'});
    Ext.select('p.some-class').update('Ext Core successfully injected');
});
```

## Class System

* Ext.extend 创建新class，将新的properties/functions添加到prototype中,使用superclass引用父类
* Ext.override 用来更改原来的class

```js
Person = Ext.extend(Object, {
	constructor: function(first, last) {
		this.firstName = first; //property
		this.lastName = last;
	},

	getName: function() {
		return this.firstName + ' ' + this.lastName;
	}
});

Developer = Ext.extend(Person, {
	getName: function() {
		if (this.isCoding) {
			return 'Go Away!';
		} else {
			// Access the superclass getName method
			return Developer.superclass.getName.call(this);
		}
	}
});

var p = new Developer('John', 'Smith');
console.log(p.getName()); //John Smith
p.isCoding = true;
console.log(p.getName()); //Go Away!
```

prototype中的会被share，特别要注意{}会被多个子类共享修改，小心！！

```js
MyClass = Ext.extend(Object, {
	// This object literal is now shared between all instances of MyClass.
	baseParams: {},

	foo: function() {
		this.baseParams.bar = 'baz';
	}
});

Ext.onReady(function() {

	var a = new MyClass();
	var b = new MyClass();

	a.foo();
	// Modifying baseParams in a affects baseParams in b.
	console.log(b.baseParams);
});
```

* apply 复制所有property
* applyIf 对于重复的property则不复制

```js
var person = {
    name: 'John Smith',
    age: 30,
    hobby: 'Rock Band'
};

Ext.applyIf(person, {
    hobby: 'Coding',
    city: 'London'
}); // hobby is not copied over
```

## 函数

函数式编程：

```js
var sayHello = function(firstName, lastName) {
	alert('Hello ' + firstName + ' ' + lastName);
};
Ext.get('myButton').on('click', sayHello.createCallback('John', 'Smith'));
等价于
Ext.get('myButton').on('click', function() {
	sayHello('John', 'Smith');
});
```

TaskRunner用来固定时间间隔执行函数，例如每隔5s进行ajax请求，TaskMgr是TaskRunner的单例，用起来更方便

```js
var stop = false;
var task = {
	run: function() {
		if (!stop) {
			console.log(new Date());
		} else {
			runner.stop(task); // we can stop the task here if we need to.
		}
	},
	interval: 1000 // every 1 seconds
};
var runner = new Ext.util.TaskRunner();
runner.start(task);
```

```js
var stop = false;
Ext.TaskMgr.start({
	run: function() {
		if (!stop) {
			console.log(new Date());
		}
	},
	interval: 1000
});
```

DelayedTask 延时触发事件，如果在延时时间内触发两次事件，则后一次事件会覆盖前一次的触发

```js
var task = new Ext.util.DelayedTask(function() {
	console.log(Ext.getDom('myInputField').value.length);
});
// Wait 500ms before calling our function. If the user presses another key 
// during that 500ms, it will be cancelled and we'll wait another 500ms.
Ext.get('myInputField').on('keypress', function() {
	task.delay(500);
});
```

延时函数：

```js
var task = new Ext.util.DelayedTask(function() {
	console.log(Ext.getDom('myInputField').value.length);
});
// Wait 500ms before calling our function. If the user presses another key 
// during that 500ms, it will be cancelled and we'll wait another 500ms.
Ext.get('myInputField').on('keypress', function() {
	task.delay(500);
});
```

```js
var whatsTheTime = function(){
    alert(new Date());
};
whatsTheTime.defer(3000); //Wait 3 seconds before executing.
```

## 格式

urlEncode、urlDecode将object-literal与GET request parameter（key1=value1&key2=value2）互相转化 

```js
var params = {
    foo: 'value1',
    bar: 100
};
var s = Ext.encode(params); // s is now foo=value1&bar=100
```

encode、decode将object与json互相转换

```js
var s = Ext.encode({
    foo: 1,
    bar: 2
}); //"{"foo":1,"bar":2}"
```

字符串格式化：

```js
var s = String.format(
   'Hey {0} {1}', how are you?', 
   'John', 
   'Smith'
);
```

## DOM

DomQuery提供了高性能的selector/xpath处理，可以应用于html和xml，主要使用select函数，可以使用get预先获取Root来进一步提升性能

* 多重选择 Ext.select('div.foo, span.bar');
* 链式选择 Ext.select('div.foo[title=bar]:first');
* 子选择 Ext.select('div span');
* 直接子选择 Ext.select('ul > li'); 
* 属性选择 Ext.select('a[href=http://extjs.com]'); 
* 有alt tag Ext.select('img[alt]'); 
* 伪类 Ext.select('div:next(span.header)); 
* css值选择 E{display^=none} //css value "display" that starts with "none"

DomHelper动态生成html片段：

```js
Ext.DomHelper.append(document.body, {
    id: 'my-div',
    cn: [{
    	tag: 'a', 
    	href: 'http://www.yahoo.com/', 
    	html: 'My Link', 
    	target: '_blank'
    }]
});
```

## Ext.Element

浏览器加载页面时，将每个tag解析为HTMLElement，建立DOM，保存到全局变量document里。使用getElementById来获取每个HTMLElement
Ext.Element屏蔽DOM操作的浏览器差异，功能包括：

### CSS & Styling(setStyle, addClass)

* radioClass实现单选效果，同类中有同样class则remove，否则add
* toggleClass切换

### Dom Querying or Traversal(query, select, findParent)

is 测试element是否符合selector

```js
//向上找parent:
Ext.fly('elId').findParent('div'); //returns a dom node
Ext.fly('elId').up('div'); //返回Ext.Element

//查找
Ext.fly('elId').select('div:nth-child(2)'); //返回CompositeElement
Ext.fly('elId').select('div:nth-child(2)', true); //返回Array of elements
Ext.query('div:nth-child(2)'); //返回Array of dom nodes

//返回Ext.Element，第二参数为true则返回dom node
Ext.fly('elId').child('p.highlight'); //任意深度的single child
Ext.fly('elId').down('span');  //直接single child
```

还有parent()，next()，prev()，first()，last()

### Dom Manipulation(createChild, remove)

使用id或Ext.Element或dom node或selectors或CompositeElement

```js
Ext.fly('elId').appendTo('elId2');
```

使用DomHelper config

```js
Ext.fly('elId').insertFirst({
	tag: 'p',
	html: 'Hi I am the new first child'
});
```

使用Html Fragments

```js
Ext.fly('elId').insertHtml('beforeBegin', '<p>Hi</p>')
```

包括beforeBegin, beforeEnd, afterBegin, afterEnd

### Event Handling

Ext.EventObject提供了跨浏览器的event实现，例如按键判断，event-propagation ，preventDefault()

```js
el.on('click', function(e,t) {
	// e is a normalized event object (Ext.EventObject)
	// t the target that was clicked, this is an Ext.Element.		
});
el.un('click', this.handlerFn);
```

Event delegation是利用冒泡机制在container中注册event，而不是在每个元素中注册，这样可以减少内存消耗，防止内存泄漏，更好地集中管理event 

```js
Ext.fly('actions').on('click, function(e,t) {
	switch(t.id) {
		case ''btn-edit':
		// handle the event
		break;
		case 'btn-delete':
		// handle the event
		break;
	}
});
```

configuration option:

```js
el.on('click', function(e,t) {
    // handle click
}, this, {    
    delegate: '.clickable',// will filter target to be a descendant with the class 'clickable'
    single: true, // 只响应一次，然后自动删除
    buffer: 1000, // 延时1s，如果在时间间隔内多次触发会覆盖
    delay: 1000, // 延时1s，不会覆盖
    target: el.up('div') // only handles the event when it has bubbled up to the first 'div'.
});
```

hover

```js
function over(e,t){
    Ext.get(t).toggleClass('red');
}
function out(e,t){
    Ext.get(t).toggleClass('red');
}
Ext.fly('myButton').hover(over, out);
```

### Dimensions(getHeight, getWidth)

可以添加动画configure或直接true

```js
// changes the height to 200px and animates with default configuration
Ext.fly('elId').setHeight(200, true);

// changes the height to 150px and animates with a custom configuration
Ext.fly('elId').setHeight(150, {
    duration : .5, // animation will have a duration of .5 seconds
    // will change the content to "finished"
    callback: function(){ this.update("finished"); } 
});
```

```js
getPadding('lrtb');//返回四个方向padding之和

//同时得到x,y坐标
var elXY = Ext.fly('elId').getXY() //elXY is an array
Ext.fly('elId').setXY([20,10])

//得到相对位置
var elOffsets = Ext.fly('elId').getOffsetsTo(anotherEl);

//设置位置
setLocation(15,32)
```

clearPositioning，getPositioning，setPositioning用来存储恢复position

### Animations

```js
//共八个方向，'r'表示朝右边滑动
Ext.fly('slideEl').slideOut('r', {
	callback : function(){
		alert('Finished sliding the element out');
	}
});
```

