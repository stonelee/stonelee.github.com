---
layout: post
title: 为tortoisehg出把力
comments: true
category: develop
---

[https://bitbucket.org/tortoisehg/stable/issue/936/importerror-memoryloadlibrary-failed-loading#comment-280484](https://bitbucket.org/tortoisehg/stable/issue/936/importerror-memoryloadlibrary-failed-loading#comment-280484)

开源项目：tortoisehg

bug内容：

```
#936 ImportError: MemoryLoadLibrary failed loading win32api.pyd
Reported by Dmitry Zanozin / dmitryzan, created 10 months ago.
I've received error message on startup of my WinXP after reboot just after install of the latest nightly build tortoisehg-unstable-0.9.35067-hg-1.4.3+67-07bd7608a0ea.exe
There was a suggestion to examine thgtaskbar.exe.log file:
thgtaskbar.exe.log
Traceback (most recent call last):
File "thgtaskbar.py", line 13, in <module>
File "zipextimporter.pyo", line 98, in load_module
ImportError: MemoryLoadLibrary failed loading win32api.pyd
```
 

偶的解决方案：

```
istonelee
written about a month ago
when I use py2exe to create my project,I receive the same error.I analyse the depends of this dll,and found that py2exe makes some mistakes that include mswsock.dll and powrprof.dll into the library. and my solution is modify the setup.py
'dll_excludes': [ "mswsock.dll", "powrprof.dll" ]
hope my experience could be any useful :)
```
 
被作者采纳了：

```
Steve Borho / sborho
written about a month ago
That is interesting that it causes the same error for you. I've added those two and several more DLLs to the dll_excludes list in the setup.cfg file. setup.cfg hasn't changed in 9 months, since 1.0 was released.
http://bitbucket.org/tortoisehg/thg-winbuild/src/tip/misc/setup.cfg
```

So Happy~

 
