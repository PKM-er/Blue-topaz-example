module.exports = getnotie
let quickAddApi;

async function getnotie (params) {
    ({quickAddApi} = params) 
    let notice =  await quickAddApi.inputPrompt("🏷️ 便签");
    await new Notice(notice,0);
}