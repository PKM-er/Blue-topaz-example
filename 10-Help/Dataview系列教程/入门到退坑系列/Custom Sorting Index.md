---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
```
let files = dv.pages("");
let result = [];
let level = {result};
files.forEach(f => {
  f.file.path.split('/').reduce((r, name, i, a) => {
    if(!r[name]) {
      r[name] = {result: []};
      r.result.push({name, file:f, children: r[name].result})
    }
    return r[name];
  }, level)
})
function printObj(obj, level) {
  var result = "";
  for (var c of obj) {
    if (c.name) {
      result += "  ".repeat(level) + "* " + c.file.file.link + "\n";
    }
    if (c.children) {
      result += printObj(c.children, level + 1);
    }
  }
  return result;
}
dv.paragraph(printObj(result, 0));
```