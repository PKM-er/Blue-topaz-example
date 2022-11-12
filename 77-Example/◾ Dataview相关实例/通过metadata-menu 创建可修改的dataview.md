---
aliases: 20221102200254
tags: 
cssclass:
source:
created: "2022-11-02 20:02"
updated: "2022-11-12 23:50"
---

```dataviewjs
const{fieldModifier:f}=this.app.plugins.plugins["metadata-menu"].api
dv.table(["file","status","author"],
dv.pages('#book')
.map(p=>[p.file.link,f(dv,p,"status",{options:{alwaysOn:true,showAddField: true,inFrontmatter: true}}),f(dv,p,"author")])
)

```