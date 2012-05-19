---
layout: post
title: vim最佳插件实践
comments: true
category: vim
---

基本都是直接复制到bundle，然后添加doc帮助 

```
：helptags ~/.vim/bundle/something/doc
```

## [pathogen](http://www.vim.org/scripts/script.php?script_id=2332) 将插件按文件夹放置，方便管理 

将pathogen放到autoload下 

.vimrc: 

```vim
filetype off
call pathogen#runtime_append_all_bundles()"方便管理plugin
filetype plugin indent on
```

## [python增强语法高亮](http://www.vim.org/scripts/script.php?script_id=790)

## [python增强编辑](http://www.vim.org/scripts/script.php?script_id=30)

会提供一个python菜单，快捷键也相应提供了 

## [minibufexpl](http://www.vim.org/scripts/script.php?script_id=159)多标签切换 

.vimrc: 

```vim
"<C-hjkl>minibuffer中移动
let g:miniBufExplMapWindowNavVim = 1
"<C-TAB> and <C-S-TAB> 直接在当前窗口切换buffer
let g:miniBufExplMapCTabSwitchBufs = 1
"防止与Taglist冲突
let g:miniBufExplModSelTarget = 1
```

## [NERDCommenter](http://www.vim.org/scripts/script.php?script_id=1218)自动注释 

```
<leader>c<space>来切换注释与否
```

## [NERDTree](http://www.vim.org/scripts/script.php?script_id=1658)树状菜单 

.vimrc: 

```vim
map <leader>e :NERDTreeToggle<cr>
let NERDTreeIgnore=['.vim$', '\~$', '.*\.pyc$', 'pip-log\.txt$']
```

```
<leader>e来切换树形菜单显示与否 
```

## [xptemplate](http://code.google.com/p/xptemplate/) Snippet Template engine 
支持嵌套，支持同文件多模板识别 

```
<C-\>显示模板，<Tab><S-Tab>切换焦点 
```

自己更改模板： 
ftplugin下找到对应模板文件，添加新的模板 

去掉多余空格： 
.vimrc: 

```vim
let g:xptemplate_vars = "SParg="
```

## Ack 目录文件中查找字符 

安装Ack: 

```bash
sudo apt-get install ack-grep
```

安装 [Ack](https://github.com/mileszs/ack.vim)插件 
.vimrc: 

```vim
let g:ackprg="ack-grep -H --nocolor --nogroup --column"
```

Ack something可以在当前目录查找字符 

## [zencoding](http://www.vim.org/scripts/script.php?script_id=2981)扩展html 

```
<C-y>, 扩展 
<C-y>n <C-y>N 到下/上一个输入点 

<C-y>d <C-y> D选中 
<C-y>j 简写标签，也可扩展 

<C-y>i img上使用可以自动添加宽高 
<C-y>a 在连接上可以添加a标签 
```

## [YankRing](http://www.vim.org/scripts/script.php?script_id=1234)增强型粘贴 

```
:YRShow显示剪贴板 

<C-p> <C-n> 轮番切换剪贴板 
```

## [translate](http://www.vim.org/scripts/script.php?script_id=2996)

```
:Trans翻译光标所在文字 
```

## [surround](http://www.vim.org/scripts/script.php?script_id=1697)增删改标签 

```
ds“ 删除两端的”“ 
dst 删除两端的标签 
cs”{ 将两端的“”改为{  } 有空格 
cs”} 将两端的“”改为{} 无空格 
yss) 两端加上() 
ysiw） 将光标所在单词两端加上（） 
配合repeat实现.重复操作 
```

## [slime](https://github.com/jpalardy/dotfiles/raw/master/vim/plugin/slime.vim)测试代码段 

终端中建立一个screen 

```bash
screen -S devshell
python

选中代码，<C-c><C-c>可以在screen中查看运行情况。 
```

screen的使用可以参看： 
http://hi.baidu.com/ubuntu2me/blog/item/ce61b23798a5a93b0b55a960.html 
http://wiki.ubuntu.org.cn/GNUScreen 
http://www.9usb.net/201002/linux-screen-mingling.html 

## [pep8](http://www.vim.org/scripts/script.php?script_id=2914)代码静态检查 

需要先安装工具 "pep8":http://github.com/cburroughs/pep8.py 
F5 安装pep8规则检查代码 

## [jpythonfold](http://www.vim.org/scripts/script.php?script_id=2527)代码折叠 

需要重命名为python.vim 
.vimrc中： 

```vim
nnoremap <space> za
```

空格 折叠、打开代码段 
zr 打开所有折叠 
zm 所有折叠 

js代码折叠 

```vim
let javaScript_fold=1 
```

## [ctags](http://ctags.sourceforge.net/)+ [taglist](http://www.vim.org/scripts/script.php?script_id=273)展示代码结构 

安装ctags，在要生成tags的目录下ctags -R 
安装taglist插件 

```vim
:TlistToggle切换tags显示与否 
```

## [tasklist](http://www.vim.org/scripts/script.php?script_id=2607)显示todo列表 

```vim
<leader>t 打开todo列表 
```
