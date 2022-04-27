---
UID: <% tp.date.now("YYYYMMDDHHmm")%> 
alias:
banner: "<% tp.user.getrandomImage("99-Attachment/banner")%>"
Banner style: Solid
banner_icon:  <% tp.system.suggester(["开心😀", "低落😐", "疲惫😪","爽😎","平静😶"], ["😀", "😐", "😪", "😎", "😶"],false,'今天心情如何？') %>
cssclass: mynote,noyaml
---

(Weather::<% tp.user.getweather("郑州") %>)

## ✏随笔感悟

