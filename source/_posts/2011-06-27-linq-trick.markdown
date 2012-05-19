---
layout: post
title: LINQ技巧小结
comments: true
category: csharp
---

LINQ可不是简单的SQL语句的替代品，它将繁琐的数据操作（排序、求和、分组、投影、打包）统一起来，极大地简化了代码。

## 查询所有以ABC开头的字符串

```c#
string[] xx={"ABCEFG","ABCASDFASDF","12312ADSFASD"};  
xx.Where(x=>x.StartsWith("ABC")).ToList()
  .ForEach(x=>Console.WriteLine(x));  
```

使用正则来解决

```c#
string[] xx = { "ABCEFG", "abcASDFASDF", "12312ADSFASD" };  
xx.Where(s => Regex.IsMatch(s, "^abc",RegexOptions.IgnoreCase))
  .ToList().ForEach(s =>Console.WriteLine(s));  
```

## 简化字符

```
string source = @"西瓜,1,a
苹果,2,b
橙子,3,c";
结果数组：西瓜,苹果,橙子
```

```c#
string[] array1 = source.Split(new char[] { '/r', '/n' })
                  .Select(x => x.Split(',')[0]).ToArray();  
```
