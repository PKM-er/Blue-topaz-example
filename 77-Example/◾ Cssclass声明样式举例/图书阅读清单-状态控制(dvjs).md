---
banner: "99-Attachment/banner/book.jpg"
cssclass: "cards"
usage: "对dataview表格渲染成卡片视图"
obsidianUIMode: "preview"
banner_x: 0.5
banner_y: 0.5
updated:: "2022-04-08 14:54:36"
created:: "2022-02-16 14:32:20"
title: "图书阅读清单-状态控制"
---


> 实现方法参考[[如何在Obsidian中添加图书卡片]]
> 需要安装metaedit 插件实现 点击修改元数据和状态控制
>  点击评级 和状态 选择数据 按回车键即可修改元数据
>  阅读进度 通过阅读页数计算，根据获取到的图书总页数(pagecount), 自己填上阅读的页码(pagegrade) 就知道进度



```dataviewjs
const {update,autoprop} = this.app.plugins.plugins["metaedit"].api;

const buttonMaker = (pn, pv, fpath) => {
    const btn = this.container.createEl('button', {"text": pv});
    btn.addEventListener('click', async (evt) => {
        evt.preventDefault();
        let newtext
        if(pn=='grade')
		 newtext = await autoprop("当前属性")
		 else if(pn=='status')
		 newtext = await autoprop("当前进度")
        await update(pn, newtext, fpath);
    });
    return btn;
}



const pages = dv.pages("#book")
    .sort(t => t.pageprogress/t.pagecount, 'desc')
    //.where(t => t.status != "Completed")
	.where(t => !t.file.folder.includes("88-Template") )
    .map(t =>  ["![]("+t.cover+")" ,"<progress value=" + t.pageprogress + " max=" +t.pagecount+" class='hot'>", t.file.link, t.author ,t.rating,buttonMaker('grade',t.grade??'评级',t.file.path),buttonMaker('status',t.status??'状态',t.file.path)])


dv.table(["cover","阅读进度", "name", "author","rating", "grade","status"], pages)


```