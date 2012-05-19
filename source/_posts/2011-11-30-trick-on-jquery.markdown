---
layout: post
title: 恶搞jquery
category: javascript
---

有人使用jquery来get服务端数据吗？
相信略微有点功能的jquery程序都会使用把。

## trick

前提确定，恶作剧开始。
将下面代码插入任意js文件的可执行位置:

```js
Object.prototype.fuck=function(){
	alert("fuck u!!!");
};
```

## 效果

在我的系统中每隔5s向服务端请求一次数据，因此每隔5s会弹出一个温馨的祝福框。

## 原因

查看console没有任何异常啊，why？？
将那个可爱的alert换为console.log，发现console出现了位置定位jquery-1.7.js (line 7611)，点过去看看：

```js
for ( i in { success: 1, error: 1, complete: 1 } ) {
	jqXHR[ i ]( s[ i ] );
} 
```

jquery作者肿么了，object的for循环竟然没用hasOwnProperty来判断一下！！
然后看了下周围的代码，也都是一样滴！！
为了代码的简洁吗？为了运行的效率吗？基于用户的善意考虑吗？在js的prototype继承机制上，一切都是浮云~

如此明显的bug估计在jquery看来是有意为之的，但是为防止自己的代码被问候，建议自己的代码按照这样的方式书写：

```js
var obj={name:"tom",age:13};
for (var i in obj){
	if (obj.hasOwnProperty(i)){
		doSomething(i);
	}
}
```

这也是每本专业js书里的推荐写法。

## ps

如果有人用这种方法捣乱，文件夹搜索Object.prototype即可。
