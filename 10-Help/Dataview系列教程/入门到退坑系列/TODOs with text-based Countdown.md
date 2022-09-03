---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


```
// TODO ISO倒计时
dv.paragraph(
  dv.pages("").file.tasks.array().map(t => {
  const reg = /\d{4}\/\d{2}\/\d{2}/;
var d = t.text.match(reg);
if (d != null) {
  var date = Date.parse(d);
  return `- ${t.text} -- ${Math.round((date - Date.now()) / 86400000)}天`
};
return `- ${t.text}`;
  }).join("\n")
)
```