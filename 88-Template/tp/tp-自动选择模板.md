<%-* /* 如果笔记的名字中包含“-”则去除“-”与之前的文字 */ -%>
<%-* 
if (tp.file.title.includes("-")){
	var trigger = (tp.file.title.split("-")[0]).toLowerCase().trim()
} else {
	var trigger = ""
	console.log(trigger)
} -%>
<%-* /* 以下是当“-”前面含有对应的文字就使用对应的模板 */ -%>
<%-* if (tp.file.title.startsWith("物品")||trigger === "记录"||trigger === "流水账") { -%>
<%-tp.file.include("[[tp-流水账模板]]")-%>
<%-* } else if (tp.file.title.startsWith("人物")) { -%>
<%-tp.file.include("[[tp-人物模板]]")-%>
<%-* } else if (trigger === "人") { -%>
<%-tp.file.include("[[tp-人物模板]]")-%>
<%-* } else if (tp.file.title.startsWith("笔记")||trigger === "学习"||trigger === "note"||trigger === "inbox") {  -%>
<%-tp.file.include("[[tp-笔记收集箱]]")-%>
<%-* } else { -%>
<%-* /* 如果笔记名中没有“-”则会选择下方模板 */ -%>
<%-tp.file.include("[[tp-通用模板]]")-%>
<%-* } -%>


