---
layout: post
title: windows下python打包完整解决方案
category: python
---

最近想把写的python代码打包，以供没用安装python环境的同事使用，需求如下： 

* 无python环境也可执行
* 文件尽量少，不要太乱
* 程序体积尽量小
* 如果需要更新的话重复类库不用更新

采用方案如下： 

1. 使用py2exe自动导入类库
2. 使用7-ZIP压缩library
3. upx压缩dll等文件
4. nsis生成安装文件
5. 采用md5验证的方式判别不用更新的类库

## 使用py2exe自动导入类库 

建立文件bin_setup.py 

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'lxd'

from distutils.core import setup  
import py2exe  
import sys

# If run without args, build executables, in quiet mode.
if len(sys.argv) == 1:
    sys.argv.append("py2exe")
    sys.argv.append("-q")

INCLUDES = []

MANIFEST_TEMPLATE = """
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <assemblyIdentity
    version="5.0.0.0"
    processorArchitecture="x86"
    name="%(prog)s"
    type="win32"
  />
  <description>%(prog)s</description>
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel
            level="asInvoker"
            uiAccess="false">
        </requestedExecutionLevel>
      </requestedPrivileges>
    </security>
  </trustInfo>
  <dependency>
    <dependentAssembly>
      <assemblyIdentity
            type="win32"
            name="Microsoft.VC90.CRT"
            version="9.0.21022.8"
            processorArchitecture="x86"
            publicKeyToken="1fc8b3b9a1e18e3b">
      </assemblyIdentity>
    </dependentAssembly>
  </dependency>
  <dependency>
    <dependentAssembly>
        <assemblyIdentity
            type="win32"
            name="Microsoft.Windows.Common-Controls"
            version="6.0.0.0"
            processorArchitecture="X86"
            publicKeyToken="6595b64144ccf1df"
            language="*"
        />
    </dependentAssembly>
  </dependency>
</assembly>
"""
RT_MANIFEST = 24

options = {"py2exe" :
    {"compressed" : 1,
     "optimize" : 2,
     "bundle_files" : 2,
     "includes" : INCLUDES,
     "excludes" : ["Tkinter",],
     "dll_excludes": [ "MSVCP90.dll", "mswsock.dll", "powrprof.dll"] }}

windows = [{"script": "bin.py",
      "icon_resources": [(1, "bin.ico")],
      "other_resources" : [(RT_MANIFEST, 1,
                        MANIFEST_TEMPLATE % dict(prog="MyAppName"))],
      }]

setup(name = "MyApp",
      version = "1.0",
      description = "Description of the app",
      author = "Author Name",
      author_email ="author@project.com",
      maintainer = "Maintainer Name",
      maintainer_email = "you@project.com",
      license = "wxWindows Licence",
      url = "http://projecthomepage.com",

      data_files = ["MSVCR90.dll", "gdiplus.dll"],
      #data_files=[("img",[r"d:\test\1.gif",r"d:\test\2.gif"]),("xml",[r"d:\test\1.xml",r"d:\test\2.xml"])])
      #zipfile=None,
      options = options,
      windows = windows,
      )
```

## 使用7-ZIP压缩library,使用upx压缩dll等文件 

建立脚本bin.cmd 

```bat
@echo off

::Set personal Path to the Apps:
set PythonEXE=D:\Python26\python.exe
set SevenZipEXE="D:\Program Files\7-ZIP\7z.exe"
set UpxEXE="D:\Program Files\upx\upx.exe"

:: Compress=1 - Use CompressFiles
:: Compress=0 - Don't CompressFiles
set Compress=1

if not exist %~dpn0.py          call :FileNotFound %~dpn0.py
if not exist %PythonEXE%        call :FileNotFound %PythonEXE%
if not exist %SevenZipEXE%      call :FileNotFound %SevenZipEXE%
if not exist %UpxEXE%           call :FileNotFound %UpxEXE%

::Compile the Python-Script
%PythonEXE% "%~dpn0_setup.py" py2exe
if not "%errorlevel%"=="0" (
        echo Py2EXE Error!
        pause
        goto:eof
)

:: Copy the Py2EXE Results to the SubDirectory and Clean Py2EXE-Results
rd build /s /q
xcopy dist\*.* "%~dpn0_EXE\" /d /y
:: I use xcopy dist\*.* "%~dpn0_EXE\" /s /d /y
:: This is necessary when you have subdirectories - like when you use Tkinter
rd dist /s /q

if "%Compress%"=="1" call:CompressFiles
echo.
echo.
echo Done: "%~dpn0_EXE\"
echo.
pause
goto:eof

:CompressFiles
        %SevenZipEXE% -aoa x "%~dpn0_EXE\library.zip" -o"%~dpn0_EXE\library\"
        del "%~dpn0_EXE\library.zip"

        cd %~dpn0_EXE\library\
        %SevenZipEXE% a -tzip -mx9 "..\library.zip" -r
        cd..
        rd "%~dpn0_EXE\library" /s /q

        cd %~dpn0_EXE\
        %UpxEXE% --best *.*
goto:eof

:FileNotFound
        echo.
        echo Error, File not found:
        echo [%1]
        echo.
        echo Check Path in %~nx0???
        echo.
        pause
        exit
goto:eof
```

## 使用方法 

直接运行bin.cmd，程序会自动调用bin_setup.py来查找需要的类库，然后对类库文件进行压缩，生成的可执行文件在bin_EXE里。 

## 问题

我在打包的时候，出现错误“ImportError: MemoryLoadLibrary failed loading win32api.pyd”，用depends.exe查看其引用，然后多方搜索得知，其原因是py2exe错误的加载了mswsock.dll，powrprof.dll这两个文件，因此将它们排除即可。 

```python
"dll_excludes": [ "MSVCP90.dll", "mswsock.dll", "powrprof.dll"] }}
```

## nsis生成安装文件 

待续。。。 
