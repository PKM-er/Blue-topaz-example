---
cssclass: cards
usage: 对dataview表格渲染成卡片视图
banner: "99-Attachment/banner/baner6.jpg"
obsidianUIMode: preview
updated: ''
---

>  实现方法参考[[如何在Obsidian中添加电影卡片]]
>  支持本地图片和网络图片展示
>  如果要显示本地图片，dataview 版本需要在0.5.3以上，或者使用dvjs[[77-Example/电影观看清单-状态控制（dvjs）]]（注：示例库自带的dv版本是0.4.6）
本地图片使用image 字段


## 电影库
> [!done|noicon|noborder]+ 🎞电影库
> ```dataview
table without id    "![](" + cover + ")"  as Cover, file.link as Name, year as Year,rating as Rating,grade,status
from #Movie  
where !contains(file.folder, "88-Template")
sort rating desc
>```



> [!done|noicon|noborder]+ 🎞电影库（dv版本0.5.3以上 支持本地图片）
> ```dataview
table without id default(embed(image), "![](" + cover + ")") as Cover, file.link as Name, year as Year,rating as Rating,grade,status
from #Movie  
where !contains(file.folder, "88-Template")
sort rating desc
>```

###  最近半个月看过的电影列表

```dataview
TABLE  without id  "![|50](" + cover + ")" as Cover, file.link as Name,status as 状态,progress as 评级
from #Movie
where viewtime > dur(2 weeks) and !contains(file.folder, "88-Template")

```