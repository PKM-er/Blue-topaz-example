const path = require('path');
/****感谢锋华提供的js脚本 2022-01-22****/
module.exports = async function colorclock (params) {
  const pickedSticky = await params.quickAddApi.suggester(
    ["便签一(倒计时)","便签二","便签三","便签四"],
    [1,2,3,4]
  );

  let stickyContent = await params.quickAddApi.wideInputPrompt("请输入便签内容")
  const stickyPatter1 = /(?<=1--\>\W)\<p\Wclass="stickies".*\>([\w\W]*?)\<\/p\>/
  const stickyPatter2 = /(?<=2--\>\W)\<p\Wclass="stickies2".*\>([\w\W]*?)\<\/p\>/
  const stickyPatter3 = /(?<=3--\>\W)\<p\Wclass="stickies".*\>([\w\W]*?)\<\/p\>/
  const stickyPatter4 = /(?<=4--\>\W)\<p\Wclass="stickies2".*\>([\w\W]*?)\<\/p\>/

  const filePath = path.join(app.vault.adapter.basePath,"88-Template","home.md")
  const fileContent = await app.vault.adapter.fs.readFileSync(filePath, "utf8")

  if(pickedSticky == "1" && stickyContent){
    let newContent = fileContent.replace(stickyPatter1,  `<p class="stickies" style="max-width:180px" >\n${stickyContent}\n</p>\n`)
    await app.vault.adapter.fs.writeFileSync(filePath, newContent,"utf8")
  }else if(pickedSticky == "2" && stickyContent){
    let newContent = fileContent.replace(stickyPatter2, `<p class="stickies2" style="max-width:200px" >\n${stickyContent}\n</p>\n`)
    await app.vault.adapter.fs.writeFileSync(filePath, newContent,"utf8")
  }else if(pickedSticky == "3" && stickyContent){
    let newContent = fileContent.replace(stickyPatter3, `<p class="stickies" style="max-width:200px">\n${stickyContent}\n</p>\n`)
    await app.vault.adapter.fs.writeFileSync(filePath, newContent,"utf8")
  }else if(pickedSticky == "4" && stickyContent){
    let newContent = fileContent.replace(stickyPatter4, `<p class="stickies2" style="max-width:200px" >\n${stickyContent}\n</p>\n`)
    await app.vault.adapter.fs.writeFileSync(filePath, newContent,"utf8")
  }else{
    console.log("pickSticky error!")
  }

}
