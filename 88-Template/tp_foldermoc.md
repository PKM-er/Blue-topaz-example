---
cssclass: kanban
---

## MOC 导航
#moc 
<%* 
const folder = tp.file.folder(true);  
const Path = (folder== '/' ? '' : folder + '/') + folder ;  
tR=`---
cssclass: kanban gridlist
tag: moc
obsidianUIMode: preview
--- 
%% moc %%`;
await tp.file.move(Path)
%>
