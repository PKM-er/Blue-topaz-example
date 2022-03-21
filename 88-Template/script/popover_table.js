module.exports = popover_table
let quickAddApi;
let obsidan;
async function popover_table (params) {
	 ({obsidian} = params) 
	var view = app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!view) {
      return;
    }
    var 当前光标 = view.editor.getCursor();
	
	setTimeout(() => {
	 let com= app.commands.executeCommandById("obsidian-hover-editor:open-current-file-in-new-popover");	
	 console.log(com);
	if(com)
	{	
	var popover_view = app.app.plugins.plugins['obsidian-hover-editor'].spawnPopover() ;
	 
	popover_view.editor.setCursor(当前光标);
	console.log(popover_view);
		}
	}, 200);
	
}