---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


Tags by Top Level Directories

```
// 最高文件夹级别tag列表
for (let group of dv.pages("").filter(p => p.file.folder != "").groupBy(p => p.file.folder.split("/")[0])) {
  var content = dv.pages(`"${group.key}"`).file.tags.distinct().map(t => {return `[${t}](${t})`}).array().sort().join(" | ");
  if (content) {
  dv.paragraph(`## ${group.key}`);
    dv.paragraph(content);
  }
}
```

Tags by Top Level Directories