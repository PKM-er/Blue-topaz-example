---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
Given a filename and a section name, "embed" the target section.

Note: this will only embed the section's immediate content, i.e. between the current and next header, no matter the level.

I don't really know the point of this thing, just to prove it's possible.

```
const file = "瑕光";
const section = "天赋";

function getSectionFromFile(app, filename, section) {
var dvfile = dv.page(filename);
var tfile = app.vault.getAbstractFileByPath(dvfile.file.path);
var headings = app.metadataCache.getFileCache(tfile).headings;
var position;
for (var i = 0; i < headings.length; i++) {
var heading = headings[i];
if (heading.heading == section) {
if (i == headings.length - 1) {
position = [heading.position.start.line, -1];
} else {
position = [heading.position.start.line, headings[i + 1].position.start.line];
}
}
}
if (position) {
return tfile.unsafeCachedData.split("\n").slice(position[0] + 1, position[1]).join("\n");
}
return "";
}

dv.paragraph(getSectionFromFile(this.app, file, section));
```