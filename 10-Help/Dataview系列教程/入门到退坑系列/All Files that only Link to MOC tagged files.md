---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learningshttps://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
所有只链接到MOC标签文件的文件
 
```
dv.list(dv.pages('').where(
  p => p.file.outlinks.filter(l => l.path.endsWith(".md")).every(
    l => dv.page(l.path).file.tags.includes("#moc")
  ) && p.file.inlinks.filter(l => l.path.endsWith(".md")).every(
    l => dv.page(l.path).file.tags.includes("#moc")
  ) && !p.file.path.startsWith("Seedbox")
  && !p.file.path.startsWith("Person")
  && !p.file.path.startsWith("Template")
  && !p.file.path.startsWith("SyncConflict")
).file.link)
```
 s