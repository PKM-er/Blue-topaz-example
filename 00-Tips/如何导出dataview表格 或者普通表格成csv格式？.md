---
author: cuman
update:  2022年6月9日15:47:19
---
## 前言
由于dataview的本身特性限制，dv生成的表格只能实时渲染数据，内容是无法保存的，本文通过两个办法实现导出dv 表格或者粘贴dv表格。
## 实现方法
### 方法一
通过"obsidian-table-to-csv-exporter"插件，实现导出当前页面表格为csv，并自动把表格内容复制在剪贴板上，配合增强编辑插件，按`Ctrl+Alt+V`即可粘贴为表格格式。以上插件示例库均已集成。
### 方法二
通过dataview插件，设置查询条件，查询到数据自动生成表格，代码如下
自己把代码换成dataviewjs，并更换`<source>`查询条件，`<field1>`为查询字段即可。
```
let source = dv.pages("<source>");
const table = source.map(p => [p.<field1>,p.<field2>,p.<field3>]);
let csvContent = "data:text/csv;charset=utf-8," + table.map(e => e.join(",")).join("\n");
var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download","my_data.csv");
document.body.appendChild(link);
link.click();
```
