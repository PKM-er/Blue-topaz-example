module.exports = startob

async function startob () {
 let msg = "第一次运行，需要打开库文件夹，并选择'20-Diary'目录作为库打开，否则会报错。";
 await ToastMessage(`${msg}`,20, async ()=>{execommand('打开其他仓库')  });
 window.open('obsidian://open?vault=20-Diary')
}

function ToastMessage(msg, timeoutInSeconds = 10, contextMenuCallback = null){
    
    const additionalInfo = contextMenuCallback ? "(点我消除提示，右击打开库文件夹)" : "";
    const newNotice = new Notice(`⚡⚡⚡\n${msg}\n${additionalInfo}`, timeoutInSeconds*1000);
    //@ts-ignore
    if(contextMenuCallback) newNotice.noticeEl.oncontextmenu = async () => { contextMenuCallback() };
}

function execommand(action){
	const allCommands = app.commands.listCommands();
    const command = allCommands.filter((command) => command.name.toUpperCase() === action.toUpperCase().trim())[0];
    app.commands.executeCommandById(command.id);
	}