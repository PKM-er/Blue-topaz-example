
<%-*  let filetype = await tp.system.suggester(["笔记收集箱","流水账模板","人物模板","临时默认"], ["笔记收集箱", "流水账模板","人物模板","临时默认"], false, "Which template do you want to use?") -%>
<%-* if (filetype === "笔记收集箱") {  -%>
<%-tp.file.include("[[tp-笔记分类模板]]")-%>
<%-* } else if (filetype === "流水账模板") {  -%>
<%-tp.file.include("[[tp-流水账模板]]")-%>
<%-* } else if (filetype === "人物模板") {  -%>
<%-tp.file.include("[[tp-人物模板]]")-%>
<%-* } else if (filetype === "临时默认") {  -%>
<%-tp.file.include("[[tp-通用模板]]")-%>
<%-* } else { -%>
<%-tp.file.include("[[tp-通用模板]]")-%>
<%-* } -%>
