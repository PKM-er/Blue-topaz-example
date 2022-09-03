---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
```
const durNum = 7;
const durType = "days" 
// update ctime to mtime if needs be 
function timeSinceCreationInDays(p) { 
  return luxon.Interval.fromDateTimes( 
    p.file.ctime, 
    luxon.DateTime.now() 
  ).length(durType);
} 
dv.list(dv.pages("")
  .filter(p => timeSinceCreationInDays(p) <= durNum).file.link
);

dv.header(2, "Recent Incomplete Tasks");
dv.taskList(dv.pages("")
  .filter(p => timeSinceCreationInDays(p) <= durNum).file.tasks.filter(t => !t.completed)
);

dv.header(2, "Recent Complete Tasks");
dv.taskList(dv.pages("")
  .filter(p => timeSinceCreationInDays(p) <= durNum).file.tasks.filter(t => t.completed)
);
```