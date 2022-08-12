---
<%-*
var cleanTitle = tp.user.getTitleSnippet(tp.file.title) 
var title = `${cleanTitle}`;
await tp.file.rename(`${title}`);
-%>

alias: 
tags: 
cdate: <% tp.file.creation_date() %>
uid: <% tp.date.now("YYYYMMDDHHmmss") %> 
Update: <%+ tp.file.last_modified_date("YYYY-MM-DD dddd HH:mm:ss") %>
cssclass: 
Cover: 
---

## Metadata
Status::    <% tp.system.suggester(["🌱发芽状态", "🪴培育状态", "🌲长青状态"], ["#笔记状态/🌱发芽", "#笔记状态/🪴培育","#笔记状态/🌲长青"],false, "笔记状态是？") %>
Source Type::  <% tp.system.suggester(["💭想法", "📚书籍", "📰️文章", "🗣️聊天", "💻教学", "▶️视频", "🎧️播客"], ["#📥/💭想法 ", "#📥/📚书籍 ", "#📥/📰️文章", "#📥/🗣️聊天 ", " #📥/💻教学", "#📥/▶️视频", "#📥/🎧️播客"],false, "笔记源自哪里？") %>
Note Type::  <% tp.system.suggester(["笔记", "MOC"], ["#笔记", "#MOC"],false, "笔记类型是？") %>
Topic:: [[<% tp.system.prompt("这个笔记对应的主题MOC ", "比如：时间管理") %>]]
Author:: {原资讯的作者或者对话的人或者引起某种想法的原因}


<%-*  let filetype = await tp.system.suggester(["放入工作", "放入学习", "归入人脉"], ["工作", "学习", "人脉"], false, "Which template do you want to use?") 
if (filetype === "工作") { 
myFilePath = "/20 - 工作/" +  `${title}`;
await tp.file.move(`${myFilePath}`);
} else if (filetype === "学习") { 
myFilePath = "/30 - 学习/" +  `${title}`;
await tp.file.move(`${myFilePath}`);
} else if (filetype === "人脉") {
myFilePath = "/50 - 人脉/02 其他/" +  `${title}`;
await tp.file.move(`${myFilePath}`);
} else { 
tp.file.cursor(1)
} -%>