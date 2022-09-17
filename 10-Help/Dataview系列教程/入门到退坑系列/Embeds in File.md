---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

Setting up a Composite Vault in Obsidian

```
const re = /!\[\[([^\]]+)\]\]/g;
var dvfile = dv.current();
var thisTFile = this.app.vault.getAbstractFileByPath(dvfile.file.path);
const content = await this.app.vault.cachedRead(thisTFile); 
console.log(content)
var result = [];
for (var match of content.matchAll(re)) {
result.push(match[0])
}
dv.paragraph(result);
```