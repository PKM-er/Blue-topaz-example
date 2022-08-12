---
UID: <% tp.date.now("YYYYMMDDHHmm")%> 
alias:
banner: "<% tp.user.getrandomImage("99-Attachment/banner")%>"
Banner style: Solid
banner_icon:  <% tp.system.suggester(["开心😀", "低落😐", "疲惫😪","爽😎","平静😶"], ["😀", "😐", "😪", "😎", "😶"],false,'今天心情如何？') %>
cssclass: mynote,noyaml
---
> [!blank] 
> [timeline{{date:DDD}}::timeline]
```ad-flex
(Weather::<% tp.user.getweather("") %>)
> [!infobox|noicon]- 🔖 当天创建的文件
> ```dataviewjs 
const filename=dv.current().file.name;
dv.list(dv.pages().where(p => p.file.cday.toISODate() === filename).sort(p => p.file.ctime, 'desc').file.link) 
>```
```
## ✏随笔感悟

