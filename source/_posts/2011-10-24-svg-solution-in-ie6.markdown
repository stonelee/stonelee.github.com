---
layout: post
title: IE6下渲染svg的解决方案
comments: true
category: javascript
---

IE6下svg的渲染是个问题，目前主要有以下几种解决方案：

## [svgweb](http://code.google.com/p/svgweb/)

优点:开源，可在不支持svg的浏览器中使用flash来渲染，有效解决客户端下载插件问题

缺点:svg封装不完全，flash渲染效率比较低，刷新页面时内存泄漏严重

## [adobe SVGViewer](http://www.adobe.com/svg/viewer/install/)

优点：对svg支持较好

缺点：adobe已于2009年1月份明确表示不再提供支持，需要客户端下载插件

## [Chrome Frame](http://code.google.com/intl/zh-CN/chrome/chromeframe/)

优点：IE下使用chrome模式来渲染，速度快，原生支持svg

## svgweb+chrome frame

这时目前我们项目组所使用的解决方案，可以较好地满足我们的需求

* 系统整体框架为遗留系统，IE only，这决定了我们的客户必须使用IE（煤矿客户本来就对此喜闻乐见）
* 一般客户端使用频率较低，使用svgweb提供的flash渲染，不用下载flash以外的插件
* 监控中心中客户端数量较少，而且设备可控，使用chromeframe渲染svg单页面，渲染效率高，减少内存泄漏

### 发现问题：

在实际使用过程中发现，使用frame方式调用svg单页面时，通过指定chromeframe渲染头的方式是无效的:

```html
<meta http-equiv="X-UA-Compatible" content="chrome=1">
```

此时访问调用frameset的页面，会发现其依然是IE渲染，而单独访问该svg页面会使用chrome方式。

[网上讨论结果](http://groups.google.com/group/google-chrome-frame/browse_thread/thread/d5ffe442658bc60e/e6d7a4c1c179c931)是目前chromeframe只支持顶层meta tag检测，而且貌似也不打算修正这一问题。

### 解决方案：

经过不断尝试，发现有一个取巧方法可以解决此问题，即使用gcf前缀指定渲染方式，形如gcf:http://gmail.com
猛击 [参考网址](http://www.chromium.org/developers/how-tos/chrome-frame-getting-started#TOC-Testing-Your-Sites)

这需要修改注册表：HEKY_CURRENT_USER\Software\Google\ChromeFrame下新建DWORD类型的键 AllowUnsafeURLs=1
然后就可以这样调用该svg页面

```html
<frame src="gcf:http://127.0.0.1/svg/index.html" name="MainFrame" id="MainFrame"  frameborder="0" />
```

如果要兼容没有安装chromeframe的浏览器，可以使用js动态更改。

```js
(function() {
	function IsGCFInstalled() {
		try {
			if (new ActiveXObject('ChromeTab.ChromeFrame')) {
				return true;
			}
		} catch(e) {}
		return false;
	}

	$(document).ready(function() {
		var frame = document.createElement('frame');
		frame.setAttribute('name', 'MainFrame');
		frame.setAttribute('id', 'MainFrame');
		frame.setAttribute('frameborder', '0');
		if (IsGCFInstalled()) {
			frame.setAttribute('src', 'gcf:http://10.10.22.84/develop/gmf/zhunqi/index.html');
		} else {
			frame.setAttribute('src', 'zhunqi/index.html');
		}
		$(frame).appendTo($('#TreeFrameSet'));
	});
})();
```

### ps

注册表中指定RenderInGcfUrls的方法也是无效的，原因估计等同于指定meta tag的方法。

