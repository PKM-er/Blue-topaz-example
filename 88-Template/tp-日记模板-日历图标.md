---
UID: <% tp.date.now("YYYYMMDDHHmm")%> 
alias:
banner: "<% tp.user.getrandomImage("99-Attachment/banner")%>"
Banner style: Solid
cssclass: mynote,noyaml
---

```ad-icon
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Calendar" role="img" viewBox="0 0 512 512" width="100%" height="100%" style="cursor: default">
      <path d="m512,455c0,32 -25,57 -57,57l-398,0c-32,0 -57,-25 -57,-57l0,-327c0,-31 25,-57 57,-57l398,0c32,0 57,26 57,57l0,327z" fill="#efefef"/>
      <path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" fill="#cf5659"/>
      <g fill="#f3aab9">
        <circle cx="462" cy="136" r="14"/>
        <circle cx="462" cy="94" r="14"/>
        <circle cx="419" cy="136" r="14"/>
        <circle cx="419" cy="94" r="14"/>
        <circle cx="376" cy="136" r="14"/>
        <circle cx="376" cy="94" r="14"/>
      </g>
      <text id="month" x="32" y="150" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="122px" style="text-anchor: left">{{date:MMMM}}</text>
      <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="256px" style="text-anchor: middle">{{date:DD}}</text>
      
      <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle">{{date:dddd}}</text>
</svg>
```
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

