---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


```
var thisFile = dv.page(this.currentFilePath).file;
var date;
var parsed = luxon.DateTime.fromISO(thisFile.name);
if (!parsed.isValid) {
date = thisFile.cday;
} else {
date = parsed;
};

var files = dv.pages("").filter(
  p => p.file.cday.valueOf() === date.valueOf()
);

if (files.array().length !== 0) {
dv.header(3, "Today's Notes");
dv.paragraph(files.file.link.array());
};
```

Today's Notes