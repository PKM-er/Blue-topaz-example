---
searchType: color
searchColor: ffd400
searchTag: 
searchCodepro0: i
searchCodepro1: a
searchCodepro2: a
searchCodepro3: t
metatable: true
---
```dataviewjs
let vaultpath = "20-Diary";
const metaeditEnabled = app.plugins.enabledPlugins.has("metaedit");
const thisFile = dv.pages().where(f => f.file.path == dv.current().file.path)
let searchType = dv.pages().where(f => f.file.path == dv.current().file.path).searchType;
let searchColor = dv.pages().where(f => f.file.path == dv.current().file.path).searchColor;
let searchTag = dv.pages().where(f => f.file.path == dv.current().file.path).searchTag;
let searchCodepro0 = dv.pages().where(f => f.file.path == dv.current().file.path).searchCodepro0;
let searchCodepro1 = dv.pages().where(f => f.file.path == dv.current().file.path).searchCodepro1;
let searchCodepro2 = dv.pages().where(f => f.file.path == dv.current().file.path).searchCodepro2;
let searchCodepro3 = dv.pages().where(f => f.file.path == dv.current().file.path).searchCodepro3;
var sQuery = ""
var sCode = ""
if (metaeditEnabled === true) {
    const { update } = this.app.plugins.plugins["metaedit"].api;
    const searchTypeDropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const optionsText = ["标签", "注释", "图库", "高级"];
        const optionsValue = ["tags", "color", "image", "searchpro"]
        const dropdown = this.container.createEl('select');
        const option1 = dropdown.createEl('option');
        option1.text = optionsText[0];
        option1.value = optionsValue[0];
        const option2 = dropdown.createEl('option');
        option2.text = optionsText[1];
        option2.value = optionsValue[1];
        const option3 = dropdown.createEl('option');
        option3.text = optionsText[2];
        option3.value = optionsValue[2];
        const option4 = dropdown.createEl('option');
        option4.text = optionsText[3];
        option4.value = optionsValue[3];
        dropdown.selectedIndex != null ? dropdown.selectedIndex = optionsValue.indexOf(searchType.toString()) : dropdown.selectedIndex = 0;
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, optionsValue[dropdown.selectedIndex], file)
        })
        return dropdown
    }
    const searchColorDropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const optionsText = ["全色", "红色", "黄色", "蓝色", "绿色", "紫色"];
        const optionsValue = ["", "ff6666", "ffd400", "2ea8e5", "5fb236", "a28ae5"]
        const dropdown = this.container.createEl('select');
        const option1 = dropdown.createEl('option');
        option1.text = optionsText[0];
        option1.value = optionsValue[0];
        const option2 = dropdown.createEl('option');
        option2.text = optionsText[1];
        option2.value = optionsValue[1];
        const option3 = dropdown.createEl('option');
        option3.text = optionsText[2];
        option3.value = optionsValue[2];
        const option4 = dropdown.createEl('option');
        option4.text = optionsText[3];
        option4.value = optionsValue[3];
        const option5 = dropdown.createEl('option');
        option5.text = optionsText[4];
        option5.value = optionsValue[4];
        const option6 = dropdown.createEl('option');
        option6.text = optionsText[5];
        option6.value = optionsValue[5];
        dropdown.selectedIndex != null ?
            dropdown.selectedIndex = optionsValue.indexOf(searchColor.toString()) : dropdown.selectedIndex = 0;
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, optionsValue[dropdown.selectedIndex], file)
        })
        return dropdown
    }
    const searchCodepro1DropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const optionsText = ["全色", "红色", "黄色", "蓝色", "绿色", "紫色"];
        const optionsValue = ["a", "r", "y", "b", "g", "p"]
        const dropdown = this.container.createEl('select');
        const option1 = dropdown.createEl('option');
        option1.text = optionsText[0];
        option1.value = optionsValue[0];
        const option2 = dropdown.createEl('option');
        option2.text = optionsText[1];
        option2.value = optionsValue[1];
        const option3 = dropdown.createEl('option');
        option3.text = optionsText[2];
        option3.value = optionsValue[2];
        const option4 = dropdown.createEl('option');
        option4.text = optionsText[3];
        option4.value = optionsValue[3];
        const option5 = dropdown.createEl('option');
        option5.text = optionsText[4];
        option5.value = optionsValue[4];
        const option6 = dropdown.createEl('option');
        option6.text = optionsText[5];
        option6.value = optionsValue[5];
        dropdown.selectedIndex != null ? dropdown.selectedIndex = optionsValue.indexOf(searchCodepro1.toString()) : dropdown.selectedIndex = 0;
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, optionsValue[dropdown.selectedIndex], file)
        })
        return dropdown
    }
    const searchCodepro2DropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const optionsText = ["全色", "红色", "黄色", "蓝色", "绿色", "紫色"];
        const optionsValue = ["a", "r", "y", "b", "g", "p"]
        const dropdown = this.container.createEl('select');
        const option1 = dropdown.createEl('option');
        option1.text = optionsText[0];
        option1.value = optionsValue[0];
        const option2 = dropdown.createEl('option');
        option2.text = optionsText[1];
        option2.value = optionsValue[1];
        const option3 = dropdown.createEl('option');
        option3.text = optionsText[2];
        option3.value = optionsValue[2];
        const option4 = dropdown.createEl('option');
        option4.text = optionsText[3];
        option4.value = optionsValue[3];
        const option5 = dropdown.createEl('option');
        option5.text = optionsText[4];
        option5.value = optionsValue[4];
        const option6 = dropdown.createEl('option');
        option6.text = optionsText[5];
        option6.value = optionsValue[5];
        dropdown.selectedIndex != null ? dropdown.selectedIndex = optionsValue.indexOf(searchCodepro2.toString()) : dropdown.selectedIndex = 0;
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, optionsValue[dropdown.selectedIndex], file)
        })
        return dropdown
    }
    const searchCodepro3DropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const optionsText = ["图", "标签"];
        const optionsValue = ["i", "t"]
        const dropdown = this.container.createEl('select');
        const option1 = dropdown.createEl('option');
        option1.text = optionsText[0];
        option1.value = optionsValue[0];
        const option2 = dropdown.createEl('option');
        option2.text = optionsText[1];
        option2.value = optionsValue[1];
        dropdown.selectedIndex != null ? dropdown.selectedIndex = optionsValue.indexOf(searchCodepro3.toString()) : dropdown.selectedIndex = 0;
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, optionsValue[dropdown.selectedIndex], file)
        })
        return dropdown
    }
    const searchCodepro0DropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const optionsText = ["图", "注释"];
        const optionsValue = ["i", "n"]
        const dropdown = this.container.createEl('select');
        const option1 = dropdown.createEl('option');
        option1.text = optionsText[0];
        option1.value = optionsValue[0];
        const option2 = dropdown.createEl('option');
        option2.text = optionsText[1];
        option2.value = optionsValue[1];
        dropdown.selectedIndex != null ? dropdown.selectedIndex = optionsValue.indexOf(searchCodepro0.toString()) : dropdown.selectedIndex = 0;
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, optionsValue[dropdown.selectedIndex], file)
        })
        return dropdown
    }
    const tagsDropdownMaker = (pn, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath)
        const arr = dv.pages().filter(t => t.file.path.includes(vaultpath)).file.tags
        const tags = Array.from(new Set(arr)).filter(t => t.includes("📝/")).sort()
        tags.unshift("#")
        const dropdown = this.container.createEl('select');
        tags.forEach((tag, index) => {
            var opt = tag;
            var el = dropdown.createEl('option');
            opt != "#" ? el.textContent = opt : el.textContent = "全部注释标签";
            el.value = opt;
            dropdown.appendChild(el);
        })
        tags.indexOf("#" + searchTag.toString()) < 0 ? dropdown.selectedIndex = 0 : dropdown.selectedIndex = tags.indexOf("#" + searchTag.toString())
        dropdown.addEventListener('change', async evt => {
            evt.preventDefault();
            await update(pn, tags[dropdown.selectedIndex].slice(1), file)
        })
        return dropdown
    }
    dv.paragraph("## 检索路径为: " + vaultpath)
    dv.paragraph("## 检索类型: ")
    dv.paragraph(searchTypeDropdownMaker('searchType', thisFile.file.path))
    if (searchType.values[0] === "color" || searchType.values[0] === "tags" || searchType.values[0] === "image") {
        dv.paragraph("## 选项: ")
    }
    if (searchType.values[0] === "tags") {
        dv.paragraph(tagsDropdownMaker('searchTag', thisFile.file.path));
    } 
else if (searchType.values[0] === "color") {
        dv.paragraph(searchColorDropdownMaker('searchColor', thisFile.file.path));
    } 
else if (searchType.values[0] === "image") {
        dv.paragraph(searchColorDropdownMaker('searchColor', thisFile.file.path));
    } 
else if (searchType.values[0] === "searchpro") {
        dv.paragraph("### 进阶选择")
        dv.paragraph("#### 基础类型")
        dv.paragraph(searchCodepro0DropdownMaker('searchCodepro0', thisFile.file.path));
        if (searchCodepro0 == "n") {
            dv.paragraph("#### 注释颜色")
            dv.paragraph(searchCodepro1DropdownMaker('searchCodepro1', thisFile.file.path));
        } 
else if (searchCodepro0 == "i") {
            dv.paragraph("#### 图片颜色")
            dv.paragraph(searchCodepro1DropdownMaker('searchCodepro1', thisFile.file.path));
        } else {
            dv.paragraph("--->【请选择支持的选项组合】<---")
        }
        dv.paragraph("#### 附加类型")
        dv.paragraph(searchCodepro3DropdownMaker('searchCodepro3', thisFile.file.path));
        if (searchCodepro3 == "t") {
            dv.paragraph("#### 选择标签")
            dv.paragraph(tagsDropdownMaker('searchTag', thisFile.file.path));
        } 
else if (searchCodepro3 == "i") {
            dv.paragraph("#### 图片颜色")
            dv.paragraph(searchCodepro2DropdownMaker('searchCodepro2', thisFile.file.path));
        }
    } else {
        dv.paragraph("--->【请选择支持的选项组合】<---")
    }
    if (searchType == "color") {
        if (dv.current().searchColor == null) {
            var sQuery = 'line.includes("background-color: #")'
        } else {
            var sQuery = 'line.includes("background-color: #' + dv.current().searchColor + '")'
        }
    }
    if (searchType == "image") {
        if (dv.current().searchColor == null) {
            var sQuery = 'line.includes("image#")'
        } else {
            var sQuery = 'line.includes("image#' + dv.current().searchColor + '")'
        }
    }
    if (searchType == "tags") {
        if (dv.current().searchTag == null) {
            var sQuery = 'line.includes("🏷️ #📝")&&line.includes("span class=")'
        } else {
            var sQuery = 'line.includes("#' + dv.current().searchTag + '")&&line.includes("span class=")'
        }
    }

    if (searchType == "searchpro") {
        if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchCodepro2 == "a" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("image#")';
            sCode = '当前检索条件为: 红色注释及全色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchCodepro2 == "a" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("image#")';
            sCode = '当前检索条件为: 黄色注释及全色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchCodepro2 == "a" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("image#")';
            sCode = '当前检索条件为: 绿色注释及全色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchCodepro2 == "a" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("image#")';
            sCode = '当前检索条件为: 蓝色注释及全色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 红色注释及红色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 红色注释及黄色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 红色注释及绿色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 红色注释及蓝色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 黄色注释及红色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 黄色注释及黄色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 黄色注释及绿色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 黄色注释及蓝色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 绿色注释及红色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 绿色注释及黄色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 绿色注释及绿色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 绿色注释及蓝色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 蓝色注释及红色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 蓝色注释及黄色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 蓝色注释及绿色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 蓝色注释及蓝色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchCodepro2 == "a" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #")||line.includes("image#")';
            sCode = '当前检索条件为: 全色注释及全色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 全色注释及红色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 全色注释及黄色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 全色注释及绿色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 全色注释及蓝色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 紫色注释及红色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 紫色注释及黄色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 紫色注释及绿色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 紫色注释及蓝色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 紫色注释及紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 红色注释及紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 黄色注释及紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 绿色注释及紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 蓝色注释及紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 全色注释及紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchCodepro2 == "a" && searchCodepro3 == "i") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("image#")';
            sCode = '当前检索条件为: 紫色注释及全色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "r" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ff6666")||line.includes("image#ff6666")';
            sCode = '当前检索条件为: 红色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "y" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ffd400")||line.includes("image#ff6667")';
            sCode = '当前检索条件为: 黄色图及红色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "g" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("image#5fb236")||line.includes("image#ff6668")';
            sCode = '当前检索条件为: 绿色图及红色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "b" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("image#2ea8e5")||line.includes("image#ff6669")';
            sCode = '当前检索条件为: 蓝色图及红色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "p" && searchCodepro2 == "r" && searchCodepro3 == "i") { sQuery = 'line.includes("image#a28ae5")||line.includes("image#ff6670")';
            sCode = '当前检索条件为: 紫色图及红色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "r" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ff6666")||line.includes("image#ffd400")';
            sCode = '当前检索条件为: 红色图及黄色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "y" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ffd400")||line.includes("image#ffd401")';
            sCode = '当前检索条件为: 黄色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "g" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("image#5fb236")||line.includes("image#ffd402")';
            sCode = '当前检索条件为: 绿色图及黄色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "b" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("image#2ea8e5")||line.includes("image#ffd403")';
            sCode = '当前检索条件为: 蓝色图及黄色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "p" && searchCodepro2 == "y" && searchCodepro3 == "i") { sQuery = 'line.includes("image#a28ae5")||line.includes("image#ffd404")';
            sCode = '当前检索条件为: 紫色图及黄色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "r" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ff6666")||line.includes("image#5fb236")';
            sCode = '当前检索条件为: 红色图及绿色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "y" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ffd400")||line.includes("image#5fb237")';
            sCode = '当前检索条件为: 黄色图及绿色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "g" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("image#5fb236")||line.includes("image#5fb238")';
            sCode = '当前检索条件为: 绿色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "b" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("image#2ea8e5")||line.includes("image#5fb239")';
            sCode = '当前检索条件为: 蓝色图及绿色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "p" && searchCodepro2 == "g" && searchCodepro3 == "i") { sQuery = 'line.includes("image#a28ae5")||line.includes("image#5fb240")';
            sCode = '当前检索条件为: 紫色图及绿色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "r" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ff6666")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 红色图及蓝色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "y" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ffd400")||line.includes("image#2ea8e6")';
            sCode = '当前检索条件为: 黄色图及蓝色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "g" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("image#5fb236")||line.includes("image#2ea8e7")';
            sCode = '当前检索条件为: 绿色图及蓝色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "b" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("image#2ea8e5")||line.includes("image#2ea8e8")';
            sCode = '当前检索条件为: 蓝色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "p" && searchCodepro2 == "b" && searchCodepro3 == "i") { sQuery = 'line.includes("image#a28ae5")||line.includes("image#2ea8e9")';
            sCode = '当前检索条件为: 紫色图及蓝色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "r" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ff6666")||line.includes("image#2ea8e5")';
            sCode = '当前检索条件为: 红色图及紫色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "y" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("image#ffd400")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 黄色图及紫色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "g" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("image#5fb236")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 绿色图及紫色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "b" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("image#2ea8e5")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 蓝色图及紫色图' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "p" && searchCodepro2 == "p" && searchCodepro3 == "i") { sQuery = 'line.includes("image#a28ae5")||line.includes("image#a28ae5")';
            sCode = '当前检索条件为: 紫色图' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchTag != "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #ffd400")&&line.includes("#' + searchTag + '")';
            sCode = '当前检索条件为: 黄色注释且具有' + searchTag + '标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchTag != "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #5fb236")&&line.includes("#' + searchTag + '")';
            sCode = '当前检索条件为: 绿色注释且具有' + searchTag + '标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchTag != "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #2ea8e5")&&line.includes("#' + searchTag + '")';
            sCode = '当前检索条件为: 蓝色注释且具有' + searchTag + '标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchTag != "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #a28ae5")&&line.includes("#' + searchTag + '")';
            sCode = '当前检索条件为: 紫色注释且具有' + searchTag + '标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchTag != "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #ff6666")&&line.includes("#' + searchTag + '")';
            sCode = '当前检索条件为: 红色注释且具有' + searchTag + '标签的注释' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "r" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("image#ff6666")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 红色图及全部有标签的注释' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "y" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("image#ffd400")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 黄色图及全部有标签的注释' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "g" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("image#5fb236")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 绿色图及全部有标签的注释' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "b" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("image#2ea8e5")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 蓝色图及全部有标签的注释' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "p" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("image#a28ae5")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 紫色图及全部有标签的注释' } 
else if (searchCodepro0 == "i" && searchCodepro1 == "a" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("image#")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 全色图及全部有标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "a" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #")&&line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 全部具有' + searchTag + '标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "p" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #a28ae5")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 紫色注释及全部有标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "y" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #ffd400")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 黄色注释及全部有标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "g" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #5fb236")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 绿色注释及全部有标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "b" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #2ea8e5")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 蓝色注释及全部有标签的注释' } 
else if (searchCodepro0 == "n" && searchCodepro1 == "r" && searchTag == "" && searchCodepro3 == "t") { sQuery = 'line.includes("background-color: #ff6666")||line.includes("🏷️ #📝")';
            sCode = '当前检索条件为: 红色注释及全部有标签的注释' }
    }
    if (sQuery == "") { dv.paragraph("--->【请选择支持的选项组合】<---") }
    let valueOfSearchTerm = "";
    const files = app.vault.getMarkdownFiles()
    let path = files.filter(item => item.parent.path.includes(vaultpath)).sort(function(x, y) { return x.stat.ctime - y.stat.ctime })
    let arr = path.map(async(file) => {
        const content = await app.vault.cachedRead(file)
        var lines = await content.split(/\n\^KEY.{8}\n/).filter(line => {
            return (
                eval(sQuery)
            )
        })
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i] + "<p>"
        }
        return ["[[" + file.name.split(".")[0] + "]]", lines]
    })
    Promise.all(arr).then(values => {

        const exists = values.filter(value => value[1][0] && value[0] != "[[Dataview 卡片笔记]]")
        var outPages = 0
        for (let paperPages = 0; paperPages < exists.length; paperPages = paperPages + 1) {
            outPages = outPages + exists[paperPages][1].length
        }
        dv.paragraph(sCode)
        dv.paragraph("当前检索结果如下: ")
        dv.table(["文献共计 " + exists.length + " 篇", "笔记共计 " + outPages + " 条"], exists)
        //dv.table(["文献共计 " + exists.length + " 篇", "笔记共计 " + outPages + " 条"], exists)
    })
} else { dv.paragraph("# 请安装并启用插件【metaedit】") }
```