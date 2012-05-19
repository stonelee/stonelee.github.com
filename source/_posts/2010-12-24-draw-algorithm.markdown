---
layout: post
title: 算法时间复杂度直观展示
category: python
---

整天看算法复杂度说什么冒泡排序o(N*N)，快排o(NlogN)，今天有空实际画了下，还真是差别挺大的。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
n = np.arange(0, 10, 1)

s1 = n**2
s2 = n*np.log(n)
plt.plot(n, s1, 'b-', n, s2, 'r-')
plt.legend((r'$n^2$', 'nlog(n)'), shadow = True)

plt.show()
```

 效果：

![](/images/blog/algorithm.png)
