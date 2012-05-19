---
layout: post
title: LINQ方式实现学生成绩汇总（右连接、聚合函数）
comments: true
category: csharp
---

## 需求

从数据表students中取得所有学生姓名，然后将其scores表对应中的分数相加，显示一个“姓名：分数”的列表

* 取得所有姓名（包括没有成绩的）
* 分数是该学生所有成绩的总和

先看效果图：

![](/images/blog/score.gif)

数据库结构简化模拟如下：

```c#
class Student  
{  
    public int id { get; set; }  
    public string name { get; set; }  
}  
class Score  
{  
    public int StudentId { get; set; }  
    public int score { get; set; }  
}  
```

插入测试数据：

```c#
Student p1 = new Student() { id = 1, name = "张三" };  
Student p2 = new Student() { id = 2, name = "李四" };  
Student p3 = new Student() { id = 3, name = "王五" };  
Score s1 = new Score() { StudentId = 1, score = 80 };  
Score s2 = new Score() { StudentId = 1, score = 90 };  
Score s3 = new Score() { StudentId = 2, score = 70 };  
List<Student> students = new List<Student>(new Student[] { p1, p2, p3 });  
List<Score> scores = new List<Score>(new Score[] { s1, s2, s3 });  
```

查询，注意：

* LINQ中没有left join和right join之分，只有关键词join来控制连接，join之前表的作为完整的表连接，join之后的表需要使用DefaultIfEmpty来进行处理，才能正常的显示null值
* group中的key是分组的字段，分组后就可以使用聚合函数了
* LINQ就像生产流水线，可以分阶段进行数据排序、汇总、投影等操作，最后组装起来就能达到预定的效果

```c#
//left join,返回左边每一个元素  
var studentsTable = from student in students  
                    join score in scores on student.id equals score.StudentId into joinedTable  
                    from j in joinedTable.DefaultIfEmpty()//处理右边为空的情况  
                    select new  
                    {  
                        name = student.name,  
                        score = j != null ? j.score : 0  
                    };  
//聚合函数  
var data = from student in studentsTable  
           group student by student.name into g  
           select new  
           {  
               name = g.Key,  
               score = g.Sum(student => student.score)  
           };  
foreach (var d in data)  
{  
    Console.WriteLine("name:" + d.name + ";score:" + d.score.ToString());  
}  
Console.ReadLine();  
```

看看效果：

```c#
foreach (var d in data)  
{  
    Console.WriteLine("name:" + d.name + ";score:" + d.score.ToString());  
}  
Console.ReadLine();  
```
