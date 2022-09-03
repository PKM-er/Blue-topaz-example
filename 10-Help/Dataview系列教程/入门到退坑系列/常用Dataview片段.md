---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

首先，对于每个文件都一定有的非用户自定义的属性：[[Dataview Learnings#file属性]]。
### 文件名等文件属性排序
### 倒序
```
.sort(p => p.file.name, 'desc')  # 默认升序是'asc'
```
### 中文排序
```
.sort(p => p.file.name, 'asc', (a, b) => a.localeCompare(b, 'zh-CN'))
```
### 筛选
```
.filter(p => p.file.name == "xxxx")
```
只有根据圆括号里的表达式判定为真的文件才会被选中。  
筛选既可以用布尔运算符一次性处理，也可以多个筛选连续衔接。
```
.filter(p => p.file.name != "xxxx")
.filter(p => p.file.tags.includes('#yyyy'))
```
### 按格式显示时间
Dataview内部的时间记录使用的是[Luxon](https://moment.github.io/luxon/#/tour)。
```
var time = dv.current().file.ctime;
dv.paragraph(time.toFormat("yy-MM-dd H:mm:ss a"));
```
### 创建当前时间点
`luxon.DateTime.now()`
### 创建指定时间点
```
luxon.DateTime.fromISO("2017-09-24")
```
### 时间先后
```
var now = luxon.DateTime.now();
var past = luxon.DateTime.fromISO("2017-09-24");
dv.paragraph(past < now);
```
### 判定同一天/同时
`time1.equals(time2)`
注意Luxon时间对象因为不是基础类型，不能用 `a == b` 或者 `a === b`来对比；对比日期时不要用 `ctime/mtime`，用 `cday/mday`。
### 时间差
```
var end = DateTime.fromISO('2017-03-13'); 
var start = DateTime.fromISO('2017-02-13'); 
var i = Interval.fromDateTimes(start, end);
i.length('days'); //=> 28
i.length('months') //=> 1
```
