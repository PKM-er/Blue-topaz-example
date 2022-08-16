---
<%-* 
let  newtitle
if(tp.file.title.includes("未命名") || tp.file.title.toLowerCase().includes("untitled")) 
{ title=await tp.system.prompt("请输入要创建的文件名");
newtitle=title||tp.date.now("YYYYMMDDHHmmss")
	await tp.file.rename(newtitle)}
	else newtitle=tp.file.title
var cleanTitle = tp.user.getTitleSnippet(newtitle) 
var title = `${cleanTitle}`;
await tp.file.rename(`${title}`);
let myFilePath = "/50-Inbox/Logs/" + `${title}`;
await tp.file.move(`${myFilePath}`);
-%>

alias: 
tags: 记录
购买证明: 
uid: <% tp.date.now("YYYYMMDDHHmmss") %> 
cssclass: 
---

# 基本信息
进出状态:: <% tp.system.suggester(["支出", "收入"], ["支出", "收入"]) %>
物品价格:: <% tp.system.prompt("物品价格", "") %>
购买状态:: <% tp.system.suggester(["已购买", "想要"], ["已购买", "想要"]) %>
物品类型:: <% tp.system.suggester(["食材", "熟食", "服饰", "电子设备", "家居物品", "虚拟物品", "其他"], ["#物品/食材", "#物品/熟食", "#物品/服饰", "#物品/电子设备", "#物品/家居物品", "#物品/虚拟物品", "#物品/其他"]) %>
购买日期:: 
购买途径:: 
物品描述:: 
图片展示:: 

