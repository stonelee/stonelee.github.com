---
layout: post
title: chrome15中无法使用svg的currentScale方法
category: javascript
---

[测试网址](http://stonelee.info/demos/currentscale_bug_in_chrome15/index.html)

已提交bug，待解决

## ps

chrome开发者已添加Labels: -Area-Undefined Area-WebKit

## ps

chrome 13中是可以缩放的，因此继续研究，结果在定点缩放这一功能实现时发现大问题：

放大，即currentScale \*= 1.1时,
当前鼠标的clientX减小，即event.clientX /= 1.1,
但是图形中的点clientX不变

移动，即currentTranslate.x -=10 时,
当前鼠标clientX不变，
但是图形中的点clientX -=10

即缩放是浏览器行为，不改变图形client坐标，而移动是svg行为，会改变图形client坐标。

两者的实现如此不一致，怪不得chrome 15中currentScale失效了，而currentTranslate没有。
Google是不是把资源都放到canvas上了，svg这么明显的bug都不管。。。

firefox下都是图形坐标改变，鼠标不变。很容易就能实现定点缩放功能。

## ps

经反复研究发现，ie端支持svg的Chrome Frame方案不够成熟，该控件体积有20多M，安装需要几分钟，而且时常安装失败，安装体验太差。最重要的是chrome中svg缩放移动条件下鼠标定位与svg坐标换算非常诡异，经两天研究仍无法完美解决，导致无法实现定点缩放功能。页面初次加载也不够快（可能是gcf方式加载的问题），用户体验一般。
所以...放弃...

换用Adobe svg viewer吧。。。
