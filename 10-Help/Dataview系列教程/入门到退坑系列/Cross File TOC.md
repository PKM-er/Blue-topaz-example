---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

target:: 夜莺  
作为举例，修改以上target属性的内容即可指向新的文件并生成对应的ToC。
```
var dvfile = dv.page(dv.current().target);
var thisTFile = this.app.vault.getAbstractFileByPath(dvfile.file.path);
var headings = this.app.metadataCache.getFileCache(thisTFile).headings;
function formatHeadings(filename, headings) {
var output = ""
for (var h of headings) {
output += "  ".repeat(h.level) + " - " + `[[${filename}#${h.heading}|${h.heading}]]` + "\n"
}
return output
}
dv.paragraph(formatHeadings(dvfile.file.name, headings));
```
Cross File TOC

target:: 夜莺  
作为举例，修改以上target属性的内容即可指向新的文件并生成对应的ToC。

```
var dvfile = dv.page(dv.current().target);
var thisTFile = this.app.vault.getAbstractFileByPath(dvfile.file.path);

var headings = this.app.metadataCache.getFileCache(thisTFile).headings;

function formatHeadings(filename, headings) {
var output = ""
for (var h of headings) {
output += "  ".repeat(h.level) + " - " + `[[${filename}#${h.heading}|${h.heading}]]` + "\n"
}
return output
}
dv.paragraph(formatHeadings(dvfile.file.name, headings));
```

Cross File TOC