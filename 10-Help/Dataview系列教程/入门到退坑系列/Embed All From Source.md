---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

Embed All From Source
```
dv.paragraph(dv.pages('"Test"').file.where(f => f.name != dv.current().file.name).map(f => `![[${f.name}]]`).join("\n"));
```

