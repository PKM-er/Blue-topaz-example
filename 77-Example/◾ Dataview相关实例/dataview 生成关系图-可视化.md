---
---
%%
nodefield:: 
nodefield2:: 
linkfield:: 进度
linkfield2:: status
sourceTag:: book
exfolder::88-Template
homenode:: 
linkstring:: 
%%

```dataviewjs
function unique(arr) {
   return Array.from(new Set(arr)) 
}
function join_tag(arr) {
		let sourceTag_arr_res=[]
		let join_tags=''
		
		if (arr.length>1)
		{ 
			arr.forEach((value) => {
				if (value) if (!value.startsWith("#")) value = "#" + value;
				sourceTag_arr_res.push(value)
				})
				join_tags=	sourceTag_arr_res.join(' or ')
				
		}else
		{
	join_tags = "#"+arr; // value of "sourceTag"
	
	 
	}

	return join_tags
}
let nodefield = dv.current().nodefield ?? "file.name";
let nodefield2 = dv.current().nodefield2 ?? "";
let linkfield = dv.current().linkfield ?? "file.folder";
let linkfield2 = dv.current().linkfield2 ?? "";
let sourceTag = dv.current().sourceTag??'';
let exfolder = dv.current().exfolder??'88-Template';
let homenode = dv.current().homenode??false;
let sourceTag_arr=sourceTag?.split(',')
let linkstring=dv.current().linkstring??"";
const valueOfsourceTag = join_tag(sourceTag_arr);
 
dv.paragraph("### 通过节点生成关系图<br><br>");
const metaeditEnabled = app.plugins.enabledPlugins.has("metaedit");
if (metaeditEnabled === true) {
    const { update } = this.app.plugins.plugins["metaedit"].api;
    const thisFile = dv
        .pages()
        .where((f) => f.file.path == dv.current().file.path);

    const inputMaker = (pn, input_value, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath);
        const input = this.container.createEl("input");
        input.setAttribute("name", "input");
        input.setAttribute("id", pn);
        input.setAttribute("placeholder", "输入值后回车生效");
        input.setAttribute("value", input_value);
        input.addEventListener("keyup", async function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                await update(pn, this.value, file);
            }
        });
        return input;
    };
   
const keysDropdownMaker = (pn,pv, fpath,source) => {
		const file = this.app.vault.getAbstractFileByPath(fpath)
		let allkeys = []
		let filefield=['file.name','file.link','file.folder','file.outlinks','file.inlinks']
		let sourceTag_arr=source?.split(',')
		let valueOfsourceTag = join_tag(sourceTag_arr);
		const pages = dv.pages(valueOfsourceTag)
		pages.forEach((page, index) => {
		allkeys.push(Object.keys(page))
		})
		allkeys =unique(allkeys.flat())
		 allkeys= allkeys.concat(filefield)
		const keys = Object.values(allkeys).sort();
		keys.unshift("")
		const dropdown = this.container.createEl('select');
		keys.forEach((key, index) => {
			var opt = key
			var el = dropdown.createEl('option');
		opt != "" ? el.textContent = opt : el.textContent = "Null";
			el.value = opt;
			dropdown.appendChild(el);
		})
		keys.indexOf(pv.toString()) < 0 ? dropdown.selectedIndex = 0 : dropdown.selectedIndex = keys.indexOf(pv.toString())

		dropdown.addEventListener('change', async evt => {
			evt.preventDefault();
			await update(pn, keys[dropdown.selectedIndex], file)
		})
		return dropdown
	}
    const tagsDropdownMaker = (pn,pv, fpath) => {
        const file = this.app.vault.getAbstractFileByPath(fpath);
        const tags = Object.keys(app.metadataCache.getTags()).sort();
        tags.unshift("#");
        const dropdown = this.container.createEl("select");
        dropdown.setAttribute("multip", "");
        dropdown.setAttribute("id", "filter_tags_mermaid");
        tags.forEach((tag, index) => {
            var opt = tag;
            var el = dropdown.createEl("option");
            opt != "#" ? (el.textContent = opt) : (el.textContent = "All Pages");
            let sourceTag_arr = pv.split(",");
            sourceTag_arr.forEach((value) => {
                opt === "#" + value ? el.setAttribute("choose", "") : "";
            });
            el.value = opt;
            dropdown.appendChild(el);
        });

        tags.indexOf("#" + pv.toString()) < 0
            ? (dropdown.selectedIndex = 0)
            : (dropdown.selectedIndex = tags.indexOf("#" + pv.toString()));
        dropdown.addEventListener("change", async (evt) => {
            evt.preventDefault();
            const tag_select = this.container.querySelector("[hidden]")?.value;
            let tag_select_arr = tag_select.split(",");
            let tag_select_arr_res = [];
            tag_select_arr.forEach((value) => {
                if (value != "#") {
                    value = value.replace("#", "");
                    tag_select_arr_res.push(value);
                } else {
                    tag_select_arr_res = [];
                }
            });
            //await update(pn,tag_select, file)
            await update(pn, tag_select_arr_res.join(), file);
        });
        return dropdown;
    };
	
	
	
	
    // Output

    dv.el("dvjs", "");
    dv.el("b", "节点字段:&ensp;", {
        attr: { "style": "font-size:1.5em;display: inline-table" },
    });
 	dv.el("b", keysDropdownMaker('nodefield',nodefield, dv.current().file.path,sourceTag), {
       attr: { "style":"display: inline-table" },
    });
      dv.el("b", "节点字段2:&ensp;", {
        attr: { "style": "font-size:1.5em;display: inline-table" },
    });
 	dv.el("b", keysDropdownMaker('nodefield2',nodefield2, dv.current().file.path,sourceTag), {
       attr: { "style":"display: inline-table" },
    });

    dv.el("br")
         dv.el("b", "链接字段:&ensp;", {
        attr: { "style": "font-size:1.5em;display: inline-table" },
    });
    
    dv.el("b", keysDropdownMaker('linkfield',linkfield, dv.current().file.path,sourceTag), {
       attr: { "style":"display: inline-table" },
    });
         dv.el("b", "链接字段2:&ensp;", {
        attr: { "style": "font-size:1.5em;display: inline-table" },
    });
    
    dv.el("b", keysDropdownMaker('linkfield2',linkfield2, dv.current().file.path,sourceTag), {
       attr: { "style":"display: inline-table" },
    });
      dv.el("br")
  	 dv.el("b", "标签过滤:&ensp;", {
	        attr: { "style": "font-size:1.5em;display: inline-table" },
	    });
	dv.el("b", tagsDropdownMaker('sourceTag',sourceTag, dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
    dv.el("br")
 	 dv.el("b", "主节点:&ensp;", {
	        attr: { "style": "font-size:1.5em;display: inline-table" },
	    });
	dv.el("b", inputMaker('homenode',homenode, dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
	 dv.el("b", "链接符:&ensp;", {
	        attr: { "style": "font-size:1.5em;display: inline-table" },
	    });
	dv.el("b", inputMaker('linkstring',linkstring, dv.current().file.path), {
       attr: { "style":"display: inline-table" },
    });
 
   
} else {
    dv.paragraph(
        "<strong>!!! 请启用 MetaEdit 插件，然后重新加载文档!!!</strong>"
    );
}


const script = this.container.createEl("script");
script.text = `(function() {
		selectMultip = {
			register: function(id) {
				if(id)
				{
					var e = document.getElementById(id);
					render(e);
					}else
				{
					document.querySelectorAll("[multip]").forEach(function(e) {
					render(e);
				})
				}
			},
			reload: function(id, data, setData) {
				var htm = "";
				for(var i = 0; i < data.length; i++) {
					htm += '<option value="' + data[i].value + '">' + data[i].text + '</option>'
				}
				var e = document.getElementById(id);
				e.innerHTML = htm;
				render(e);
				this.setVal(id, setData);
			},
			setVal: function(id, str) {
				var type = Object.prototype.toString.call(str);
				switch(type) {
					case "[object String]":
						document.getElementById(id).val = str;
						break;
					case "[object Array]":
						document.getElementById(id).val = str.toString();
						break;
					default:
						break;
				}
			},
			getVal: function(id) {
				return document.getElementById(id).val;
			},
 
		}
 
		function render(e) {
			e.param = {
				arr: [],
				valarr: [],
				opts: []
			};
			var choosevalue = "",
				op;
			for(var i = 0; i < e.length; i++) {
				op = e.item(i);
				e.param.opts.push(op);
				if(op.hasAttribute("choose")) {
					if(choosevalue == "") {
						choosevalue = op.value
					} else {
						choosevalue += "," + op.value;
					}
 
				}
			}
			var option = document.createElement("option");
			option.hidden = true;
			e.appendChild(option);
			e.removeEventListener("input", selchange);
			e.addEventListener("input", selchange);
			
			Object.defineProperty(e, "val", {
				get: function() {
					return this.querySelector("[hidden]").value;
				},
				set: function(value) {
					e.param.valarr = [];
					var valrealarr = value == "" ? [] : value.split(",");
					e.param.arr = [];
					e.param.opts.filter(function(o) {
						o.style = "";
					});
					if(valrealarr.toString()) {
						for(var i = 0; i < valrealarr.length; i++) {
							e.param.opts.filter(function(o) {
								if(o.value == valrealarr[i]) {
									o.style = "color: blue;";
									e.param.arr.push(o.text);
									e.param.valarr.push(o.value)
								}
							});
						}
						this.options[e.length - 1].text = e.param.arr.toString();
						this.options[e.length - 1].value = e.param.valarr.toString();
						this.options[e.length - 1].selected = true;
					} else {
						this.options[0].selected = true;
					}
 
				},
				configurable: true
			})
			//添加属性choose 此属性添加到option中用来指定默认值
			e.val = choosevalue;
		}
 
		function selchange() {
			var text = this.options[this.selectedIndex].text;
			var value = this.options[this.selectedIndex].value;
			this.options[this.selectedIndex].style = "color: blue;";
			var ind = this.param.arr.indexOf(text);
			if(ind > -1) {
				this.param.arr.splice(ind, 1);
				this.param.valarr.splice(ind, 1);
				this.param.opts.filter(function(o) {
					if(o.value == value) {
						o.style = "";
					}
				});
			} else {
				this.param.arr.push(text);
				this.param.valarr.push(value);
			}
			this.options[this.length - 1].text = this.param.arr.toString();
			this.options[this.length - 1].value = this.param.valarr.toString();
			if(this.param.arr.length > 0) {
				this.options[this.length - 1].selected = true;
			} else {
				this.options[0].selected = true;
			}
		}
	})();
	selectMultip.register("filter_tags_mermaid");
	`;

 
//from [Custom Mermaid chart from dataview queries (Obsidian) (github.com)](https://gist.github.com/Ji11ard/fc4e2e0f7e66820bf42a94421f21a69b)
//Modified by cuman
//NODES
//Use DQL queries to pull in any nodes you want displayed
//Queries should return at least five columns (others ignored)
//|| Page || DisplayName || OpenBracket || CloseBracket || StyleClass
//First column can be a page object, unlinked ref, or a string.
//Multiple queries can be added to the array
var nodesQueries = [];
nodesQueries.push('TABLE '+nodefield+', "([", "])", "S1" FROM '+valueOfsourceTag+' where !contains(file.folder, "'+exfolder+'")')
if(!!nodefield2)
nodesQueries.push('TABLE '+nodefield2+', "([", "])", "S2" FROM '+valueOfsourceTag+' WHERE '+nodefield2+' FLATTEN '+nodefield2+' where !contains(file.folder, "'+exfolder+'")')
//nodesQueries.push('TABLE WITHOUT ID author, default(author.file.name, meta(author).path), "{{", "}}", "S2" from #book1 WHERE author FLATTEN author where !contains(file.folder, "'+exfolder+'")')
console.log(nodesQueries,1)
//LINKS
//Use DQL queries to pull in the relationships you want displayed
//Queries should return at least three columns
//|| PageA || PageB || linkLabel
//First column is origin of the link (page, unlinkedRef, or string)
//Second column is destination (page, unlinkedRef, or string)
//Third is the label to include on link ("" for none). 
var linksQueries = [];
linksQueries.push('TABLE  '+linkfield+', "'+linkstring+'" FROM '+valueOfsourceTag+'  WHERE '+linkfield+' FLATTEN '+linkfield+' where !contains(file.folder, "'+exfolder+'")')
if(!!linkfield2)
linksQueries.push('TABLE  '+linkfield2+', "'+linkstring+'" FROM '+valueOfsourceTag+'  WHERE '+linkfield2+' FLATTEN '+linkfield2+' where !contains(file.folder, "'+exfolder+'")')
console.log(linksQueries,2)
//STYLES
//Define class styles for different types of nodes you want displayed.
//Use these by name in your DQL node queries below.
var styles = [];
styles.push("classDef S1 fill:#DDEEFF,color:#000,stroke:#000,stroke-width:1px")
styles.push("classDef S2 fill:#FFEEDD,color:#000,stroke:#000,stroke-width:1px")
styles.push("classDef S3 fill:#E0FFE0,color:#000,stroke:#000,stroke-width:1px")


//Add a home node that the first Query nodes get connected to by default (otherwise floating)
let useHomeNode = homenode;

//Set flowchart direction
let direction = "LR" //vs TD


// --- FOR BASIC STUFF, SHOULDNT NEED TO CHANGE MUCH BELOW HERE
//fontmatter
let mFront = "```mermaid\ngraph " + direction + "\n\n"

