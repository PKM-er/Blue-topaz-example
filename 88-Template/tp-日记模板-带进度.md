---
UID: <% tp.date.now("YYYYMMDDHHmm")%> 
alias:
banner: "<% tp.user.getrandomImage("99-Attachment/banner")%>"
Banner style: Solid
banner_icon:  <% tp.system.suggester(["开心😀", "低落😐", "疲惫😪","爽😎","平静😶"], ["😀", "😐", "😪", "😎", "😶"],false,'今天心情如何？') %>
cssclass: mynote,noyaml
---
<div data-timeline="{{date:DDD}}"></div><br>

> [!infobox|noicon|right]- 🔖 当天创建的文件
> ```dataviewjs 
const filename=dv.current().file.name;
dv.list(dv.pages().where(p => p.file.cday.toISODate() === filename).sort(p => p.file.ctime, 'desc').file.name) 
>```

(Weather::<% tp.user.getweather("郑州") %>)

## ✏随笔感悟

