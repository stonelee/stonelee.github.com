---
layout: post
title: 多Excel文件导入到一个word
category: office
---

## 需求

多个Excel分布在不同文件夹下，每个Excel又有多个sheet表，现在需要把这些Excel一起汇总到一个word里。 

## 探索

直接复制粘贴既麻烦又无聊，上网搜所相关方法竟然没有，难道我这个需求很少见吗？找到一个国外软件[ExcelConverter](http://www.coolutils.com/totalexcelconverter)（售价$49.9）,发现转换后货币格式的文字完全变成乱码。还是自己写吧，编码测试花了两个小时搞定。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Last Update:

'''covert many excel files to one word file
'''

__revision__ = '0.1'
__author__ = 'lxd'

from win32com.client import Dispatch
import os

wdPageBreak = 7

def isExcelFile(name):
    return os.path.isfile(name) and os.path.splitext(name)[1] == '.xls'

def filesInDir(dir):
    #generate absolute paths of files in a directory
    for root, dirs, files in os.walk(dir):
        for file in files:
            yield os.path.join(root, file)

def findExcels(names):
    for name in names:
        if isExcelFile(name):
            yield name
        else:
            for file in filesInDir(name):
                if isExcelFile(file):
                    yield file

class ExcelToWord(object):
    def __init__(self, excelNames, wordName):
        self._createExcel()
        self.excelNames = findExcels(excelNames)

        self._createWord()
        self.word.Documents.Open(wordName)

    def _createExcel(self):
        self.excel = Dispatch('Excel.Application')
        #self.excel.Visible = True
        self.excel.DisplayAlerts = False

    def _createWord(self):
        self.word = Dispatch('Word.Application')
        self.word.Visible = True
        self.word.DisplayAlerts = False

    def process(self):
        for excelName in self.excelNames:
            print 'coverting', excelName
            self.excel.Workbooks.Open(excelName)
            for i in range(self.excel.Worksheets.count):
                self.excel.Worksheets(i+1).Select()#start from 1
                self._copy()
                self._paste()
            self.excel.Workbooks.Close()
        self.excel.Quit()
        print 'covert is over'

    def _copy(self):
        # select all contents in one sheet and copy
        self.excel.Cells.Select()
        self.excel.Selection.Copy()

    def _paste(self):
        #paste to one word file and add a page break
        self.word.Selection.Paste()
        #self.word.Selection.TypeParagraph()
        self.word.Selection.InsertBreak(wdPageBreak)

if __name__ == '__main__':
    excelNames = [
                u'c:\\users\\lxd\\desktop\\文档', 
                u'c:\\users\\lxd\\desktop\\汇总.xls',]
    wordName = r'c:\users\lxd\desktop\1.doc'
    e = ExcelToWord(excelNames, wordName)
    e.process()
```
