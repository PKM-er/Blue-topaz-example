module.exports = refreshhomepage
let quickAddApi;

async function refreshhomepage (params) {
    ({quickAddApi} = params) 
//查看文件是否存在
 app.vault.adapter.exists(".obsidian/.diary-stats").then(async (exists) => {
            if (!exists) {
                app.vault.adapter.write(".obsidian/.diary-stats", "{}");
				return;
            }else
			{
			let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
//查看当天信息
			let today = moment().format("YYYY-MM-DD");
			delete history[today];
			await app.vault.adapter.write(".obsidian/.diary-stats", JSON.stringify(history));
			let read = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
			if (!read.hasOwnProperty(moment().format("YYYY-MM-DD")))
			{
				return;
			}
			
			}

});


}
