---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


Global Tags and Tagged Files

```
for (var tagname of dv.pages("").file.tags.distinct()) {
  dv.header(3, tagname.substring(1));
  dv.table(
    ["File", "Created"],
    dv.pages(tagname).sort(p => p.file.ctime).map(p => { return [p.file.link, p.file.ctime] })
   );
}
```
