<%*
// Form https://github.com/cumany/Blue-topaz-examples/issues/54  Thanks  **[hustrjh](https://github.com/hustrjh)**

var funcArr = ["Edit+", "Table+", "View+"];
let myEn = await tp.system.suggester(["🟢启用", "🔴停用", "🛠️插件分组"], [1, 0, 2], false, "选择操作，启用、禁用或管理插件");
var i;
var num;
var item;
var choice;
var pluginArr = [];
var tmpArr = [];
-%>
<%*
//函数定义
ReadList = async (filename) => {
    if (tp.file.exists(filename)) {
        const f = tp.file.find_tfile(filename);
        let plugins = (await app.vault.read(f)).split(/\r?\n/);
        return plugins;
    }
}
FastSwitch = async (en) => {
    switch (en) {
        case 2://编辑插件分组
            choice = await tp.system.suggester(["📝编辑增强", "📝表格增强", "📝显示增强", "📝必备插件", "💼所有插件"], funcArr.concat(["Required+", "All"]), false, "编辑插件分组");
            break;
        default://启停插件
            choice = await tp.system.suggester(["📝编辑增强", "📝表格增强", "📝显示增强", "📝以上全部", "⚙更多操作"], funcArr.concat(["All", "actions"]), false, "启停插件");
            break;
    }
    if (choice == "actions") {//更多操作
        choice = await tp.system.suggester(["📝除编辑增强外", "📝除表格增强外", "📝除显示增强外", "📝除必备插件外", "💼所有插件",], funcArr.concat(["Required+", "All"]), false, "更多选项");
        switch (choice) {
            case "All":
                pluginArr = await ReadList("示例库内置的插件列表");
                break;
            default:
                let AllpluginArr = Object.values(app.plugins.manifests).map(p => p.id).sort((a, b) => a.localeCompare(b))
                let RequiredArr = await ReadList(choice);
                pluginArr = AllpluginArr.filter((x) => !RequiredArr.some((item) => x === item));
                break;
        }
    }
    else {//常规启停操作
        switch (choice) {
            case "All":
                // for (let index = 0; index < funcArr.length; index++) {
                //     const item = funcArr[index];
                //     tmpArr = await ReadList(item);
                //     pluginArr = pluginArr.concat(tmpArr);
                //     }
                for (const item of funcArr) {
                    tmpArr = await ReadList(item);
                    pluginArr = pluginArr.concat(tmpArr);
                }
                break;
            default:
                // pluginArr=pluginArr.concat(["editing-toolbar", "obsidian-outliner", "various-complements", "number-headings-obsidian"]);
                pluginArr = await ReadList(choice);
                break;
        }
    }
    num = pluginArr.length;
    switch (en) {
        case 1:
            for (i = 0; i < num; i++) {
                await app.plugins.enablePlugin(pluginArr[i]);
            }
            new tp.obsidian.Notice("已启用插件组：" + choice, 3000);
            break;
        case 0:
            for (i = 0; i < num; i++) {
                await app.plugins.disablePlugin(pluginArr[i]);
            }
            new tp.obsidian.Notice("已禁用插件组：" + choice, 3000);
            break;
        case 2:
            if (choice == "All") choice = "获取插件列表"
            const filePath = app.metadataCache.getFirstLinkpathDest(choice, '');
            app.workspace.getLeaf('tab').openFile(filePath);
            break;
    }
}
//函数调用
await FastSwitch(myEn);
-%>