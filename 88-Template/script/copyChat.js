// from  boninall Modified from cuman
// 2023-02-23

module.exports = {"Copy Chat History": copyChatWithHistory, "Copy Last Answer": copyLastAnswer,"Copy History with chat plugins": copyChatWithHistory_chat};

const ExportMD = (function () {
	if (!window.TurndownService) return;
	const hljsREG = /^.*(hljs).*(language-[a-z0-9]+).*$/i;
	const turndownService = new window.TurndownService({
		headingStyle: "atx",
		hr: "---",
		bulletListMarker: "-",
		codeBlockStyle: "fenced",
		fence: "```",
		linkStyle: "inlined"
	})
	  .addRule('code', {
		filter: (node) => {
		  if (node.nodeName === 'CODE' && hljsREG.test(node.classList.value)) {
			return 'code';
		  }
		},
		replacement: (content, node) => {
		  const classStr = node.getAttribute('class');
		  if (hljsREG.test(classStr)) {
			const lang = classStr.match(/.*language-(\w+)/)[1];
			if (lang) {
			  return `\`\`\`${lang}\n${content}\n\`\`\``;
			}
			return `\`\`\`\n${content}\n\`\`\``;
		  }
		}
	  })
	  .addRule('ignore', {
		filter: ['button', 'img'],
		replacement: () => '',
	  })
	  .keep(['table']);
	  // .addRule('table', {
		// filter: 'table',
		// replacement: function(content, node) {
		  // return `\`\`\`${content}\n\`\`\``;
		// },
	  // });
  
	return turndownService;
  }({}));

async function copyChatWithHistory(params) {
	const {app} = params;

	const chatViewEl = app.workspace.getLeavesOfType("surfing-view").find((item)=>{ return /chat\.openai\.com/.test(item?.view?.currentUrl)}).view.webviewEl;
	let content = "";

	chatViewEl.executeJavaScript(`
		var content = "";
		content = Array.from(document.querySelectorAll('main .items-center>div')).map(i => {
			let j = i.cloneNode(true);
			if (/dark\:bg-gray-800/.test(i.getAttribute('class'))) {
				j.innerHTML = "<blockquote>" + i.innerHTML + "</blockquote>";
			}
			if (/bg-gray-50/.test(i.getAttribute('class'))) {
				j.innerHTML = "💡: " + i.innerHTML;
			}
				return j.innerHTML;
		}).join('<hr />');
	`, true).then((result) => {
		content = ExportMD.turndown(result).replace(/:\n\n/g, ': ').split("\n").map((line)=> {
			return line.replace(/^ {4}(?=[\w\W])/gm, "").trim();
		}).join("\n");
		electron.clipboard.writeText(content);
	});
}

async function copyChatWithHistory_chat(params) {
	const {app} = params;

	const chatViewEl = app.workspace.getLeavesOfType("surfing-view").find((item)=>{ return /chat\.openai\.com/.test(item?.view?.currentUrl)}).view.webviewEl;
	let content = "";

	chatViewEl.executeJavaScript(`
		var content = "";
		content = Array.from(document.querySelectorAll('main .items-center>div')).map(i => {
			let j = i.cloneNode(true);
			if (/dark\:bg-gray-800/.test(i.getAttribute('class'))) {
				j.innerHTML = "<blockquote>" + i.innerHTML + "</blockquote>";
			}
			if (/bg-gray-50/.test(i.getAttribute('class'))) {
				j.innerHTML = "&lt; |💡: " + i.innerHTML;
			}
				return j.innerHTML;
		}).join('<hr />');
	`, true).then((result) => {
		let mdcontent= ExportMD.turndown(result)
		var re = /💡:(.*?)---/gs; // 创建一个正则表达式对象，s表示匹配任意字符包括换行符
		mdcontent = mdcontent.replace(re, function(match, group) { // 使用replace方法替换所有匹配的子串，match表示整个匹配结果，group表示第一个捕获组
			return match.replace(/\n/g, "<br>"); // 返回替换后的子串，用空字符串替换其中的换行符
			});
		mdcontent=mdcontent.replace(/:\n\n/g, ': ')
		content = mdcontent.split("\n").map((line)=> {
			return line.replace(/^ {4}(?=[\w\W])/gm, "").trim();
		}).join("\n");
		
		content=`\`\`\`\`chat\n${content}\n\`\`\`\``;
		electron.clipboard.writeText(content);
	});
}

async function copyLastAnswer(params) {
	const {app} = params;

	const chatViewEl = app.workspace.getLeavesOfType("surfing-view").find((item)=>{ return /chat\.openai\.com/.test(item?.view?.currentUrl)}).view.webviewEl;
	let content = "";

	chatViewEl.executeJavaScript(`
		var content = "";
		content = Array.from(document.querySelectorAll('main .items-center>div')).map(i => {
			let j = i.cloneNode(true);
			if (/dark\:bg-gray-800/.test(i.getAttribute('class'))) {
				j.innerHTML = "<blockquote>" + i.innerHTML + "</blockquote>";
			}
				return j.innerHTML;
		});
	`, true).then((result) => {
		content = ExportMD.turndown(result.slice(-2)[0]).split("\n").map((line)=> {
			return line.replace(/^ {4}(?=[\w\W])/gm, "").trim();
		}).join("\n");
		electron.clipboard.writeText(content);
	});
}