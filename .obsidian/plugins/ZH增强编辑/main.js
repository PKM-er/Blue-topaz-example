'use strict';

var obsidian = require('obsidian');

/*
*****************************************************************************
使用声明
本插件基于多款社区插件改编而成，蚕子水平有限，代码或许存在缺陷，不能保证任何用户或任何操作均为正常，
请您在使用本插件之前，先备份好Obsidian笔记库再进行操作测试，谢谢配合。
开发：蚕子 QQ：312815311 更新时间：2022-1-18
*****************************************************************************
*/

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Settings = /** @class */ (function () {
    function Settings() {
        this.defaultChar = '';
        this.jtList = "";
        this.ftList = "";
    }
    Settings.prototype.toJson = function () {
        return JSON.stringify(this);
    };
    Settings.prototype.fromJson = function (content) {
        var obj = JSON.parse(content);
        this.defaultChar = obj['defaultChar'];
        this.jtList = obj['jtList'];
        this.ftList = obj['ftList'];
    };
    return Settings;
}());

var MyPlugin = /** @class */ (function (_super) {
    __extends(MyPlugin, _super);
    var DEFAULT_PATH = "words.txt";
    var 文件名列表 = new Array();
    function MyPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.settings = new Settings();
        _this.SETTINGS_PATH = '.obsidian/plugins/ZH增强编辑/data.json';        
        return _this;
    }

    MyPlugin.prototype.onload = function () {
        var _this = this;
        /*
        this.registerEvent(this.app.workspace.on('file-open', function (file) {
            if (file && file.path) {
                //_this.currentFile = file;
                var view = _this.app.workspace.activeLeaf.view;
                var lines = _this.获取笔记全文 (_this.获取编辑模式 ());
                if(!lines) return;
                
                var links = lines.match(/\[\[[^\[\]]+\]\]/g);
                var tempTxt = links.toString().replace(/,/g,"\n");
                var _file = _this.app.vault.getAbstractFileByPath("000.md");
                if(links.length>0){
                    //new obsidian.Notice(tempTxt);
                    _this.app.vault.modify(_file,"对外链接\n"+tempTxt);
                }else{
                    _this.app.vault.modify(_file,"对外链接\n......");
                }
            }
        }));
        */

    	return __awaiter(this, void 0, void 0,function() {
            var _this = this;
            return __generator(this,function(_a) {
		        console.log('加载插件');
		        _this.addCommand({
		            id: 'internal-link',
		            name: '[[链接]]语法',
		            callback: function () {	_this.转换内部链接();},
		            hotkeys: [{ modifiers: ["Alt"], key: "Z" } ]
		        });
                _this.addCommand({
		            id: 'internal-link2',
		            name: '[[链接|同名]]语法',
		            callback: function () {	_this.转换同义链接();},
		            hotkeys: [{ modifiers: ["Alt"], key: "Q" } ]
		        });
                _this.addCommand({
		            id: 'md-list',
		            name: '获取笔记标题列表',
		            callback: function () {	_this.获取笔记标题列表();}
		        });

                _this.addCommand({
		            id: 'auto-text',
		            name: '智转括号',
		            callback: function () {	_this.智能括号();},
		            hotkeys: [{ modifiers: ["Alt"], key: ";" } ]
		        });

                _this.addCommand({
		            id: 'biaoti0-text',
		            name: '取消标题',
		            callback: function () {	_this.标题语法("");},
		            hotkeys: [{ modifiers: ["Mod"], key: "`" } ]
		        });
                _this.addCommand({
		            id: 'biaoti1-text',
		            name: 'H1标题',
		            callback: function () {	_this.标题语法("#");},
		            hotkeys: [{ modifiers: ["Mod"], key: "1" } ]
		        });
                _this.addCommand({
		            id: 'biaoti2-text',
		            name: 'H2标题',
		            callback: function () {	_this.标题语法("##");},
		            hotkeys: [{ modifiers: ["Mod"], key: "2" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti3-text',
		            name: 'H3标题',
		            callback: function () {	_this.标题语法("###");},
		            hotkeys: [{ modifiers: ["Mod"], key: "3" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti4-text',
		            name: 'H4标题',
		            callback: function () {	_this.标题语法("####");},
		            hotkeys: [{ modifiers: ["Mod"], key: "4" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti5-text',
		            name: 'H5标题',
		            callback: function () {	_this.标题语法("#####");},
		            hotkeys: [{ modifiers: ["Mod"], key: "5" } ]
		        }); 
                _this.addCommand({
		            id: 'biaoti6-text',
		            name: 'H6标题',
		            callback: function () {	_this.标题语法("######");},
		            hotkeys: [{ modifiers: ["Mod"], key: "6" } ]
		        });                  
                _this.addCommand({
		            id: 'cuti-text',
		            name: '**粗体**',
		            callback: function () {	_this.转换粗体();},
		            hotkeys: [{ modifiers: ["Alt"], key: "C" } ]
		        }); 
                _this.addCommand({
		            id: 'gaoliang-text',
		            name: '==高亮==',
		            callback: function () {	_this.转换高亮();},
		            hotkeys: [{ modifiers: ["Alt"], key: "G" } ]
		        });
                _this.addCommand({
		            id: 'xieti-text',
		            name: '_斜体_',
		            callback: function () {	_this.转换斜体();},
		            hotkeys: [{ modifiers: ["Alt"], key: "X" } ]
		        });
                _this.addCommand({
		            id: 'shanchu-text',
		            name: '~~删除线~~',
		            callback: function () {	_this.转换删除线();},
		            hotkeys: [{ modifiers: ["Alt"], key: "S" } ]
		        });
                _this.addCommand({
		            id: 'xiahua-text',
		            name: '_下划线_',
		            callback: function () {	_this.转换下划线();},
		            hotkeys: [{ modifiers: ["Alt"], key: "H" } ]
		        });
                _this.addCommand({
		            id: 'zhuozhong-text',
		            name: '`行内代码`',
		            callback: function () {	_this.转换行内代码();},
		            hotkeys: [{ modifiers: ["Alt"], key: "D" } ]
		        });     
                _this.addCommand({
		            id: 'add-daima',
		            name: '```代码块```',
		            callback: function () {	_this.转换代码块();}
		        });
                _this.addCommand({
		            id: 'add-langxian',
		            name: '~~~三浪线~~~',
		            callback: function () {	_this.转换三浪线();}
		        });
                _this.addCommand({
		            id: 'add-up',
		            name: '上标语法',
		            callback: function () {	_this.转换上标();},
		            hotkeys: [{ modifiers: ["Alt"], key: "U" } ]
		        });
                _this.addCommand({
		            id: 'add-ub',
		            name: '下标语法',
		            callback: function () {	_this.转换下标();},
		            hotkeys: [{ modifiers: ["Alt"], key: "N" } ]
		        });
                _this.addCommand({
		            id: 'add-todo',
		            name: '转换待办状态',
		            callback: function () {	_this.转换待办列表();}
		        });
                _this.addCommand({
		            id: 'add-tiankong',
		            name: '转换挖空',
		            callback: function () {	_this.转换挖空();}
		        });

                _this.addCommand({
		            id: 'text-Color1',
		            name: '转换红色文字',
		            callback: function () {	_this.转换文字颜色("#ff0000");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "1" } ]
		        });
                _this.addCommand({
		            id: 'text-Color2',
		            name: '转换橙色文字',
		            callback: function () {	_this.转换文字颜色("#ff9900");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "2" } ]
		        });
                _this.addCommand({
		            id: 'text-Color3',
		            name: '转换黄色文字',
		            callback: function () {	_this.转换文字颜色("#ffff00");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "3" } ]
		        });
                _this.addCommand({
		            id: 'text-Color4',
		            name: '转换绿色文字',
		            callback: function () {	_this.转换文字颜色("#00ff00");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "4" } ]
		        });
                _this.addCommand({
		            id: 'text-Color5',
		            name: '转换青色文字',
		            callback: function () {	_this.转换文字颜色("#6495ED");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "5" } ]
		        });
                _this.addCommand({
		            id: 'text-Color6',
		            name: '转换蓝色文字',
		            callback: function () {	_this.转换文字颜色("#7B68EE");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "6" } ]
		        });
                _this.addCommand({
		            id: 'text-Color7',
		            name: '转换紫色文字',
		            callback: function () {	_this.转换文字颜色("#ff00ff");},
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "7" } ]
		        });

                _this.addCommand({
		            id: 'text-background1',
		            name: '转换红色背景',
		            callback: function () {	_this.转换背景颜色("#ff0000");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "1" } ]
		        });
                _this.addCommand({
		            id: 'text-background2',
		            name: '转换橙色背景',
		            callback: function () {	_this.转换背景颜色("#ff9900");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "2" } ]
		        });
                _this.addCommand({
		            id: 'text-background3',
		            name: '转换黄色背景',
		            callback: function () {	_this.转换背景颜色("#ffff00");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "3" } ]
		        });
                _this.addCommand({
		            id: 'text-background4',
		            name: '转换绿色背景',
		            callback: function () {	_this.转换背景颜色("#00ff00");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "4" } ]
		        });
                _this.addCommand({
		            id: 'text-background5',
		            name: '转换青色背景',
		            callback: function () {	_this.转换背景颜色("#6495ED");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "5" } ]
		        });
                _this.addCommand({
		            id: 'text-background6',
		            name: '转换蓝色背景',
		            callback: function () {	_this.转换背景颜色("#7B68EE");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "6" } ]
		        });
                _this.addCommand({
		            id: 'text-background7',
		            name: '转换紫色背景',
		            callback: function () {	_this.转换背景颜色("#ff00ff");},
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "7" } ]
		        });
                _this.addCommand({
		            id: 'common-text',
		            name: '转换无语法文本',
		            callback: function () {	_this.转换无语法文本();},
		            hotkeys: [{ modifiers: ["Mod","Alt"],key: "Z"}]
		        });
                _this.addCommand({
		            id: 'copy-text',
		            name: '获取无语法文本',
		            callback: function () {	_this.获取无语法文本();},
		            hotkeys: [{ modifiers: ["Mod","Alt"],key: "C"}]
		        });

                _this.addCommand({
		            id: 'add-kh1',
		            name: '【选文】',
		            callback: function () {	_this.括选文本1();},
		        });
                _this.addCommand({
		            id: 'add-kh2',
		            name: '（选文）',
		            callback: function () {	_this.括选文本2();},
		        });
                _this.addCommand({
		            id: 'add-kh3',
		            name: '「选文」',
		            callback: function () {	_this.括选文本3();},
		        });
                _this.addCommand({
		            id: 'add-kh4',
		            name: '《选文》',
		            callback: function () {	_this.括选文本4();},
		        });
                _this.addCommand({
		            id: 'auto-texts',
		            name: '自动设置标题',
		            callback: function() { _this.自动设置标题(); }
		        });
                _this.addCommand({
		            id: 'ying-zhong',
		            name: '英转中文标点',
		            callback: function() { _this.英转中文标点(); }
		        });
                _this.addCommand({
		            id: 'zhong-ying',
		            name: '中转英文标点',
		            callback: function() { _this.中转英文标点(); }
		        });
                _this.addCommand({
		            id: 'file-path',
		            name: '转换路径',
		            callback: function() { _this.转换路径(); }
		        });
                _this.addCommand({
		            id: 'jian-fan',
		            name: '简体转繁',
		            callback: function() { _this.简体转繁(); }
		        });
                _this.addCommand({
		            id: 'fan-jian',
		            name: '繁体转简',
		            callback: function() { _this.繁体转简(); }
		        });

                _this.addCommand({
		            id: 'paste-form',
		            name: '粘贴表格',
		            callback: function() { _this.粘贴表格(); },
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "V" } ]
		        });
                _this.addCommand({
		            id: 'edit-jiucuo',
		            name: '修复错误语法',
		            callback: function() { _this.修复错误语法(); }
		        });
                _this.addCommand({
		            id: 'del-line2',
		            name: '修复意外断行',
		            callback: function() { _this.修复意外断行(); }
		        });
                _this.addCommand({
		            id: 'search-text',
		            name: '搜索当前文本',
		            callback: function() { _this.搜索当前文本(); }
		        });
                _this.addCommand({
		            id: 'selection-text',
		            name: '选择当前整段',
		            callback: function() { _this.选择当前整段(); }
		        });
                _this.addCommand({
		            id: 'selection-juzi',
		            name: '选择当前整句',
		            callback: function() { _this.选择当前整句(); }
		        });
                /*_this.addCommand({
		            id: 'next-mdfile',
		            name: '同目录下一笔记',
		            callback: function() { _this.同目录下一笔记(); },
		            hotkeys: [{ modifiers: ["Mod","Shift","Alt"], key: "N" } ]
		        });
                _this.addCommand({
		            id: 'view-time',
		            name: '获取时间信息',
		            callback: function () {	_this.获取时间信息();},
		            hotkeys: [{ modifiers: ["Mod","Shift"],key: "T"}]
		        }); */
                _this.addCommand({
		            id: 'tiqu-text',
		            name: '获取标注文本',
		            callback: function () {	_this.获取标注文本();}
		        });
                _this.addCommand({
		            id: 'copy-filePath',
		            name: '获取相对路径',
		            callback: function() { _this.获取相对路径(); }  
		        });
                _this.addCommand({
		            id: 'modify-fileName',
		            name: '指定当前文件名',
		            callback: function() { _this.指定当前文件名(); }  
		        });
                _this.addCommand({
		            id: 'iframe-URL',
		            name: '嵌入当前网址页面',
		            callback: function() { _this.嵌入当前网址页面(); } 
		        });

		        _this.addCommand({
		            id: 'add-lines',
		            name: '批量插入空行',
		            callback: function() { _this.批量插入空行(); },
		            hotkeys: [{ modifiers: ["Mod","Shift"], key: "L" } ]    
		        });
                _this.addCommand({
		            id: 'add-line1',
		            name: '上方插入空行',
		            callback: function() { _this.上方插入空行(); }, 
		        });
                _this.addCommand({
		            id: 'add-line2',
		            name: '下方插入空行',
		            callback: function() { _this.下方插入空行(); }
		        });
		        _this.addCommand({
		            id: 'del-lines',
		            name: '批量去除空行',
		            callback: function() { _this.批量去除空行(); },
		            hotkeys: [{ modifiers: ["Mod","Alt"], key: "l" } ]
		        });
                _this.addCommand({
		            id: 'add-space',
		            name: '末尾追加空格',
		            callback: function() { _this.末尾追加空格(); }
		        });
		        _this.addCommand({
		            id: 'del-space',
		            name: '去除末尾空格',
		            callback: function() { _this.去除末尾空格(); }
		        });
                _this.addCommand({
		            id: 'add-allSpspace',
		            name: '添加中英间隔',
		            callback: function() { _this.添加中英间隔(); }
		        });
                _this.addCommand({
		            id: 'del-allSpspace',
		            name: '去除所有空格',
		            callback: function() { _this.去除所有空格(); }
		        });

                _this.addSettingTab(new SettingsTab(_this.app, _this));
		        _this.loadSettings();
                return [2];
             });
        });
    };
    MyPlugin.prototype.onunload = function () {
        console.log('卸载插件');
    };
    MyPlugin.prototype.saveSettings = function () {
        var _this = this;
        var settings = _this.settings.toJson();
        _this.app.vault.adapter.write(_this.SETTINGS_PATH, settings); 
    };
    MyPlugin.prototype.loadSettings = function () {
    	console.log("加载插件");
        var _this = this;
        _this.app.vault.adapter.read(_this.SETTINGS_PATH).
            then(function (content) { return _this.settings.fromJson(content); }).
            catch(function (error) { console.log("未找到设置文件。"); });
    };

    MyPlugin.prototype.转换内部链接 = function() {
    	var _defaultChar = this.settings.defaultChar;
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        if (!lines) {
        	this.替换所选文本 (this.获取编辑模式 (), "[[");
        	return;
        }
        //new obsidian.Notice("划选内容："+lines);
        var link = /[\"\|\[\]\?\\\*\<\>\/:]/g;	//是否包含[]()及标点符号
        var link0 = /\[\[|\]\]/g;
        var link1 = /^([^\[\]]*)!\[+([^\[\]]*)$|^([^\[\]]*)\[+([^\[\]]*)$|^([^\[\]]*)\]+([^\[\]]*)$|^([^\[\]]*)\[([^\[\]]*)\]([^\[\]]*)$/g;	//是否只包含一侧的[[或]]
  		var link2 = /^[^\[\]]*(\[\[[^\[\]]*\]\][^\[\]]*)+$/g;	//是否包含N组成对的内链语法
  		var link4 = /([^\[\]\(\)\r\n]*)(\n*)(http.*)/mg;	//是否包含 说明文本&网址
	  	var link5 = /!?\[([^\[\]\r\n]*)(\n*)\]\((http[^\(\)]*)\)/mg;	//是否包含 [说明文本](网址)
  		var link8 = eval("/(["+_defaultChar+"])/g");
	  	if (link.test(lines)) {
	  		if (link1.test(lines)){
                new obsidian.Notice("划选内容不符合内链语法格式！");
	  			return;
	  		}else if (link2.test(lines)){
                //new obsidian.Notice("划选内容包含内链语法格式！");
	  			lines = lines.replace(/(\[\[(.*\|)*)/g,"");
                lines = lines.replace(/\]\]/g,"");
	  		}else if(link5.test(lines)){
	  			lines = lines.replace(link5,"$1$3");
                //new obsidian.Notice("划选内容包含有[]()链接语法！");
	  		}else if(link4.test(lines)){
	  			lines = lines.replace(link4,"[$1]($3)");
	  			lines = lines.replace("[\r\n]","");
                //new obsidian.Notice("划选内容包含有说明文本和网址！");
	  		}else{
                new obsidian.Notice("文件名不能包含下列字符:\*\"\\\/\<\>\:\|\?");
                return;
            }
		}else{
            //new obsidian.Notice("划选内容未包含内链语法格式！需要转换");
			if (link8.test(lines)){
				lines = lines.replace(link8, "]]$1[[");
			}
			lines = "[[" + lines + "]]";
		}
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换同义链接 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var lNum = lines.length +3
        if (!lines) {
        	this.替换所选文本 (this.获取编辑模式 (), "[[");
        	return;
        }
        var link = /[\"\|\[\]\?\\\*\<\>\/:\n]/g;	//是否包含[]()及标点符号
  	  	if (link.test(lines)) {
            return;
		}else{
			lines = "[[|" + lines + "]]";
		}
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        var i=0;
        while (i<lNum){
            cmEditor.exec("goLeft");
            i++;
        }
    };

    MyPlugin.prototype.转换粗体 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\*\*[^\*]*\*\*/;	//是否包含高亮符号
        var link1 = /^[^\*]*\*\*[^\*]*$/;	//是否只包含一侧的**
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现==符号");
        }else if (link.test(lines)){
            lines = lines.replace(/\*\*/g,"");    //new obsidian.Notice("成对出现**符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"**$1**");
            lines = lines.replace(/^\*\*\*\*$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.exec("goRight");
    };
    MyPlugin.prototype.转换高亮 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /==[^=]*==/;	//是否包含高亮符号
        var link1 = /^[^=]*==[^=]*$/;	//是否只包含一侧的==
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现==符号");
        }else if (link.test(lines)){
            lines = lines.replace(/==/g,"");    //new obsidian.Notice("成对出现==符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"==$1==");
            lines = lines.replace(/^====$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.exec("goRight");
    };
    MyPlugin.prototype.转换斜体 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /_[^_]*_/;	//是否包含高亮符号
        var link1 = /^[^_]*_[^_]*$/;	//是否只包含一侧的_
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现_符号");
        }else if (link.test(lines)){
            lines = lines.replace(/_/g,"");    //new obsidian.Notice("成对出现_符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"_$1_");
            lines = lines.replace(/^__$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.exec("goRight");
    };
    MyPlugin.prototype.转换删除线 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /~~[^~]*~~/;	//是否包含删除线符号
        var link1 = /^[^~]*~~[^~]*$/;	//是否只包含一侧的~~
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现~~符号");
        }else if (link.test(lines)){
            lines = lines.replace(/~~/g,"");    //new obsidian.Notice("成对出现~~符号");
        }else{
            lines = lines.replace(/^(.*)$/mg,"~~$1~~");
            lines = lines.replace(/^~~~~$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.exec("goRight");
    };
    MyPlugin.prototype.转换下划线 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\<u\>([^\<\>]*)\<\/u\>/mg;	//是否包含下划符号
        var link1 = /^[^\<\>]*\<\/?u\>[^\<\>]*$/;	//是否只包含一侧的<>
        if (link1.test(lines)){
            return; //new obsidian.Notice("只有一侧出现<>符号");
        }else if (link.test(lines)){
            lines = lines.replace(link,"$1");
        }else{
            lines = lines.replace(/^(.*)$/mg,"<u>$1</u>");
            lines = lines.replace(/^\<u\>\<\/u\>$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };
    MyPlugin.prototype.转换行内代码 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /`[^`]*`/;	//是否包含代码行符号
        var link1 = /^[^`]*`[^`]*$/;	//是否只包含一侧的`

        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现`符号");
            return;
        }else if (link.test(lines)){
            //new obsidian.Notice("成对出现`符号");
            lines = lines.replace(/`/g,"");
        }else{
            //new obsidian.Notice("需要补充`符号");
            lines = lines.replace(/^(.*)$/mg,"`$1`");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换代码块 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /```[^`]+```/;	//是否包含代码行符号
        var link1 = /^[^`]*```[^`]*$/m;	//是否只包含一侧的`

        lines = lines.replace(/\n/g,"↫");
        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现```符号");
            return;
        }else if (link.test(lines)){
            //new obsidian.Notice("成对出现```符号");
            lines = lines.replace(/```↫?|↫?```/g,"");
        }else{
            //new obsidian.Notice("需要补充```符号");
            lines = lines.replace(/^(.*)$/m,"```$1↫```");
        }
        lines = lines.replace(/↫/g,"\n");
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.exec("goLeft");
        cmEditor.exec("goLeft");
        cmEditor.exec("goLeft");
    };

    MyPlugin.prototype.转换三浪线 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /~~~[^~]+~~~/;	//是否包含代码行符号
        var link1 = /^[^~]*~~~[^~]*$/m;	//是否只包含一侧的~

        lines = lines.replace(/\n/g,"↫");
        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现~~~符号");
            return;
        }else if (link.test(lines)){
            //new obsidian.Notice("成对出现~~~符号");
            lines = lines.replace(/~~~↫?|↫?~~~/g,"");
        }else{
            //new obsidian.Notice("需要补充~~~符号");
            lines = lines.replace(/^(.*)$/m,"~~~↫$1↫~~~");
        }
        lines = lines.replace(/↫/g,"\n");
        this.替换所选文本 (this.获取编辑模式 (), lines);
        var cmEditor = this.获取编辑模式 ();
        cmEditor.exec("goRight");
    };

    MyPlugin.prototype.转换上标 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\<sup\>[^\<\>]*\<\/sup\>/g;	//是否包含<sup>下标</sup>
        var link1 = /\<sup\>[^\<\>\/]*$|^[^\<\>]*\<\/sup\>/g;	//是否只包含一侧的<sup>下标</sup>

        if (link1.test(lines)){
            //new obsidian.Notice("只有一侧出现<sup>下标</sup>符号");
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/(\<sup\>|\<\/sup\>)/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"\<sup\>$1\<\/sup\>");
            lines = lines.replace(/^\<sup\>\s*\<\/sup\>$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换下标 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\<sub\>[^\<\>]*\<\/sub\>/g;	//是否包含<sub>下标</sub>
        var link1 = /\<sub\>[^\<\>\/]*$|^[^\<\>]*\<\/sub\>/g;	//是否只包含一侧的<sub>下标</sub>

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/(\<sub\>|\<\/sub\>)/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"\<sub\>$1\<\/sub\>");
            lines = lines.replace(/^\<sub\>\s*\<\/sub\>$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换挖空 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /\{\{c\d::[^\{\}]+\}\}/g;	//是否包含{{c*::}}
        var link1 = /\{\{c[^\{\}]*$|^[^\{\}]*\}\}/g;	//是否只包含一侧的{{c*::}}

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/(\{\{c\d::|\}\})/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"\{\{c1::$1\}\}");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.选择当前整段 = function () {
        var cmEditor = this.获取编辑模式 ();
        var 全文 = cmEditor.getDoc();
        var 当前光标 = cmEditor.getCursor();  //
        var 当前行号 = 当前光标.line; //
        var 当前行文本 = cmEditor.getLine(当前行号); 
        //new obsidian.Notice("当前行：\n"+当前行文本);
        cmEditor.setSelection({line:当前行号,ch:0}, {line:当前行号,ch:当前行文本.length});
    };

    MyPlugin.prototype.选择当前整句 = function () {
        var cmEditor = this.获取编辑模式 ();
        var 全文 = cmEditor.getDoc();
        var 当前光标 = cmEditor.getCursor();  //
        var 当前行号 = 当前光标.line; //
        var 当前行文本 = cmEditor.getLine(当前行号); 
        //new obsidian.Notice("当前行：\n"+当前行文本);

        var 选至行首 = cmEditor.getRange({line:当前行号,ch:0}, 当前光标);
        var 前句 = 选至行首.match(/(?<=(^|[。？！]))[^。？！]*$/);
        if(前句.length>0){
            var 句前 = 前句[0];
        }
        var 选至行尾 = cmEditor.getRange(当前光标,{line:当前行号,ch:当前行文本.length});
        var 后句 = 选至行尾.match(/^[^。？！]*([。？！]|$)/);
        if(后句.length>0){
            var 句后 = 后句[0];
        }
        var _length1 = 选至行首.length-句前.length;
        var _length2 = 选至行首.length+句后.length;
        //new obsidian.Notice(句前+"\n光标\n"+句后);
        cmEditor.setSelection({line:当前行号,ch:_length1}, {line:当前行号,ch:_length2});
    };

    MyPlugin.prototype.重复当前行 = function () {
        var cmEditor = this.获取编辑模式 ();
        var 全文 = cmEditor.getDoc();
        var 当前光标 = cmEditor.getCursor();  //
        var 当前行号 = 当前光标.line; //
        var 当前行文本 = cmEditor.getLine(当前行号); 
        //new obsidian.Notice("当前行：\n"+当前行文本);

        var 选至行首 = cmEditor.getRange({line:当前行号,ch:0}, 当前光标);
        var 选至行尾 = cmEditor.getRange(当前光标,{line:当前行号,ch:当前行文本.length});
        //new obsidian.Notice("光标以前：\n"+选至行首+"\n\n光标以后：\n"+选至行尾);

        var 标前两字 = cmEditor.getRange({line:当前行号,ch:选至行首.length-2}, 当前光标);
        var 标后两字 = cmEditor.getRange(当前光标,{line:当前行号,ch:选至行首.length+2});
        //new obsidian.Notice("标前两字\n"+标前两字+"\n\n标后两字：\n"+标后两字);

        var 新行文本 = "\n" + 当前行文本;
        全文.replaceRange(新行文本, {line:当前行号,ch:当前行文本.length}, {line:当前行号,ch:当前行文本.length});
    };

    MyPlugin.prototype.智能括号 = function () {
        var cmEditor = this.获取编辑模式 ();
        var 全文 = cmEditor.getDoc();
        var 当前光标 = cmEditor.getCursor();  //
        var 当前行号 = 当前光标.line; //
        var 当前行文本 = cmEditor.getLine(当前行号); 
        //new obsidian.Notice("当前行：\n"+当前行文本);

        var 选至行首 = cmEditor.getRange({line:当前行号,ch:0}, 当前光标);
        var 选至行尾 = cmEditor.getRange(当前光标,{line:当前行号,ch:当前行文本.length});
        //new obsidian.Notice("光标以前：\n"+选至行首+"\n\n光标以后：\n"+选至行尾);

        var 标前两字 = cmEditor.getRange({line:当前行号,ch:选至行首.length-2}, 当前光标);
        var 标后两字 = cmEditor.getRange(当前光标,{line:当前行号,ch:选至行首.length+2});
        //new obsidian.Notice("标前两字\n"+标前两字+"\n\n标后两字：\n"+标后两字);

        if(标后两字.match(/^(\]\]|\=\=|\*\*|\~\~)/)){
            cmEditor.exec("goRight");
            cmEditor.exec("goRight");   //如果下个字符是后括号，则跃过
        }else if(标后两字.match(/^[》〉］｝】〗〕』」）}\)][^《》〈〉［］｛｝【】〖〗〔〕『』「」]/)){
            cmEditor.exec("goRight");   //如果下个字符是后括号，则跃过
        }else if(标前两字.match(/^(【（|\[\(|【\(|\[（)$/)){
            全文.replaceRange("〖", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^(（《|\(\<|\(《|（\<)$/)){
            全文.replaceRange("〈", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^(（【|\(\[|\(【|（\[)$/)){
            全文.replaceRange("〔", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^(“ 【|\"【|“\[|\"\[)$/)){
            全文.replaceRange("『", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^(‘ 【|\'【|‘\[|\'\[)$/)){
            全文.replaceRange("「", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(选至行首.match(/《[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("》", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/〈[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("〉", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/［[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("］", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/｛[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("｝", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/【[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("】", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/〖[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("〗", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/〔[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("〕", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/『[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("』", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/「[^《》〈〉［］｛｝【】〖〗〔〕『』「」]*$/)){
            全文.replaceRange("」", 当前光标, 当前光标);
            cmEditor.exec("goRight");
        }else if(选至行首.match(/\[\[[^=\[\]\*~]*$/)){
            全文.replaceRange("]]", 当前光标, 当前光标);
            cmEditor.exec("goRight");
            cmEditor.exec("goRight");
        }else if(选至行首.match(/==[^=\[\]\*~]*$/)){
            全文.replaceRange("==", 当前光标, 当前光标);
            cmEditor.exec("goRight");
            cmEditor.exec("goRight");
        }else if(选至行首.match(/\*\*[^=\[\]\*~]*$/)){
            全文.replaceRange("**", 当前光标, 当前光标);
            cmEditor.exec("goRight");
            cmEditor.exec("goRight");
        }else if(选至行首.match(/~~[^=\[\]\*~]*$/)){
            全文.replaceRange("~~", 当前光标, 当前光标);
            cmEditor.exec("goRight");
            cmEditor.exec("goRight");
        }
    };

    MyPlugin.prototype.标题语法 = function(_str) {
        var link = eval("/^"+_str+" ([^#]+)/");	//是否包含几个#符号
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var cmEditor = mdView.sourceMode.cmEditor;
        var doc = cmEditor.getDoc();
        var cursorline = cmEditor.getCursor().line;
        var line0 = cmEditor.getLine(cursorline);        

        if(_str==""){
            var line1 = line0.replace(/^\s*#+\s/,"");
        }else if (link.test(line0)){
            var line1 = line0.replace(link,"$1");
        }else{
            var line1 = line0.replace(/^#+[ ]+/,"");
            line1 = line1.replace(/^\s*/,_str+" ");
        }
        //new obsidian.Notice(line1);
        doc.replaceRange(line1, {line:cursorline,ch:0}, {line:cursorline,ch:line0.length});
        if(line0==""){  //如果当前行为空，指定标题后 光标放置末尾
            var cmEditor = this.获取编辑模式 ();
            var i=0;
             while (i<_str.length+1){
                cmEditor.exec("goRight");
                i++;
            }
        };
    };

    MyPlugin.prototype.转换文字颜色 = function(_color) {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var _html0 = /\<font color=[0-9a-zA-Z#]+[^\<\>]*\>[^\<\>]+\<\/font\>/g;
        var _html1 = /^\<font color=[0-9a-zA-Z#]+[^\<\>]*\>([^\<\>]+)\<\/font\>$/;
        var _html2 = '\<font color='+_color+'\>$1\<\/font\>';
        var _html3 = /\<font color=[^\<]*$|^[^\>]*font\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(lines);

        if (_html3.test(lines)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(lines)){
            if(_html1.test(lines)){
                //new obsidian.Notice("替换颜色！");
                lines = lines.replace(_html1,_html2);
            }else{
                lines = lines.replace(/\<font color=[0-9a-zA-Z#]+[^\<\>]*?\>|\<\/font\>/g,""); 
            }
        }else{
            lines = lines.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换背景颜色 = function(_color) {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var _html0 = /\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>[^\<\>]+\<\/span\>/g;
        var _html1 = /^\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>([^\<\>]+)\<\/span\>$/;
        var _html2 = '\<span style=\"background\-color:'+_color+'\"\>$1\<\/span\>';
        var _html3 = /\<span style=[^\<]*$|^[^\>]*span\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(lines);

        if (_html3.test(lines)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(lines)){
            if(_html1.test(lines)){
                lines = lines.replace(_html1,_html2); 
            }else{
                lines = lines.replace(/\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>|\<\/span\>/g,"");
                //new obsidian.Notice("需要去除颜色！");
            }
        }else{
            lines = lines.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };
    
    MyPlugin.prototype.转换无语法文本 = function() {
        var selection = this.获取所选文本 (this.获取编辑模式 ());
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\s*\- |^\-+$|^\*+$)/mg;
        if(selection == ""){
            new obsidian.Notice("请先划选部分文本，再执行命令！");
        }else{
            selection = selection.replace(mdText,"");
            selection = selection.replace(/^[ ]+|[ ]+$/mg,"");
            selection = selection.replace(/\!?\[\[([^\[\]\|]*\|)*([^\(\)\[\]]+)\]\]/g,"$2");
            selection = selection.replace(/\!?\[+([^\[\]\(\)]+)\]+\(([^\(\)]+)\)/g,"$1");
            selection = selection.replace(/`([^`]+)`/g,"$1");
            selection = selection.replace(/_([^_]+)_/g,"$1");
            selection = selection.replace(/==([^=]+)==/g,"$1");
            selection = selection.replace(/\*\*([^\*]+)\*\*/g,"$1");
            selection = selection.replace(/~~([^~]+)~~/g,"$1");
            selection = selection.replace(/(\r*\n)+/mg,"\r\n");
            this.替换所选文本 (this.获取编辑模式 (), selection);
        }
    };

    MyPlugin.prototype.括选文本1 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*【[^【】]+】.*/g;	//是否包含【】
        var link1 = /【[^【】]*$|^[^【】]*】/g;	//是否只包含一侧的【】

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[【】]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"【$1】");
            lines = lines.replace(/^【\s*】$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.括选文本2 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*（[^（）]*）.*/g;	//是否包含【】
        var link1 = /（[^（）]*$|^[^（）]*）/g;	//是否只包含一侧的【】

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[（）]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"($1)");
            lines = lines.replace(/^(\s*)$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.括选文本3 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*「[^「」]*」.*/g;	//是否包含「」
        var link1 = /「[^「」]*$|^[^「」]*」/g;	//是否只包含一侧的「

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[「」]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"「$1」");
            lines = lines.replace(/^「\s*」$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.括选文本4 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        var link = /.*《[^《》]*》.*/;	//是否包含《》
        var link1 = /《[^《》]*$|^[^《》]*》/;	//是否只包含一侧的《

        if (link1.test(lines)){
            return;
        }else if (link.test(lines)){
            lines = lines.replace(/[《》]/g,"");
        }else{
            lines = lines.replace(/^(.+)$/mg,"《$1》");
            lines = lines.replace(/^《\s*》$/mg,"");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };


    MyPlugin.prototype.转换有序列表 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());

        var link = /^[0-9]\.\s.*/;	//是否包含有序符号
        var link1 = /(^[0-9]\.\s)(?=[^\s])/mg;	//选中n. 前缀
        var link2 = /(^[\-\+]\s)(?=[^\s])/mg;	//选中-. 前缀

        if (link.test(lines)){
            //new obsidian.Notice("包含有序符号");
            lines = lines.replace(link1,"");
        }else{
            //new obsidian.Notice("需要补充有序符号");
            lines = lines.replace(link2,"");
            lines = lines.replace(/^(?=[^\n\r])/mg,"1. ");
        }
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换待办列表 = function() {
        var lines = this.获取所选文本 (this.获取编辑模式 ());
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[) (?=\]\s[^\s])/mg,"x☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)x(?=\]\s[^\s])/mg,"-☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\-(?=\]\s[^\s])/mg,"!☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\!(?=\]\s[^\s])/mg,"?☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\?(?=\]\s[^\s])/mg,">☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\>(?=\]\s[^\s])/mg,"<☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\<(?=\]\s[^\s])/mg,"+☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\+(?=\]\s[^\s])/mg," ☀");
        lines = lines.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[[\sx\-\+\?\!\<\>])☀(?=\]\s[^\s])/mg,"");
        this.替换所选文本 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.自动设置标题 = function() {
		var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/\r?\n/g,"↫");
        lines = lines.replace(/↫\s*↫/g,"↫↫");
        lines = lines.replace(/\s*(?=↫)/g,"");
        lines = lines.replace(/(?<=^|↫)([^#`\[\]\(\)↫]{3,}[^\.\?\!:,0-9，：。？！）↫])(?=↫|$)/g,"↫### $1↫");
        lines = lines.replace(/#+([^#↫]+)↫*$/mg,"$1");    //取消末行标题
        lines = lines.replace(/↫{3,}/g,"\r\n\r\n");
        lines = lines.replace(/↫/g,"\r\n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.指定当前文件名 = function () {
        var cmEditor = this.获取编辑模式 ();
        var selection = this.获取所选文本 (cmEditor);
        if (selection == undefined)
            return false;
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.path;
        //this.app.workspace.activeLeaf.setEphemeralState({ rename: "all"});
        navigator.clipboard.writeText(selection);
        //this.app.workspace.activeLeaf.replaceSelection(selection);
        this.app.vault.adapter.rename(noteFilePath, selection+".md"); //强行重命名，不能全局更新
        //new obsidian.Notice(noteFilePath+"\n"+selection);
    };

    MyPlugin.prototype.获取相对路径 = function () {
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.path;
        navigator.clipboard.writeText(noteFilePath)
        
        var 相对目录 = noteFilePath.replace(/(?<=\/)[^\/]+$/m,"");
        new obsidian.Notice("当前笔记位于："+相对目录);
    };

    MyPlugin.prototype.粘贴表格 = function() {
    	let leaf = this.app.workspace.activeLeaf;
    	var xlsText = ""
    	var 分隔行 = ""
        const mdView = leaf.view;
        //获取 当前窗口  //其中const是【常数】
        if (mdView.sourceMode == undefined)
            return false;
        const doc = mdView.sourceMode.cmEditor;
        //获取 编辑模式
        let cmEditor = doc;
        var selection = cmEditor.getSelection();
        navigator.clipboard.readText()
		.then(xlsText => {
			xlsText = xlsText.replace(/\n/g,"■");
			xlsText = xlsText.replace(/\"([^■\|\"]+)■([^\|\n\"]+)\"/g,"$1<br>$2");
			分隔行 = xlsText.replace(/■.*/g,"");
			//new obsidian.Notice("分隔行　"+ 分隔行);
			分隔行 = 分隔行.replace(/\t/g,"|");
			分隔行 = 分隔行.replace(/([^\|]*)/g,"--");
			xlsText = xlsText.replace(/\t/g,"\|");
			xlsText = xlsText.replace(/^([^■]+)/,"$1■"+分隔行);
			xlsText = xlsText.replace(/■/g,"\n");
            xlsText = xlsText.replace(/^\|/mg,"　\|");
            xlsText = xlsText.replace(/\|$/mg,"\|　");
            xlsText = xlsText.replace(/^(?=[^\r\n])|(?<=[^\r\n])$/mg,"\|");
            xlsText = xlsText.replace(/(?<=\|)(?=\|)/g,"　");
			//navigator.clipboard.writeText(xlsText)
			cmEditor.replaceSelection(xlsText);
			//将当前光标位置替换为处理后的md语法表格数据
			//mdView.setMode(mdView.previewMode)
		})
		.catch(err => {
			console.error('Failed to read clipboard contents: ', err);
		});
    }
    
    MyPlugin.prototype.获取标注文本 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        //new obsidian.Notice(lines);
        var tmp = lines.replace(/^(?!#+ |#注释|#标注|#批注|#反思|#备注|.*==|.*%%).*$|^[^#\n%=]*(==|%%)|(==|%%)[^\n%=]*$|(==|%%)[^\n%=]*(==|%%)/mg,"\n");
        tmp = tmp.replace(/[\r\n|\n]+/g,"\n")
        
        new obsidian.Notice("已成功获取，请粘贴！");
        navigator.clipboard.writeText(tmp);
    };

    MyPlugin.prototype.获取无语法文本 = function() {
        var selection = this.获取所选文本 (this.获取编辑模式 ());
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\-+$|^\*+$|==|\*+|~~|```|!*\[\[|\]\])/mg;
        if(selection == ""){
            new obsidian.Notice("请先划选部分文本，再执行命令！");
        }else{
            selection = selection.replace(/\[([^\[\]]*)\]\([^\(\)]+\)/img,"$1");
            selection = selection.replace(mdText,"");
            selection = selection.replace(/^[ ]+|[ ]+$/mg,"");
            selection = selection.replace(/(\r\n|\n)+/mg,"\n");
            new obsidian.Notice("无语法文本 已成功获取，请粘贴！");
            navigator.clipboard.writeText(selection);
        }
    };

    MyPlugin.prototype.嵌入当前网址页面 = function () {
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var cmEditor = mdView.sourceMode.cmEditor;  //编辑模式
        var selection = this.获取所选文本 (cmEditor);   //所选文本
        var doc = cmEditor.getDoc();    //整个文档
        var cursorline = cmEditor.getCursor().line; //行号
        var line0 = cmEditor.getLine(cursorline);   //当前行文本
        var vid,web;
        var line1 = '\n<iframe src="■" width=100% height="500px" frameborder="0" scrolling="auto"></iframe>';
        if(selection.match(/^https?:\/\/[^:]+/)){
            if(selection.match(/^https?:\/\/v\.qq\.com/)){
                vid = selection.replace(/^http.*\/([^\/=\?\.]+)(\.html.*)?$/,"$1");
                web = "https://v.qq.com/txp/iframe/player.html?vid="+vid;
            }else if(selection.match(/^https?:\/\/www\.bilibili\.com/)){
                vid = selection.replace(/^http.*\/([^\/=\?\.]+)(\?spm.*)?$/,"$1");
                web = "https://player.bilibili.com/player.html?bvid="+vid;
            }else if(selection.match(/^https?:\/\/www\.youtube\.com/)){
                vid = selection.replace(/^http.*?v=([^\/=\?\.]+)(\/.*)?$/,"$1");
                web = "https://www.youtube.com/embed/"+vid;
            }else{
                web = selection;
            }
            line1 = line1.replace(/■/,web);
            doc.replaceRange(line1, {line:cursorline,ch:line0.length},{line:cursorline,ch:line0.length});
            cmEditor.exec("goRight");
        }else{
            new obsidian.Notice("所选文本不符合网址格式，无法嵌入！");
        }
    };

    MyPlugin.prototype.批量插入空行 = function() {
		var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/([^\n])\n(?!(\s*\- |\s*[0-9]\.|\s*\>|\n))/g,"$1\n\n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };
    
    MyPlugin.prototype.批量去除空行 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/(\r\n|\n)[\t\s]*(\r\n|\n)/g,"\n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.末尾追加空格 = function() {
		var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/(?<!(\-\-\-|\*\*\*|\s\s))\n/g,"  \n");
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };
        
    MyPlugin.prototype.去除末尾空格 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/\s\s\n/g,"\n")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.上方插入空行 = function(_str) {
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var cmEditor = mdView.sourceMode.cmEditor;
        var doc = cmEditor.getDoc();
        var cursorline = cmEditor.getCursor().line;
        var line0 = cmEditor.getLine(cursorline);
        var line1 = line0.replace(/^([^\r\n]*)$/,"\r\n$1");
        doc.replaceRange(line1, {line:cursorline,ch:0},{line:cursorline,ch:line0.length});
    };

    MyPlugin.prototype.下方插入空行 = function(_str) {
        var mdView = this.app.workspace.activeLeaf.view;
        if (mdView.sourceMode == undefined)
            return false;
        var cmEditor = mdView.sourceMode.cmEditor;
        var doc = cmEditor.getDoc();
        var cursorline = cmEditor.getCursor().line;
        var line0 = cmEditor.getLine(cursorline);
        var line1 = line0.replace(/^([^\r\n]*)$/,"$1\r\n");
        doc.replaceRange(line1, {line:cursorline,ch:0},{line:cursorline,ch:line0.length});
    };
   
    MyPlugin.prototype.添加中英间隔 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/([a-zA-Z]+)([一-鿆]+)/g,"$1 $2")
        lines = lines.replace(/([一-鿆]+)([a-zA-Z]+)/g,"$1 $2")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.去除所有空格 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/[ 　]+/g,"")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.同目录下一笔记 = function() {
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.path;
        //noteFilePath = noteFilePath.replace(/\.md/,"")
        //new obsidian.Notice(noteFilePath);

        var fileList = this.app.vault.getMarkdownFiles().map((file) => {
            return file.path;
        });

        var _string = fileList.toString();
        _string = _string.replace(/(^|,)([^\/,]+)(?=\/)/img,"$1■$2");
        new obsidian.Notice(_string);
        var newList = _string.split(",");
        newList.sort();

        navigator.clipboard.writeText(newList.toString().replace(/,/g,"\n"));
        new obsidian.Notice("文件列表已写入剪贴板！");
        
        var _mdID = fileList.findIndex(checkAdult);
        new obsidian.Notice(_mdID + " " + noteFilePath + "\n" + Number(_mdID-1) + " " + fileList[_mdID-1]);

        function checkAdult(age) {
            return age.includes(noteFilePath)
        }
    }

    MyPlugin.prototype.搜索当前文本 = function() {
        var activeFile = this.app.workspace.getActiveFile();
        var noteFilePath = activeFile.name;
        new obsidian.Notice(noteFilePath);
        noteFilePath = noteFilePath.replace(/\.md$/,"")
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        var _txt = view.getSelection();
        _txt = _txt.replace(/^/,"path:"+noteFilePath+" /")
        this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch(_txt)
    };

    MyPlugin.prototype.修复意外断行 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/([^。？！\.\?\!])[\r\n]*\n([^\.\?\!。？！])/g,"$1$2")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.修复错误语法 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/[\[【]([^\[\]【】]*)[】\]][（|\(]([^\(\)（）]*)[）|\)]/g,"\[$1\]\($2\)");
        //将 【】（）或【】() 转换为[]()
        lines = lines.replace(/\[+([^\[\]]*)\]+\(/g,"\[$1\](");
        //处理 bookXnote 回链语法，将 [[链接]]() 转换为 []()
        lines = lines.replace(/(?<=^|\s)    /mg,"\t");
        //把 四个空格转换为 制表符
        lines = lines.replace(/\*\s+\>\s+/g,"- ");
        //处理 bookXnote 回链语法中的列表
        lines = lines.replace(/(?<=\s)[0-9]+。 /g,"1. ");
        //把 1。 转换为 有序列表样式
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.英转中文标点 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/,/g,"，")
        lines = lines.replace(/(?<=[^0-9])\./g,"。")
        lines = lines.replace(/\?/g,"？")
        lines = lines.replace(/!/g,"！")
        lines = lines.replace(/;/g,"；")
        lines = lines.replace(/:/g,"：")
        lines = lines.replace(/\(/g,"（")
        lines = lines.replace(/\)/g,"）")
        lines = lines.replace(/\{([^{}]*)\}/g,"｛$1｝")
        lines = lines.replace(/\"([^\"]*?)\"/g,"“$1”")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.中转英文标点 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        lines = lines.replace(/，/g,",")
        lines = lines.replace(/。/g,"\.")
        lines = lines.replace(/？/g,"\?")
        lines = lines.replace(/！/g,"!")
        lines = lines.replace(/；/g,";")
        lines = lines.replace(/：/g,":")
        lines = lines.replace(/（/g,"\(")
        lines = lines.replace(/）/g,"\)")
        lines = lines.replace(/｛([^｛｝]*)｝/g,"{$1}")
        lines = lines.replace(/“([^“”]*)”/g,"\"$1\"")
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    };

    MyPlugin.prototype.转换路径 = function() {
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        var link1 = /^[a-zA-Z]:\\/;	//符合普通路径格式
        var link2 = /^(\[[^\[\]]*\]\()*file:\/\/\/[^\(\)]*\)*/;	//符合[](file路径)格式
        var link3 = /^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/;	//意外路径格式
        if (link1.test(lines)){
            lines = lines.replace(/\s/mg,"%20");
            lines = lines.replace(/^(.*)$/m,"\[file\]\(file:///$1\)");
            lines = lines.replace(/\\/img,"\/");
            this.替换笔记全文 (this.获取编辑模式 (), lines);
        }else if(link2.test(lines)){
            lines = lines.replace(/%20/mg," ");
            lines = lines.replace(/^(\[[^\[\]]*\]\()*file:\/\/\/([^\(\)]*)\)*/m,"$2");
            lines = lines.replace(/\//mg,"\\");
            this.替换笔记全文 (this.获取编辑模式 (), lines);
        }else if(link3.test(lines)){
            lines = lines.replace(/^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/m,"$1");
            this.替换笔记全文 (this.获取编辑模式 (), lines);
        }else{
            new obsidian.Notice("您划选的路径格式不正确！");
            return
        }
    };

    MyPlugin.prototype.简体转繁 = function(){
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        var _list1 = this.settings.jtList;
        var _list2 = this.settings.ftList;
        
        for (var i=0;i<_list1.length;i++)
        { 
            lines = lines.replace(eval("/"+_list1[i]+"/g"),_list2[i]);
        }
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    }

    MyPlugin.prototype.繁体转简 = function(){
        var lines = this.获取笔记全文 (this.获取编辑模式 ());
        if (!lines) return;
        var _list1 = this.settings.jtList;
        var _list2 = this.settings.ftList;
        
        for (var i=0;i<_list1.length;i++)
        { 
            lines = lines.replace(eval("/"+_list2[i]+"/g"),_list1[i]);
        }
        this.替换笔记全文 (this.获取编辑模式 (), lines);
    }

    MyPlugin.prototype.获取所选文本 = function(cmEditor) {
        if (!cmEditor) return;
        var cmEditor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
        var selection = cmEditor.getSelection();
       	return selection;
    };

    MyPlugin.prototype.获取笔记全文 = function(cmEditor) {
    	if (!cmEditor) return;
        var selection = cmEditor.getSelection();
        if (selection != "") {
       		return selection;
        } else {
            return cmEditor.getValue();         
        }
    };

    MyPlugin.prototype.替换所选文本 = function(cmEditor, lines) {
        var selection = cmEditor.getSelection();
        cmEditor.replaceSelection(lines);
    };

    MyPlugin.prototype.替换笔记全文 = function(cmEditor, lines) {
	    var selection = cmEditor.getSelection();
        if (selection != "") {
            cmEditor.replaceSelection(lines);
        } else {
            cmEditor.setValue(lines);
        }
    };

    MyPlugin.prototype.获取编辑模式 = function () {
        var view = this.app.workspace.activeLeaf.view;
        if (view.getViewType() == 'markdown') {
            var cmEditor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
            return cmEditor;
        }
        return null;
    };

    return MyPlugin;
}(obsidian.Plugin));

var SettingsTab = /** @class */ (function (_super) {
    __extends(SettingsTab, _super);
    function SettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        _this.settings = plugin.settings;
        return _this;
    }
    SettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: '增强编辑 0.3.7' });
        new obsidian.Setting(containerEl)
            .setName('转换内部链接「Alt+Z」 在选文两端添加或去除 [[ ]] 符号')
            .setDesc('支持批量转换用换行符分隔的多行文本或顿号分隔的多句文本。')
             
            .addText(function (text) {
            return text
                .setPlaceholder('禁用 "|[]?\*<>/: 等符号')
                .setValue(_this.settings.defaultChar)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _this.settings.defaultChar = value;
                            return [4 , _this.plugin.saveSettings()];   //保存缓存数据，取消
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        }); 
        new obsidian.Setting(containerEl)
            .setName('智能括号「Alt+;」 自动转换、匹配或跳过各种类型的括号符号')
            .setDesc('将[( (< ([ "[ \'[等组合转为〖〈〔『「，并可自动匹配或跳过后部分括号。')
        new obsidian.Setting(containerEl)
            .setName('增强功能「快捷键」：功能说明......')
        var div = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var donateText = document.createDocumentFragment();
        donateText.appendText('转换同义链接「Alt+Q」：将选文转换为 [[|选文]] 样式后再选择文档')
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换粗体语法「Alt+C」∶将选文转为或去除 **粗体** 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换斜体语法「Alt+X」∶将选文转为或去除 _斜体_ 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换行内代码「Alt+D」∶将选文转为或去除 `行内代码` 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换删除线「Alt+S」∶将选文转为或去除 ~~删除线~~ 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换下划线「Alt+H」∶将选文转为或去除 <u>下划线</u> 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换代码块「未设置」∶将选文转为或去除 ```代码块``` 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换上标语法「Alt+U」∶将选文转为或去除 <sup>上标</sup> 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换下标语法「Alt+N」∶将选文转为或去除 <sub>下标</sub> 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换待办状态「未设置」：转换选文行首的待办状态，顺序为 -[ x-!?><+] 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换挖空「未设置」：将选文转为或去除 {{c1::选文}} 效果');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换标题语法「Ctrl+1-6」∶指定或取消当前行文本为N级标题');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换文字颜色「Ctrl+Shift+1-7」∶将选文转为或去除 赤橙黄绿青蓝紫 颜色');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换背景颜色「Ctrl+Alt+1-7」∶将选文背景转为或去除 赤橙黄绿青蓝紫 颜色');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换无语法文本「Ctrl+Alt+Z」∶去除选文中所有markdown语法字符');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('获取无语法文本「Ctrl+Alt+C」∶去除选文中的所有markdown语法字符，并写入剪贴板');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('【选文】「未设置」：在选文两端添加或去除 【】符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('（选文）「未设置」：在选文两端添加或去除 （）符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('「选文」「未设置」：在选文两端添加或去除 「」符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('《选文》「未设置」：在选文两端添加或去除 《》符号');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('英转中文标点「未设置」∶将笔记中的英文标点转换为中文标点，如,.?!"等');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('中转英文标点「未设置」∶将笔记中的中文标点转换为英文标点，如，。？！“等');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('转换路径语法「未设置」∶将 c:\\windows 与 [](file:///c:\/windows) 路径语法相互转换');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('简体转为繁体「未设置」：将笔记中的简体汉字转换为繁体汉字');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('繁体转为简体「未设置」：将笔记中的繁体汉字转换为简体汉字');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('粘贴MD表格「Ctrl+Alt+V」∶将复制的Office表格直接粘贴为MarkDown语法表格');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('修复错误语法「未设置」∶修复错误的MD语法，如1。列表、【】（）链接、[[]]()回链等');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('修复意外断行「未设置」∶修复笔记中的意外断行（删除结尾不是句式标点的换行符）');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('搜索当前文本「未设置」：通过搜索面板在当前文档中搜索划选内容。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('选择当前整段「未设置」：选择光标所在的当前整段文本。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('选择当前整句「未设置」：选择光标所在的当前整句（中文）文本。');
        donateText.appendChild(document.createElement('br'));
        //donateText.appendChild(document.createElement('br'));
        //donateText.appendText('获取时间信息「未设置」∶获取当前行中的时间信息，并控制链接笔记中的视频进行跳转播放');        
        donateText.appendText('获取标注文本「未设置」∶获取标题、高亮、注释及前缀(#标注\批注\反思)等文本内容');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('自动设置标题「未设置」∶将选文中的单行文本（末尾非标点或数字）转为标题');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('指定当前文件名「未设置」：划选文字后指定为当前笔记的文件名。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('嵌入当前网址页面「未设置」∶在行末插入iframe代码来嵌入所选网址页面');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('获取相对路径「未设置」：获取当前笔记在库目录内的相对路径。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));        
        donateText.appendText('批量插入空行「Ctrl+Shift+L」∶在划选的文本行或全文中间批量插入空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('批量去除空行「Ctrl+Alt+L」∶批量去除划选文本或全文中的空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('上方插入空行「未设置」∶在当前文本行的上行插入空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('下方插入空行「未设置」∶在当前文本行的下行插入空白行');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('末尾追加空格「未设置」∶在每行文本的末尾追加两个空格');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('去除末尾空格「未设置」∶批量去除每个文本行末尾的空格字符');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('添加中英间隔「未设置」：在正文的汉字与字母之间批量添加空格，如 china 中国。');
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('去除所有空格「未设置」：去除正文中所有的全、半角空格');
        donateText.appendChild(document.createElement('br'));
        donateText.appendChild(document.createElement('br'));
        donateText.appendText('欢迎向蚕子(QQ:312815311) 提出操作需求和建议，我们为增强编辑功能来共同努力！');
        div.appendChild(donateText);
    };
    return SettingsTab;
}(obsidian.PluginSettingTab));

module.exports = MyPlugin;