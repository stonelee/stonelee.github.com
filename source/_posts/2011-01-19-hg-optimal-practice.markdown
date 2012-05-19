---
layout: post
title: hg版本管理最优实践
comments: true
category: develop
---

使用hg不短时间了，但是一直作为个备份工具来用，今天看到几位牛人的hg实践，很受启发，总结如下 
 
![](/images/blog/hg.png)

上图来源于 [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)，利用git来实践基于branch/merge版本管理。 

首先整个项目要有两个主分支：master和develop，其中master是产品发布的主分支，要做到足够稳定，不能轻易修改；而develop是程序员用的开发分支，每日构建要在这个分支上做，也要做到稳定。开发完成后merge到master上并打上版本号tag。 

三个辅助分支：release、feature和hotfix。 

一个新的功能就是一个新的feature分支。 

* May branch off from: develop 
* Must merge back into: develop 
* Branch naming convention: anything except master, develop, release-\*, or hotfix-\* 

功能完成，准备发布，这时启用release分支，来修改小bug，为发布做准备 

* May branch off from: develop 
* Must merge back into: develop and master 
* Branch naming convention: release-\* 

已上线的产品修改bug，启用hotfix分支 

* May branch off from: master 
* Must merge back into: develop and master 
* Branch naming convention: hotfix-\* 

应该说整个流程还是比较繁琐的，该文档是基于git的，[git flow](https://github.com/nvie/gitflow)是一个比较靠谱的简化流程工具，推荐使用。 

我用的是hg，发现也有一个类似的简化工具：[hg flow](https://bitbucket.org/yinwm/hgflow/wiki/Home)，试用了一下感觉不错~ 

使用方法： 
在没有版本管理的工程中

```bash
hg init#建立hg仓库
hg flow init#初始化hg flow，自动生成default(master)和develop分支
```

要新增功能的时候，name随意

```bash
hg flow feature start <name>#新建功能分支，会自动切换到该分支上
```

新增功能

使用TortoiseHg的 Repository Explorer查看目前所处分支状况,
使用TortoiseHg的commit提交功能

功能完成的时候

```bash
hg flow feature finish <name>#功能完成后使用，会自动merge到develop分支上
```

如果要添加新的功能：重复上两个步骤

如果同时开了多个功能，切换不同功能开发的时候要先切换到该功能的分支

```bash
hg flow feature change <name>#切换当前分支
```

到达预定的功能发布点，name：release-版本号

```bash
hg flow release start <name>
hg flow release finish <name>
```

只在修改小型bug时使用，如果在hotfix上新建feature的话会导致直接从develop上开分支，hotfix的更改会暂时隐藏，只有在hotfix finish的时候才能merge。
name：hotfix-版本号.hotfix号

```bash
hg flow hotfix start <name>
hg flow hotfix finish <name>
```

feature和release要一块使用
hotfix自己单独使用，不需要再release了

