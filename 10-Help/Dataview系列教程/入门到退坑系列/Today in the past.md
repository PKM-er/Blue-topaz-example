---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


```
dv.table(["File", "Created"],
dv.pages("").where(p => p.file.cday.day === luxon.DateTime.local().day && p.file.cday.month === luxon.DateTime.local().month && p.file.cday.year != luxon.DateTime.local().year).sort(p => p.file.cday).map(p => [p.file.link, p.file.cday]))
```

Today in the past