---
UID: <% tp.date.now("YYYYMMDDHHmm")%> 
alias:
banner: <% tp.user.getrandomImage("99-Attachment/banner")%> 
Banner style: Solid
banner_icon:  <% tp.system.suggester(["开心😀", "低落😐", "疲惫😪","爽😎","平静😶"], ["😀", "😐", "😪", "😎", "😶"],false,'今天心情如何？') %>
cssclass: mynote,noyaml
---
<< [[<% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>|回忆昨天]] | [[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>|展望明天]]>>　　　　(Weather::<% tp.user.getweather("郑州") %>)

## ✏随笔感悟

