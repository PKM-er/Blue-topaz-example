//from bon 2022-11-29 
//作用 把::的内联字段转为yaml字段
function generateNewContent(content){
    const lines = content.split(/\r?\n/);
    let topAdded = false;
    const splitLine = "---";
    let bottomAdded = false;
    for(let i = 0; i < lines.length ; i++) {
          let newYAML = "";
          
          if(/^\s{0,}$/.test(lines[i]) || /^---$/.test(lines[i])) break;
          if(/^([^:]*)::(.*)/g.test(lines[i])) {
                 newYAML = lines[i].replace(/^([^:]*):: (.*)/g, '$1: $2');
                 if(!topAdded) {
                       lines.splice(i, 1, splitLine, newYAML);
                       console.log(lines);
                       topAdded = true;
                       continue;
                 }
                 if(!bottomAdded && topAdded && /^\s{0,}$/.test(lines[i+1])) {
                 	 lines.splice(i, 1, newYAML, splitLine);
                      bottomAdded = true;
                      continue;
                 }
                 lines.splice(i, 1, newYAML);
          }
    }

    return lines.join('\n');
}

module.exports = async (params) => {
    const currentFile = app.workspace.activeLeaf.view.file;
    const content = await app.vault.cachedRead(currentFile);
    const newContent = generateNewContent(content);
    try {
         app.vault.modify(currentFile, newContent);	
    } catch(e) {
         new Notice(e);	
    }
}