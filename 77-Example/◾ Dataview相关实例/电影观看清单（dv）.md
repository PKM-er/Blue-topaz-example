---
cssclass: "cards"
usage: "对dataview表格渲染成卡片视图"
banner: "99-Attachment/banner/baner6.jpg"
obsidianUIMode: "preview"
updated: 
---

>  实现方法参考[[如何在Obsidian中添加电影卡片]]
>  支持本地图片和网络图片展示
>  如果要显示本地图片参考[[如何在dataview查询使用本地图片]]


## 电影库
> [!done|noicon|noborder]+ 🎞电影库
> ```dataview
table without id    "![](" + cover + ")"  as Cover, file.link as Name, year as Year,rating as Rating,grade,status
from #Movie
where !contains(file.folder, "88-Template")
where contains(cover, "http")
sort rating desc
>```

### dv版本0.5.3以上版本写法 

> [!done|noicon|noborder]+ 🎞电影库（dv版本0.5.3以上 支持本地图片）
> ```dataview
table without id default(embed(image), "![](" + cover + ")") as Cover, file.link as Name, year as Year,rating as Rating,grade,status
from #Movie
where !contains(file.folder, "88-Template")
sort rating desc
>```

^71b6c4

###  最近半个月看过的电影列表

```dataview
table without id default(embed(image), "![](" + cover + ")") as Cover, file.link as Name, year as Year,rating as Rating
from #Movie  
where !contains(file.folder, "88-Template")
where viewtime != null and (date(now)-date(viewtime)).day <=15
sort rating desc
```

