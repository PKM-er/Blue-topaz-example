---

<%-*
var cleanTitle = tp.user.getTitleSnippet(newtitle)
var title = ${cleanTitle};
await tp.file.rename(${title});
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
let birthday =tp.system.prompt_date("请选择ta的生日？",tp.date.now("YYYY-MM-DD"))
let birthdaycode="\`$= let date = moment(dv.current().birthday.toString(),'yyyy-MM-DD'); let today = moment().startOf('day'); today.diff(date,'years')\`"
let howold=birthday?birthdaycode:""
-%>

alias: 
tags: <% tp.system.suggester(["亲人", "朋友", "同学", "同事", "网友"], ["人脉/亲人", "人脉/朋友", "人脉/同学", "人脉/同事", "人脉/网友"]) %>
birthday: <% birthday %>
cdate: <% tp.file.creation_date() %>
uid: <% tp.date.now("YYYYMMDDHHmmss") %> 
cssclass: 
---

# 基本信息
姓名:: <% `${title}` %>
性别:: <% tp.system.suggester(["男", "女"], ["男", "女"]) %>
年龄:: <% `${howold}` %>岁
家乡::
手机::
如何认识的:: 
人物描述:: 
照片:: 




