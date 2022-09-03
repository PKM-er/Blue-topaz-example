---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


Global tag list

```
// 全局tag列表
dv.paragraph(
  dv.pages("").file.tags.distinct().map(t => {return `[${t}](${t})`}).array().join(" | ")
)
```
