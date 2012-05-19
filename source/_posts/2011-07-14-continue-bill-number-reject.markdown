---
layout: post
title: 连续票号剔除算法
comments: true
category: csharp
---

## 问题场景

现有票据0-999，单位A领取前100张（0-99），单位B领取之后100张(100-199),单位C也领取100张(400-499),求剩下的票号段

```
原来： 0-999
领取： 0-99 100-199 400-499
===========运算求解======================
剩余： 200-399 500-999
```

## 分析

如果单纯分析这个问题，此时票据只有1000张，数量很少，因此只需要将每个票号放到一个set中，然后进行简单的集合运算即可求出结果。

但是现实系统中票据量往往很大(9位票据就是近10亿条记录)，每张票据一条记录进行存储是不现实的，因此需要进行分段存储，即将一次领取的几本票据（票号连续）作为一条记录，只记录起始票号和终止票号，运算时因为内存空间有限，也不能整体集合求解，需要另辟蹊径。

既然是边界条件判断，如果用各种if应该可以解决问题，但是这样太繁琐，非常容易出错。今天早上忽然想到，这个问题中票号是连续的，因此只要找到前后几个关键点，整段票号就能确定，而段内的票号是不重要的。

## 算法

1.找到全部关键点

原来的号：0 999

每段领取号各向外扩展一个号，作为可能的关键点：
-1 100 99 200 399 500

2.将上两种关键点放到一个数组中，去重复排序，得到：
-1 0 99 100 200 399 500 999

3.去掉领取号中重复的点，剩余：
-1 200 399 500 999

4.只取原来范围内的点，剩余
200 399 500 999

5.两两一组，即为所求解
(200,399),(500,999)

## c#技巧

* HashSet可以去重复，也可使用Distinct
* 引入Linq后，数组可以进行集合运算。交集Intersect，差集Except，联集Union
* 数组只能存储相同类型的数据
* 二维数组和交错数组是不同的，二维数组形如int[,],GetLength(0)可获得第0维长度，依次类推
* 需要筛选操作的话，使用交错数组string[][]，而不要使用多维数组int[,]

## 无码无真相

```c#
//从父表票号段中剔除子表中的票号段  
public static int[,] getLeftNums(int[,] fathers, int[,] sons)  
{  
    //填入所有可能的关键点  
    //HashSet可去重复  
    HashSet<int> possibleSets = new HashSet<int>();  
    foreach (int i in fathers)  
        possibleSets.Add(i);  
    for (int i = 0; i < sons.GetLength(0); i++)  
    {  
        possibleSets.Add(sons[i, 0] - 1);  
        possibleSets.Add(sons[i, 1] + 1);  
    }  
  
    //去掉sons中已经使用过的点  
    HashSet<int> sonSets = new HashSet<int>();  
    foreach (int i in sons)  
        sonSets.Add(i);  
    IEnumerable<int> withoutSonsSets = possibleSets.Except(sonSets);  
  
    //只取fathers范围内的点  
    HashSet<int> inFatherSets = new HashSet<int>();  
    foreach (int value in withoutSonsSets)  
    {  
        for (int i = 0; i < fathers.GetLength(0); i++)  
        {  
            if (value >= fathers[i, 0] && value <= fathers[i, 1])  
            {  
                inFatherSets.Add(value);  
                break;  
            }  
        }  
    }  
  
    //排序  
    List<int> sortedLists = inFatherSets.OrderBy(i => i).ToList<int>();  
  
    //两两一组  
    int[,] results = new int[sortedLists.Count() / 2, 2];  
    for (int i = 0; i < sortedLists.Count(); i++)  
    {  
        int index = i / 2;  
        if (i % 2 == 0)  
            results[index, 0] = sortedLists[i];  
        else  
            results[index, 1] = sortedLists[i];  
    }  
    return results;  
}  
```

## 测试用例

```c#
[Test]  
public void getLeftNum2()  
{  
    int[,] fathers = new int[1, 2] { { 0, 999 } };  
    int[,] sons = new int[3, 2] { { 0, 99 }, { 100, 199 }, { 400, 499 } };  
    int[,] results = frmQueryBillDistribute.getLeftNums(fathers, sons);  
  
    int[,] asserts = new int[2, 2] { { 200, 399 }, { 500, 999 }};  
    Assert.AreEqual(results, asserts);  
}  
```
