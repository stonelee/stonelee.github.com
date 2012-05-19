---
layout: post
title: matpoltlib绘制爱的方程式
category: python
---

灵感来自 [http://www.matrix67.com/blog/archives/85](http://www.matrix67.com/blog/archives/85) 

使用matplotlib绘制二维图形，使用contour来绘制方程，省去了手工计算的麻烦，解决思路参见
[http://stackoverflow.com/questions/2484527/is-it-possible-to-plot-implicit-equations-using-matplotlib](http://stackoverflow.com/questions/2484527/is-it-possible-to-plot-implicit-equations-using-matplotlib)

效果：

![](/images/blog/love_equation.jpg)

```python
import numpy as np
import matplotlib.pyplot as plt

X = np.arange(-5.0, 5.0, 0.1)
Y = np.arange(-5.0, 5.0, 0.1)
x, y = np.meshgrid(X, Y)
f = 17 * x ** 2 - 16 * np.abs(x) * y + 17 * y ** 2 - 225

plt.figure()
CS = plt.contour(x, y, f, 0, colors='r')
plt.title(r'$17x^2-16|x|y+17y^2=255$')
plt.show()
```

但是对于3D版 [http://www.matrix67.com/blog/archives/223](http://www.matrix67.com/blog/archives/223) ，小弟还没有找到优雅的求解方法，期待牛人的解答。
