---
<%-* 
let  newtitle
if(tp.file.title.includes("未命名") || tp.file.title.toLowerCase().includes("untitled")) 
{ title=await tp.system.prompt("请输入要创建的文件名");
  newtitle=title||tp.date.now("YYYYMMDDHHmmss")
	await tp.file.rename(newtitle)}
	else newtitle=tp.file.title
-%>

UID: <% tp.date.now("YYYYMMDDHHmmss") %> 
aliases: 
tags: 
source: 
cssclass: 
created: <% tp.date.now("YYYY-MM-DD") %>
---

## ✍内容
