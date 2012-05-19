---
layout: post
title: LINQ流水线
comments: true
category: csharp
---

linq帅呆了~这一刻函数编程附身

```c#
//处理废票文本框中用户的输入
private List<int> getDirtyNumList(int startNum, int endNum, string txtDirtyNums)
{
    return txtDirtyNums.Trim(new char[] { ' ', ',', '，' })//去掉头尾的空格或者逗号
                        .Split(new char[] { ',', '，' })//将字符串分割为数组
                        .Where(key => Regex.IsMatch(key, @"^\d+{1}quot;))//数字
                        .Select(key => Convert.ToInt32(key))//转格式
                        .Where(key => key >= startNum && key <= endNum)//必须在范围内
                        .OrderBy(key => key)//排序
                        .Distinct()//去重复
                        .ToList();
}
```

