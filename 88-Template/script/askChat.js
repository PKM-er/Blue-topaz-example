// from  boninall 
// 用来给ChatGPT提问的时候自动加上设置好的提示语
module.exports = askChatWithPrompt;

function askChat(str) {
	const prompt = encodeURI(str);

	const chatViewEl = app.workspace.getLeavesOfType("surfing-view").find((item)=>{ return /chat\.openai\.com/.test(item?.view?.currentUrl)}).view.webviewEl;
	chatViewEl.executeJavaScript(`
		var htmlElement = document.querySelector("textarea");
		htmlElement.value = decodeURI("${ prompt }");
		htmlElement.parentElement.childNodes[1].click();
	`, true).then((result) => {
		console.log(result);
	});
}

async function askChatWithPrompt(params) {
	const {app, Notice} = params;
	const view = app.workspace.activeLeaf.view;
	if(!view) {
		new Notice("Please focus on view");
	}
	
	let selection = "";
	const customPrefix = await params.quickAddApi.suggester([
		"专利挖掘",
		"专利布局",
		"专利检索",
		"审查意见分析"
		], [
		"假如你是一名经验丰富的专利挖掘人员，你可以根据以下的内容基于TRIZ理论来挖掘相关的技术方案吗？：\n",
		"假如你是一名经验丰富的专利布局师，你可以根据以下的内容基于TRIZ理论来进行专利布局吗？：\n",
		`假如你是一名经验丰富的专利代理人，以下是一次专利检索的拆分示例：\n\`\`\`\n标题：一种水源操作装置\n权利要求书：一种水源操作装置，其特征在在于，包括挖掘装置以及驱动马达；马达工作时会发生振动。\n说明书：一种水源操作装置，包括挖掘装置以及驱动马达；马达工作时会发生振动。且挖掘装置会在所述水源上滚动\n得到以下的检索式（每一行为完整的检索式示例）：\n检索式1：【DES=(机械 AND 装置) AND TI=(水源) AND CLAIM=(挖掘)】\n检索式2：【CLAIM=(驱动 AND 马达) AND TIABC=(工作)】\n\`\`\`\n其中 DES 代表的是专利的说明书部分，TI 代表的是专利的标题部分，CLAIM 代表的是权利要求部分，TIABC 代表的是权利要求书、摘要以及标题部分；AND 以及 OR 分别代表的是和以及或，NOT 代表的是不在这个部分出现，例如 NOT DES=(滚动)\n现在要你根据以上的示例来拆分以下的专利内容：\n`,
		`假如你是一名经验丰富的专利审查员，你可以分析下边的答复策略是否妥当吗？：\n`
	]) ?? "";
	const customSuffix = await params.quickAddApi.suggester(["后缀"],["后缀的实际内容"]) ?? "";
	if(view.getViewType() === "markdown") {
		selection = view.editor.getSelection();
		askChat(customPrefix + selection + customSuffix);
	} else if (view.getViewType() === "surfing-view" || view.getViewType() === "surfing-file-view") {
		view.webviewEl.executeJavaScript(`
			document.getSelection().toString();
		`,true).then((result)=> {
			selection = result;
			askChat(customPrefix + selection + customSuffix);
		});
	} else {
		new Notice("Wrong View");
	}
}