---
cssclass: "cards"
usage: "对dataview表格渲染成卡片视图"
banner: "99-Attachment/banner/baner6.jpg"
obsidianUIMode: "preview"
banner_x: 0.5
banner_y: 0.5
updated: "2022-04-23 15:11"
---

> 实现方法参考[[如何在Obsidian中添加电影卡片]]
> 需要安装metaedit 插件实现 点击修改元数据和状态控制
> 点击进度 和状态 即可修改元数据
> cover字段同时支持本地图片和网络图片

^79cf0d

![[电影看板]]

```dataviewjs
const {update,autoprop} = this.app.plugins.plugins["metaedit"].api;
const {createButton} = app.plugins.plugins["buttons"]


//输入日期
const inputdate = async (file, key,values) => {
	let today = new Date().toISOString().slice(0, 10)
	//values=values?new Date(+new Date(values)+8*3600*1000).toISOString().slice(0, 10):values
	
    const value = await app.plugins.plugins['templater-obsidian'].templater.functions_generator.internal_functions.modules_array[4].static_functions.get('prompt_date')("请选择日期？",values?formatDate(values):today,true)
    //const date = app.plugins.plugins['nldates-obsidian'].parseDate(value).moment.format("YYYY-MM-DD")
    await update(key, '\"'+value+ '\"', file)
}
const dropdown = async(file, key) => {
		const newtext = await autoprop("当前属性")
        await update(key, newtext, file);
}

const filePath = (file) =>
    file.startsWith("http") ?
        file :
        app.vault.adapter.getResourcePath(file)
function formatDate(date){
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
			let datestr =[year, month, day].join('-')
		return datestr;
	}
const pages = dv.pages("#Movie")
    .sort(t => t.rating, 'desc')
    //.where(t => t.status != "Completed")
	.where(t => t.file.folder !="88-Template" )
    .map(t =>  [`![](${filePath(t.cover??'')})` , t.file.link, t.year,t.rating,
    createButton({app, el: this.container, args: {name: t.grade??'评级',class:'tiny'}, clickOverride: {click: dropdown, params: [t.file.path, 'grade']}}),
	createButton({app, el: this.container, args: {name: t.status??'状态',class:'tiny'}, clickOverride: {click: dropdown, params: [t.file.path, 'status']}}),
	createButton({app, el: this.container, args: {name: t['viewtime']?formatDate(t['viewtime']):'更新',class:'tiny'}, clickOverride: {click: inputdate, params: [t.file.path, 'viewtime',t['viewtime']]}})
    ])


dv.table(["cover", "name", "year", "rating", "grade","status","观看时间"], pages)


```
### 0.5.3 以上dataviewjs写法
```dataviewjs
const {update,autoprop} = this.app.plugins.plugins["metaedit"].api;
const {createButton} = app.plugins.plugins["buttons"]


//输入日期
const inputdate = async (file, key,values) => {
	let today = new Date().toISOString().slice(0, 10)
	//values=values?new Date(+new Date(values)+8*3600*1000).toISOString().slice(0, 10):values
	
    const value = await app.plugins.plugins['templater-obsidian'].templater.functions_generator.internal_functions.modules_array[4].static_functions.get('prompt_date')("请选择日期？",values?formatDate(values):today,true)
    //const date = app.plugins.plugins['nldates-obsidian'].parseDate(value).moment.format("YYYY-MM-DD")
    await update(key, '\"'+value+ '\"', file)
}
const dropdown = async(file, key) => {
		const newtext = await autoprop("当前属性")
        await update(key, newtext, file);
}

const filePath = (file) =>
    file.startsWith("http") ?
        file :
        app.vault.adapter.getResourcePath(file)
function formatDate(date){
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
			let datestr =[year, month, day].join('-')
		return datestr;
	}
const pages = dv.pages("#Movie")
    .sort(t => t.rating, 'desc')
    //.where(t => t.status != "Completed")
	.where(t => t.file.folder !="88-Template" )
    .map(t =>  [t.image?dv.span(`${'!'+t.image}`):`![](${filePath(t.cover??'')})`, t.file.link, t.year,t.rating,
    createButton({app, el: this.container, args: {name: t.grade??'评级',class:'tiny'}, clickOverride: {click: dropdown, params: [t.file.path, 'grade']}}),
	createButton({app, el: this.container, args: {name: t.status??'状态',class:'tiny'}, clickOverride: {click: dropdown, params: [t.file.path, 'status']}}),
	createButton({app, el: this.container, args: {name: t['viewtime']?formatDate(t['viewtime']):'更新',class:'tiny'}, clickOverride: {click: inputdate, params: [t.file.path, 'viewtime',t['viewtime']]}})
    ])


dv.table(["cover", "name", "year", "rating", "grade","status","观看时间"], pages)


```
