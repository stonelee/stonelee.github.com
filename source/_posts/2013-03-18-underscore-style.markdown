---
layout: post
title: Underscore源码研究之多种编程范式实现
comments: true
categories: [javascript]
---

Underscore提供了函数(functional)和对象(object-oriented)两种编程范式，使得其API调用既灵活又直观，可以说是整个类库架构中最为精华之处。

###两种调用方式

函数式

```
_.map([1, 2, 3], function(n){ return n * 2; });
```

对象式

```
_([1, 2, 3]).map(function(n){ return n * 2; });
```

###源码分析

调用入口

```
var _ = function(obj) {
  //如果参数为_对象，说明已经实例化过了，所以直接返回
  if (obj instanceof _) return obj;
  //如果实例化时没有使用new，那么在这里包装一下，使得this指向该实例
  if (!(this instanceof _)) return new _(obj);
  //将obj保存在内部属性_wrapped中
  this._wrapped = obj;
};
```

具体功能实现没什么好说的，直接定义为_的方法，因此可以进行函数式调用。
需要注意的是第一个参数为obj，在对象式调用时会省掉。

```
_.map = function(obj, iterator, context) {
  var results = [];
  if (obj == null) return results;
  if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
  each(obj, function(value, index, list) {
    results[results.length] = iterator.call(context, value, index, list);
  });
  return results;
};
```

重头戏来了。将方法附加到_的prototype上，实现对象式调用

```
//此方法暴露出来，供自定义扩展使用
_.mixin = function(obj) {
  each(_.functions(obj), function(name){
    //定义为_的方法，供函数式调用
    var func = _[name] = obj[name];
    //定义到prototype上，供对象式调用
    _.prototype[name] = function() {
      //将实例化时传递给构造函数的对象作为第一个参数
      var args = [this._wrapped];
      push.apply(args, arguments);
      //判断是否要链式调用，见下文分析
      return result.call(this, func.apply(_, args));
    };
  });
};
//将之前定义到_上的方法附加到_的prototype上，实现对象式调用
_.mixin(_);
```

###链式调用

两种编程范式都可以实现链式调用，与普通调用的区别是需要使用chain来声明，最后使用value来取得最终结果。

函数式

```
_.chain([1, 2, 3]).map(function(n) {
  return n * 2;
}).reduce(function(memo, n) {
  return memo + n;
}).value();
```

对象式

```
_([1, 2, 3]).chain().map(function(n) {
  return n * 2;
}).reduce(function(memo, n) {
  return memo + n;
}).value();
```

###链式调用实现

```
//判断是否要链式调用
var result = function(obj) {
  return this._chain ? _(obj).chain() : obj;
};

//函数式链式调用
_.chain = function(obj) {
  return _(obj).chain();
};

_.extend(_.prototype, {

  // 标记为链式调用，这样返回值就为this而不是计算得到的结果
  chain: function() {
    this._chain = true;
    return this;
  },

  // 取得最终的结果
  value: function() {
    return this._wrapped;
  }

});
```

###链式调用的调试

链式调用非常方便，但是要调试中间步骤的结果比较困难，因此提供了tap方法

```
_([1, 2, 3]).chain().map(function(n) {
  return n * 2;
}).tap(function(obj) {
  console.log(obj);
}).reduce(function(memo, n) {
  return memo + n;
}).value();
```

###源码实现

将中间过程的obj作为回调函数的参数进行处理，最终依然将其返回

```
_.tap = function(obj, interceptor) {
  interceptor(obj);
  return obj;
};
```
