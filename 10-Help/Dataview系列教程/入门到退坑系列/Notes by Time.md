---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

Notes by Time

```
for (let g of dv.pages('').groupBy(p => p.file.cday).array().reverse()) {
  dv.header(3, g.key);
  dv.paragraph(g.rows.file.link);
}
```
