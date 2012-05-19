---
layout: post
title: DotNetBar中ComboTree显示整条路径信息
comments: true
category: csharp
---

## 背景

ComboTree是个可以显示树状下拉菜单的ComboBox控件，弹出菜单如下所示：

```
Tree
     — node
     — node
```

点击节点node，默认显示结果为node，即仅仅是节点信息。
现在需求是要显示Tree node，即返回整条路径信息。

## 思路

看上去很简单的样子，在选择事件中得到该节点的父路径信息，然后设置ComboTree的Text值即可。
嗯嗯！我擦！Text没用！！

## 换个思路

更改显示节点，即SelectedNode的Text，这下行了。ComboBox显示成功，但问题是原来节点的信息也被更改了，导致树变得很难看。没办法，在弹出菜单出现时再改回去，弹出菜单出现时改回来吧！真是个丑陋的做法！

![](/images/blog/combobox.gif)

## 无代码无真相

主要是用Tag来存储内部信息，没什么技术含量~ 

```c#
//显示整个路径信息  
private void showFullText()  
{  
    string strPaths = "";  
    comboTreeDate.SelectedNode.FullPath.Split(';').ToList().ForEach(s => strPaths += s);  
    Node thisNode = comboTreeDate.SelectedNode;  
    //存储原值  
    comboTreeDate.Tag = thisNode;  
    thisNode.Tag = thisNode.Text;  
    //更改text  
    thisNode.Text = strPaths;  
}  
  
private void comboTreeDate_PopupShowing(object sender, EventArgs e)  
{  
    //改回原值  
    Node thisNode= comboTreeDate.Tag as Node;  
    if (thisNode!=null)  
        thisNode.Text = thisNode.Tag.ToString();  
}  
  
private void comboTreeDate_PopupClose(object sender, EventArgs e)  
{  
    showFullText();  
}  
```
