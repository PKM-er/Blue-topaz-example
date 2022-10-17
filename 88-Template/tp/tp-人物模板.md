---
<%-*
let  newtitle;
if(tp.file.title.includes("未命名") || tp.file.title.toLowerCase().includes("untitled")) 
{ title=await tp.system.prompt("请输入要创建的文件名");
newtitle=title||tp.date.now("YYYYMMDDHHmmss")
	await tp.file.rename(newtitle)}
	else newtitle=tp.file.title
var cleanTitle = tp.user.getTitleSnippet(newtitle) 
var title = `${cleanTitle}`;
await tp.file.rename(`${title}`);
let filetype = await tp.system.suggester(["人物目录", "临时"], ["人物", "其他"], false, "Which template do you want to use?") 
if (filetype === "人物") { 
myFilePath = "/50-Inbox/People/" +  `${title}`;
await tp.file.move(`${myFilePath}`);
} else if (filetype === "其他") { 
myFilePath = "/50-Inbox/" +  `${title}`;
await tp.file.move(`${myFilePath}`);
} else { 
tp.file.cursor(1)
}
let meetday =tp.system.prompt_date("请选择ta的见面日期？",tp.date.now("YYYY-MM-DD"))??'';
let birthday =tp.system.prompt_date("请选择ta的生日？",tp.date.now("YYYY-MM-DD"))
-%>

alias: 
tags: <% tp.system.suggester(["亲人", "朋友", "同学", "同事", "网友"], ["人脉/亲人", "人脉/朋友", "人脉/同学", "人脉/同事", "人脉/网友"]) %>
birthday: <% birthday %>
cdate: <% tp.file.creation_date() %>
uid: <% tp.date.now("YYYYMMDDHHmmss") %> 
meetday:  <% meetday %>
cssclass: 
---

# 基本信息
姓名:: <% `${title}` %>
性别:: <% tp.system.suggester(["男", "女"], ["男", "女"]) %>
年龄:: 岁
家乡::
手机::
如何认识的:: 
人物描述:: 
照片:: 




