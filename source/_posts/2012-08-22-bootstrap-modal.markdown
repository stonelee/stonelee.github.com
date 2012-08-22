---
layout: post
title: Bootstrap modal源码分析
comments: true
categories: [javascript]
---

要分析的代码见:
[bootstrap-modal](https://github.com/twitter/bootstrap/blob/master/js/bootstrap-modal.js)

##整体结构

用匿名函数将代码整个包裹起来，防止全局变量污染。

```
!function ($) {}(window.jQuery);
```

但是传递的参数为window.jQuery，这个在使用seajs封装时有点小问题，为了迁就它，不得已只好将jQuery暴露出来。

###类定义

提供插件的基本逻辑

```
//定义对象
var Modal = function (element, options) {}

//在prototype中定义对象方法
Modal.prototype = {
    //constructor重新设置原型链，使得Modal.prototype.constructor === Modal，而不是Object
    constructor: Modal
  , show: function () {}
  , hide: function (e) {}
}
```

###jQuery插件定义

```
$.fn.modal = function (option) {
  //return使得方法可以进行链式调用。
  return this.each(function () {
    var $this = $(this)
      , data = $this.data('modal')
      , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
    //将内部使用对象存放到data('modal')中，可以轻松从外部获取
    if (!data) $this.data('modal', (data = new Modal(this, options)))
    if (typeof option == 'string') data[option]()
    else if (options.show) data.show()
  })
}

//使得插件默认配置项可以在插件代码外重新设置。
$.fn.modal.defaults = {
    backdrop: true
  , keyboard: true
  , show: true
}

//代码外面可以通过$.fn.modal.Constructor来获得Modal
$.fn.modal.Constructor = Modal
```

###Data-api

在页面标签中设置data-toggle就可以提供modal调用，为页面编写者提供了最大的便利。

```
$(function () {
  $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })
})
```

##技术难点

```
var Modal = function (element, options) {
  this.options = options
  this.$element = $(element)
    .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
}
```

上面这段代码中，

this指向的是Modal类的对象，通过new Modal()生成。
this.options和this.$element是该对象的属性。
this.hide存在于Modal的原型链上，作为该对象的方法被调用。

$.proxy(this.hide, this)使得hide中的this指向这个代码中的this，即modal对象。
如果直接在delegate中调用this.hide，会导致hide中的this指向delegate的目标对象，也就是[data-dismiss="modal"]这个页面组件，通常是个按钮。


## 结尾

不得不佩服Twitter员工的水平，代码结构相当优雅清晰，有许多设计细节值得借鉴。

弄清了整体结构和技术难点，其他部分作为实现细节就简单了，对照着代码看下就好。
