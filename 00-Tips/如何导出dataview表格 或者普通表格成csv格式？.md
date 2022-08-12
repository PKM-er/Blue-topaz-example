---
author: cuman
update:  2022年6月9日15:47:19
---
## 前言
由于dataview的本身特性限制，dv生成的表格只能实时渲染数据，内容是无法保存的，本文通过两个办法实现导出dv 表格或者粘贴dv表格。
## 实现方法
### 方法一
1. 安装插件[table-to-csv-exporter](obsidian://show-plugin?id=obsidian-table-to-csv-exporter) 建议使用示例库自带的版本，解决了导出中文乱码问题，支持页面多个表格导出。
2. 对要导出的页面，`ctrl+p`运行命令`export table to csv` 即可自动生成csv，
3. 如果开启了[table-to-csv-exporter](obsidian://show-plugin?id=obsidian-table-to-csv-exporter)插件的复制到剪贴板选项，并且安装有增强编辑插件。`ctrl+alt+v` 即可把dataview表格粘贴到笔记中。
4. 
### 方法二
通过dataview插件，设置查询条件，查询到数据自动生成表格，代码如下
自己把代码换成dataviewjs，并更换`<source>`查询条件，`<field1>`为查询字段即可。
```js
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
