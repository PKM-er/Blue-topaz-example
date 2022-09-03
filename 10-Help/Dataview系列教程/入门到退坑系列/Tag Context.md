---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
List all tags and display their mention context.

Only works for inline tagging -- will ignonre yaml tagging.

```
for (var tag of dv.pages("").file.tags.distinct().map(p => p.substring(1))) {
var dvfiles = dv.pages(`#${tag}`);
var result = [];
for (var dvfile of dvfiles) {
var thisTFile = this.app.vault.getAbstractFileByPath(dvfile.file.path);
var content = thisTFile.unsafeCachedData;
for (var line of content.split(/\r?\n/)) {
if (line.includes(`#${tag}`)) {
result.push([dvfile.file.link, line]);
}
}
}
dv.header(4, tag);
dv.table(["File", "Line"], result);
}
```