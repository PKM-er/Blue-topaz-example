---
created: 2022-04-24 14:18
updated: 2022-04-26 09:01
---
> - 通过把dataview查询的yaml字段用button按钮替代，就可以实现点击字段名称即可修改。根据字段类型可以选择下拉框，建议框，日期输入框，文本输入框等
> - 另一种方式是借助[dbfolder](obsidian://show-plugin?id=dbfolder) 实现可以编辑的dv表格，可以更新和创建不存在的字段，参考[[🎶影音数据库]]



```dataviewjs
//BlueTopaz example
const {suggestpromt,update,autoprop} = this.app.plugins.plugins["metaedit"].api;
const {createButton} = app.plugins.plugins["buttons"]

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
//下拉框选择metaedit维护的属性
const dropdown = async(file, key) => {
		const newtext = await autoprop("当前属性")
        await update(key, newtext, file);
}

//下拉框选择自建属性
const dropdown1 = async(file, key) => {
 const value = await suggestpromt('Item1',["Item1","item2"]);//默认值，选项
 console.log(value)
        await update(key, value, file);
}


//文本输入框
const inputMaker =async (file,key,values,initial)=>{
	 const value = await app.plugins.plugins['templater-obsidian'].templater.functions_generator.internal_functions.modules_array[4].static_functions.get('prompt')("请输入"+key,values??initial,true);
	 await update(key, value, file)
}
//建议框
const suggester =async(file, key) =>
{
 const value = await app.plugins.plugins['templater-obsidian'].templater.functions_generator.internal_functions.modules_array[4].static_functions.get('suggester')(["Item1text", "Item2text"], ["Item1", "item2"],false, "Please select an option")
   await update(key, value, file)
}

//输入日期
const inputdate = async (file, key,values) => {
	let today = new Date().toISOString().slice(0, 10)
	//values=values?new Date(+new Date(values)+8*3600*1000).toISOString().slice(0, 10):values
	
    const value = await app.plugins.plugins['templater-obsidian'].templater.functions_generator.internal_functions.modules_array[4].static_functions.get('prompt_date')("请选择日期？",values?formatDate(values):today,true)
    //const date = app.plugins.plugins['nldates-obsidian'].parseDate(value).moment.format("YYYY-MM-DD")
    await update(key, '\"'+value+ '\"', file)
}
//判断是网络图片还是本地图片
const filePath = (file) =>
    file.startsWith("http") ?
        file :
        app.vault.adapter.getResourcePath(file)
//核心代码		
const pages = dv.pages("#book")
    .sort(t => t.rating, 'desc')
    //.where(t => t.status != "Completed")
	.where(t => t.file.folder !="88-Template" )
	.map(t => ["![]("+t.cover+")" ,t.file.link,t.author,t.rating,
	createButton({app, el: this.container, args: {name: t.pageprogress??'阅读进度',class:'tiny'}, clickOverride: {click: inputMaker, params: [t.file.path, 'pageprogress',t.pageprogress]}}),
	createButton({app, el: this.container, args: {name: t.grade??'评级',class:'tiny'}, clickOverride: {click: dropdown, params: [t.file.path, 'grade']}}),
	createButton({app, el: this.container, args: {name: t.status??'状态',class:'tiny'}, clickOverride: {click: dropdown, params: [t.file.path, 'status']}}),
	createButton({app, el: this.container, args: {name: t['readtime']?formatDate(t['readtime']):'更新',class:'tiny'}, clickOverride: {click: inputdate, params: [t.file.path, 'readtime',t['readtime']]}}),
	
	createButton({app, el: this.container, args: {name: '22',class:'tiny'}, clickOverride: {click: dropdown1, params: [t.file.path, 'updated',t['updated']]}})
	]);
//生成表格
dv.table(["cover", "文件", "author","rating","阅读进度", "grade","status","阅读时间"], pages)



```
