---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


```
const reg = /(\d+)/;
function extractSortKey(p) {
var res = p.text.match(reg);
if (res) {
return parseInt(res);
}
return p.text;
}

dv.taskList(dv.pages("").file.tasks.sort(extractSortKey))
```

Tags by numeric order