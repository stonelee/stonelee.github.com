---
layout: post
title: python调用VBA心得
category: python
---

接上篇，在继续优化过程中发现几个问题，记述如下： 

### 更改表格某行的字体，如果此表格中有合并单元格，会报错： 

```
"无法访问此集合中单独的行，因为表格有纵向合并的单元格。"
```

经研究，不能使用如下语句 

```python
word.Selection.Tables[0].Rows[0]
```

解决方案： 

```python
word.Selection.Tables[0].Cell(1,1).Select()
word.Selection.SelectRow()
word.Selectin.Range.Font.Size=18
```

很多操作都可以用“先选择再操作”的方法来间接实现。 

但是要注意，使用Select前后一定要保存好鼠标的位置 

```python
pos = word.Selection.Range.Start
```

在操作完后要恢复鼠标。 

```python
word.Selection.SetRange(pos, pos)
```

### 如果想使用constants里的word常量，应该使用makepy 

```python
word = win32com.client.gencache.EnsureDispatch('Word.Application')
```

然后就可以像这样调用了 

```python
word.Selection.InsertBreak(constants.wdPageBreak)
```

[这里有篇讲COM高级用法的文章](http://oreilly.com/catalog/pythonwin32/chapter/ch12.html)，值得一看 

### Selection返回的貌似是刚操作的元素 

### Tables(1)和Tables[ 0]是一样的 

### 对于大的文件，会在执行VBA的过程中显示“拼写或语法错误太多”这样的对话框，这会影响脚本的正常运行，解决方法是在打开文件后

```python
word.ActiveDocument.GrammarChecked = True
word.ActiveDocument.SpellingChecked = True
```

### 性能优化 

在文档很大的情况下，word的自动分页等可视化步骤会极大地减慢速度，因此需要将不必要的功能暂时去掉。 

```python
word.ActiveDocument.View = constants.wdNormalView
word.ActiveDocument.Application.Options.Pagination = False
word.ActiveDocument.Application.ScreenUpdating = False
```

原来完整格式化一段表格需要100多s，现在只需58s了，有意思的是，如果将word的Visible设为False，速度反而有所下降。估计是操作系统自动将后台操作程序的CPU和内存使用优先级下调的缘故。 

