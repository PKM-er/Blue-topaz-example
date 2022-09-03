---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

```
const folder = "";
function getFirstSectionFromFile(app, filename) {
var dvfile = dv.page(filename);
var tfile = app.vault.getAbstractFileByPath(dvfile.file.path);
var headings = app.metadataCache.getFileCache(tfile).headings;
if (headings) {
return headings[0].heading;
}
}
var titles = dv.pages(`"${folder}"`).map(p => [p.file.path, getFirstSectionFromFile(dv.app, p.file.name)]).where(r => r[1]).map(t => `[[${t[0]}|${t[1]}]]`);;
dv.list(titles)
```
First Header List