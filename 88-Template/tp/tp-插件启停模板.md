<%*
// Form https://github.com/cumany/Blue-topaz-examples/issues/54  Thanks  **[hustrjh](https://github.com/hustrjh)**

let myEn= await tp.system.suggester( ["启用", "停用","维护插件分组"], [1, 0,2],false,"选择需要进行的操作，启用插件还是禁用插件");
let myChoice = await tp.system.suggester( ["编辑增强", "表格增强", "显示加强","除必备插件外", "全部",], ["Edit+", "Table+", "View+", "Required+","All"]);
var i;
var num;
var pluginArr = [];
-%>
<%*

//函数定义
readlist = async (filename) => {
if (tp.file.exists(filename)) {
const f = tp.file.find_tfile(filename);
let plugins = (await app.vault.read(f)).split(/\r?\n/);
return plugins;
}
}
fastSwitch = async (choice, en) => {
	switch(choice)
	{
		case "Edit+":
			//pluginArr.splice(0, 0, "editing-toolbar", "obsidian-outliner");
            pluginArr = await readlist(choice);
			break;
		case "Table+":
            pluginArr = await readlist(choice);
			break;
		case "View+":
            pluginArr = await readlist(choice);
			break;
         case "Required+":
            let AllpluginArr=Object.values(app.plugins.manifests).map(p=>p.id).sort((a,b)=>a.localeCompare(b))
            let  RequiredArr = await readlist("Required+");
            pluginArr = AllpluginArr.filter((x) => !RequiredArr.some((item) => x=== item));
            break;
		case "All":
          let  pluginArr1 = await readlist("Edit+");
          let  pluginArr2  = await readlist("Table+");
          let  pluginArr3 = await readlist("View+");
pluginArr=pluginArr.concat(pluginArr1,pluginArr2,pluginArr3)
			break;
	}
	num = pluginArr.length;
	switch(en)
	{
		case 1:
			for(i=0;i<num;i++)
			{
				await app.plugins.enablePlugin(pluginArr[i]);
			}
			break;
		case 0:
			for(i=0;i<num;i++)
			{
				await app.plugins.disablePlugin(pluginArr[i]);
			}
			break;
		case 2:
		if(choice== "All") choice="获取插件列表"
		const filePath = app.metadataCache.getFirstLinkpathDest(choice,'');
	app.workspace.getUnpinnedLeaf().openFile(filePath);
	break;
	}
}
//函数调用
await fastSwitch(myChoice, myEn);
-%>