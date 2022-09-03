---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
## file属性
-   `file.name`: 该文件标题(字符串)。
-   `file.folder`: 该文件所在的文件夹的路径(字符串)。
-   `file.path`: 该文件的完整路径(字符串)。
-   `file.link`: 该文件的一个链接(链接)。
-   `file.size`: 该文件的大小(bytes)(数字)
-   `file.ctime`: 该文件的创建日期(日期和时间)。
-   `file.cday`: 该文件的创建日期(仅日期)。
-   `file.mtime`: 该文件最后编辑日期(日期和时间)。
-   `file.mday`: 该文件最后编辑日期(仅日期)。
-   `file.tags`: 笔记中所有标签组成的数组。子标签按每个级别进行细分，所以`#Tag/1/A`将会在数组中储存为`[#Tag, #Tag/1, #Tag/1/A]`。
-   `file.etags`: 笔记中所有显式标签组成的数组；不同于`file.tags`，不包含子标签。
-   `file.outlinks`: 该文件所有外链(outgoing link)组成的数组。
-   `file.inlinks`: 该文件所有内链(incoming link)组成的数组。
-   `file.aliases`: 笔记中所有别名组成的数组。
-   `file.ext`: 文件扩展名; 比如 '.md' (字符串).
-   `file.tasks`: 笔记中所有任务组成的数组 (例如, `- [ ] blah blah blah`) .
-   `file.lists`: 笔记中列表元素(包含任务列表)组成的数组，这些元素是有效的任务，可以在任务视图中呈现
-   `file.frontmatter`: 动态列出笔记中yaml区域的值。包含所有的键值和对应的值
如果笔记的标题内有一个日期（形式为`yyyy-mm-dd`或`yyyymmdd`），或者有一个`日期`字段/内联字段，它也有以下属性。
-   `file.day`: 一个与文件相关的明确日期。等效于 `date(file.name)`，会试图读取文件名中的日期。读不出来则为空值
-   `file.starred`: 列出星标的文件（需要开启ob中的星标插件）

##  `dv.paragraph` 的内嵌问题
`![[]]` 内嵌页面在`dv.paragraph`里不会正常显示；这是Obsidian API的问题。普通的链接倒是能够顺利显示。（可以显示外部网络连接，也可以显示本地的绝对链接）
## 不要忘记 `.file`
`dv.page` 和 `dv.pages` 返回的都是dv专有的数据结构，且_并不_实际包括用户通常在乎的数据，而是需要加`.file`来获取实际的含有文件信息的数据结构。
```
dv.paragraph("正确的访问方式输出的结果：" + dv.current().file.name);
dv.paragraph("错误的访问方式输出的结果：" + dv.current().name);
```
## 时间类型
dv中返回的时间虽然可以用`dv.paragraph`输出，但是并不是字符串，而是[Luxon的DateTime](https://moment.github.io/luxon/#/tour?id=your-first-datetime)，因此在不清楚对象类型的情况下贸然加减比较的话很容易出问题。因此，如果你要比较一个dv内置的时间对象和某个类似日记文件名这样的字符串的话，需要考虑类型转换。
```
dv.paragraph("表面上看的dv时间信息：" + dv.current().file.ctime);
dv.paragraph("强行cast成字符串的dv时间信息：" + dv.current().file.ctime);
dv.paragraph("相同日期的Luxon时间和字符串相等判断：" + (luxon.DateTime("2020-05-06") == "2020-05-06"));
```
和有强类型的语言不同，当你将不相匹配的数据类型相减的时候，并不会报错。
```
dv.paragraph("一个普通的Date对象和一个dv时间对象相减：" + (Date("2021-05-06") - dv.current().file.cday));
```
所以在用来排序的时候注意不要用这种类型不匹配的时间差。
## Dv中链接类型拥有的属性
```
var link = dv.current().file.outlinks[0];
dv.paragraph(Object.getOwnPropertyNames(link));
dv.paragraph("Path: " + link.path);
dv.paragraph("Embed: " + link.embed);
dv.paragraph("Display: " + link.display);
dv.paragraph("Type: " + link.type);
```
除了以上的几个属性外，link在强制cast成字符串的时候，是`[[{path}|{display name}]]`格式的字符串。
## 自定义属性中的时间日期
如果用户在yaml中写入的属性呈现为时间/日期的格式，比如
```
---
review: 2021-09-22
---
```
那么在使用dv检索时，`review`会实际被转换成时间对象，不能再作为字符串进行对比：比如在筛选时就需要这样：  
`LIST FROM "" WHERE review = date("2021-09-22")` 而不是 `LIST FROM "" WHERE review = "2021-09-22"`。
## 其他小技巧
-   `file.day` 等效于 `date(file.name)`，会试图读取文件名中的日期。读不出来则为空值。这个在DV和DVJS里都适用。
-   `date(now)` 可以在 DV 里用于选定当前时间。
-   `dv.current()` 指的是当前文件；比如`dv.current().file.name`就是当前文件名。
-   DV：`FROM [[#]]` 是个特殊的来源简写方式，代表“选取所有链接到本文的文件为来源”。反之，`FROM outgoing([[#]])` 是“选取所有本文的链接目标为来源”
- `contains`在对于处理字符串数组的时候，不会进行全等对比，而是进行substring查找。`contains(["abc"], "ab"])` returns `true` 要进行全等对比，需要用`econtains`。
- `if` 使用`if`对于存在性进行判定的时候，比如`if (dv.pages("asdfasd").someField)`，要注意：DataArray对象即使是空的，直接进行存在性判定也是`true`。
## 单向链接
Dataview生成的链接并不实际存在，所以也不会计入文件的回（反）链中。  
简单的写法：
`=[[some file]]`
