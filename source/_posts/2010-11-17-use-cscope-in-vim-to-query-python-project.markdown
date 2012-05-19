---
layout: post
title: windows使用vim插件cscope查询python项目
category: vim
---

cscope可以方便的查找函数在哪里被调用，或者标签在哪些地方出现过，vim可以对其进行很好的集成。 

1. 首先确保vim支持cscope，否则需要重新编译一下。 
2. 下载cscope的windows版本，将其解压缩，然后设置到环境变量里。 
3. 下载vim插件 [cscope_maps](http://cscope.sourceforge.net/cscope_maps.vim) ，放到plugin里。 
4. 生成索引数据库文件。默认情况下cscope只认识c文件，为了保证我可爱的python使用，需要自己生成files文件来告诉cscope。windows下没有好用的find命令，所以自己写个，代码如下： 

```python
'''生成cscope.files并生成out文件
'''
__revision__ = '0.1'
__author__ = 'lxd'

PATH= r'C:\Users\lxd\Desktop\register'
FILE_TYPE_LIST= ['py']

if __name__ == '__main__':
    import os
    f = open('cscope.files','w')
    for root,dirs,files in os.walk(PATH):
        for file in files:
            for file_type in FILE_TYPE_LIST:
                if file.split('.')[-1] == file_type:
                    f.write('%s\n' %os.path.join(root,file))
    f.close()
    cmd = 'cscope -bk'
    os.system(cmd)
```

使用时需要将这个文件放到项目目录下，然后更改PATH路径，程序会自动生成cscope.files文件和cscope.out文件，其中cscope.out就是要使用的索引了。 

5.打开vim，

```
:cscope add cscope.out
```

数据库就成功添加了。 

@现在在函数名上ctrl+\ 然后s@  
函数调用都出来了吧... 

