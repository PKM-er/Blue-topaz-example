---

<%-*
let banner= await tp.user.getrandomImage("99-Attachment/banner")
let weather = await tp.user.getweather("")
-%>
UID: <% tp.date.now("YYYYMMDDHHmm")%> 
alias:
banner: <% banner %>
```js quickadd
const suggester = await this.quickAddApi.suggester(["开心😀", "低落😐", "疲惫😪","爽😎","平静😶"], ["😀", "😐", "😪", "😎", "😶"]) 
return `banner_icon: ${suggester}`;
```
Banner style: Solid
cssclass: mynote,noyaml
---
> [!blank] 
> [timeline{{DATE:DDD}}::timeline]
```ad-flex
(Weather::<% `${weather}` %>)
> [!infobox|noicon]- 🔖 当天创建的文件
> ```dataviewjs 
const filename=dv.current().file.name;
dv.list(dv.pages().where(p => p.file.cday.toISODate() === filename).sort(p => p.file.ctime, 'desc').file.link) 
>```
```
## ✏随笔感悟