//Create all the nodes by running/merging queries above
//nodeID[Text of Node]:::class
var nodes = "%%---NODES---\n";
if (useHomeNode) {nodes = nodes + "HOMENODE["+useHomeNode+"]\n"}
for (var q = 0; q < nodesQueries.length; q++) {
	let DQLResults = await dv.tryQuery(nodesQueries[q]);
	DQLResults.values.forEach(node => {
		//if node can be a page, use file name, otherwise as string (handles unlinked ref)
		let name = (dv.page(node[0]) ? 
			dv.page(node[0]).file.name : 
			String(node[0]).split("|")[0].replace(/[\[\]]/g, ''));
		let ID = name.replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]/g, '');
		let displayName = node[1];
		let open = node[2];
		let close = node[3];
		let nodeFormat = node[4];
		nodes = nodes + 
			(q == 0 && useHomeNode ? "HOMENODE --> " : "") +
			ID + open + "\"" +
			"<div style='padding:5px;'><a class='internal-link' href='" + name + ".md'>" + 
			displayName + "</a></div>\"" + close + //visible text
			":::" + nodeFormat + "\n"; //formatting class
	});
	nodes = nodes + "\n";
};

//Create all links by running/merging queries above
var links = "%%---LINKS---\n";
for (var q = 0; q < linksQueries.length; q++) {
	let DQLResults = await dv.tryQuery(linksQueries[q]);
		DQLResults.values.forEach(link => {
		//if node can be a page, use file name, otherwise as string (handles unlinked ref)
		let nodeAName = (dv.page(link[0]) ? 
				dv.page(link[0]).file.name : 
				String(link[0]).split("|")[0].replace(/[\[\]]/g, '') );
		let nodeBName = (dv.page(link[1].toString()) ? 
				dv.page(link[1]).file.name : 
				String(link[1]).split("|")[0].replace(/[\[\]]/g, '') );
		let nodeAID = nodeAName.replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]/g, '');
		let nodeBID = String(nodeBName).split("|")[0].replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]/g, '');
		let linkLabel = link[2].toString();
		links = links + 
		    nodeAID + 
		    (linkLabel == "" ? " --> " : " -- " + linkLabel + " --> ") +
		    nodeBID + "\n";
	});
	links = links + "\n";
};

//formatting classes
var styleClasses = "%%---STYLES---\n";
for (var s = 0; s < styles.length; s++) {
	links = links + styles[s] + "\n"
}

var mEnd = "```";
 
dv.span(mFront + nodes + links + styleClasses + mEnd);
```

