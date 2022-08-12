---
created: 2022-08-09 09:10:15
---

%%列出还未创建出文件的正向链接%%

### 列出还未创建出文件的正向链接
```dataview
TABLE outlinks as MissingLinks
FROM !"88-Template"
FLATTEN file.outlinks as outlinks
WHERE !(outlinks.file) AND !(contains(meta(outlinks).path, "/"))

```

### 孤岛笔记 （不显示只被moc链接的笔记 和引用图片的笔记 ）
```dataview
TABLE file.folder
FROM -"88-Template"
WHERE choice(contains(file.inlinks.file.tags, "#moc"), all(file.inlinks, (l) => contains(l.file.tags, "#moc")), !file.inlinks) AND !file.outlinks
Sort file.link
```
### 孤岛笔记--dvjs版本

```dataviewjs
dv.list(dv.pages('').where(
  p => p.file.outlinks.filter(l => l.path.endsWith(".md")).every(
    l => dv.page(l.path).file.tags.includes("#moc")
  ) && p.file.inlinks.filter(l => l.path.endsWith(".md")).every(
    l => dv.page(l.path).file.tags.includes("#moc")
  ) && !p.file.path.startsWith("88-Template")
).file.link.sort())

```