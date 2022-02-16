'use strict';
var obsidian = require('obsidian');

/*
*****************************************************************************
使用声明
本插件基于多款社区插件改编而成，蚕子水平有限，代码或许存在缺陷，不能保证任何用户或任何操作均为正常，
请您在使用本插件之前，先备份好Obsidian笔记库再进行操作测试，谢谢配合。
开发：蚕子 QQ：312815311 更新时间：2022-2-13
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
        this.twoEnter = true;
        this.toggleMD = true;
        this.toggleHtml = true;
        this.toggleZH = true;
        this.toggleTS = true;
        this.toggleLS = true;
    }
    Settings.prototype.toJson = function () {
        return JSON.stringify(this);
    };
    Settings.prototype.fromJson = function (content) {
        var obj = JSON.parse(content);
        this.defaultChar = obj['defaultChar'];
        this.twoEnter = obj['twoEnter'];
        this.toggleMD = obj['toggleMD'];
        this.toggleHtml = obj['toggleHtml'];
        this.toggleZH = obj['toggleZH'];
        this.toggleTS = obj['toggleTS'];
        this.toggleLS = obj['toggleLS'];
    };
    return Settings;
}());

var MyPlugin = /** @class */ (function (_super) {
    __extends(MyPlugin, _super);
    var 当前文件;
    var 当前文件路径;
    var 编辑模式;
    var 所选文本 = "";
    var 笔记全文;
    var 笔记正文;
    var 当前行文本 = "";
    var 当前光标;
    var 当前行号 = 0;
    var 选至行首 = "";
    var 选至行尾 = "";
    var isIndent = true;
    var isGLS = false;
    var isCTS = false;
    var isXTS = false;
    var isSCS = false;
    var isXHS = false;
    var isSB = false;
    var isXB = false;

    function MyPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.settings = new Settings();
        _this.SETTINGS_PATH = '.obsidian/plugins/ZH增强编辑/data.json';        
        return _this;
    }    

    MyPlugin.prototype.onload = function () {
        var _this = this;
        var editorChanged = false;
        var oldIndent="";
        var 次数 = 0;

        this.registerEvent(this.app.workspace.on('editor-change', function (file) {
            if (file) {
                editorChanged = true;
                _this.获取编辑器信息();
            };
        }));

        document.addEventListener('mouseup', (e) => {
            所选文本 = _this.获取所选文本 ();
            if(所选文本==""){
                return
            }else if(isGLS){
                _this.转换高亮();
            }else if(isCTS){
                _this.转换粗体();
            }else if(isXTS){
                _this.转换斜体();
            }else if(isSCS){
                _this.转换删除线();
            }else if(isXHS){
                _this.转换下划线();
            }else if(isSB){
                _this.转换上标();
            }else if(isXB){
                _this.转换下标();
            };               
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === "Enter"){
                //new obsidian.Notice("按下了回车键");
                var 上行文本 = 编辑模式.getLine(当前行号-1);
                //new obsidian.Notice("上行文本\n"+上行文本);
                var 末行行号 = 编辑模式.lastLine();
                var 末行文本 = 编辑模式.getLine(末行行号);
                var 选至文首 = 编辑模式.getRange({line:0,ch:0},{line:当前行号,ch:0});
                var 选至文末 = 编辑模式.getRange({line:当前行号,ch:0},{line:末行行号,ch:末行文本.length});
                var 缩进字符 = 上行文本.match(/^[\t\s]*/m)[0];
                var 代码块次数1 = 选至文首.match(/^```/mg).length;
                var 代码块次数2 = 选至文末.match(/^```/mg).length;
                if(editorChanged){
                    var reg = /^[\t\s]*(\-|\d+\.)\s/im
                    var reg1 = /^[\t\s]+$/m
                    var reg2 = /^[\t\s]*\/\//m
                    if(代码块次数1%2==1 && 代码块次数2%2==1){
                        //在代码块中换行，视上行代码末尾符号的特点进行恰当缩进。
                        var 缩进文本 = "";
                        var 缩进次数,i=0;
                        //new obsidian.Notice("|"+缩进字符+"|");
                        if(上行文本.match(reg1)!=null){
                            缩进文本=oldIndent;
                        }else if(上行文本.match(/[;\}]$/m)!=null || 上行文本.match(reg2)!=null){
                            缩进文本 = 缩进字符+"";
                        }else if(上行文本.match(/[\{\)]$/m)!=null){
                            //new obsidian.Notice("|"+缩进字符+"||||");
                            缩进文本 = 缩进字符+"	";
                        }else if(上行文本==""){
                            缩进文本="";
                        }
                        缩进次数=缩进文本.replace(/[\t\s]/g,"|").length;
                        笔记全文.replaceRange(缩进文本, 当前光标, 当前光标);
                        while (i<缩进次数){
                            编辑模式.exec("goRight");
                            i++;
                        }
                        oldIndent = 缩进文本;
                    }else if(this.settings.twoEnter && 当前行文本.match(reg)==null){
                        //启用补行功能，且没在列表中，每按下回车即补一次换行
                        笔记全文.replaceRange("\n", 当前光标, 当前光标);
                        编辑模式.exec("goRight");
                    };
                    //new obsidian.Notice("编辑区内回车测试");
                    editorChanged = false;
                };
                //new obsidian.Notice("其它位置回车测试");
            };
        });

    	return __awaiter(this, void 0, void 0,function() {
            var _this = this;
            return __generator(this,function(_a) {
		        console.log('加载插件');
                _this.loadSettings();
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
		            id: 'auto-text',
		            name: '智能符号',
		            callback: function () {	_this.智能符号();},
		            hotkeys: [{ modifiers: ["Alt"], key: ";"}]
		        });
                /* _this.addCommand({
		            id: 'md-list',
		            name: '获取笔记标题列表',
		            callback: function () {	_this.获取笔记标题列表();}
		        }); */

                _this.addCommand({
                        id: 'mouse-up',
                        name: '游标上移',
                        callback: function () {	_this.游标上移("");},
                        hotkeys: [{ modifiers: ["Alt"], key: "I" } ]
                });
                _this.addCommand({
                        id: 'mouse-down',
                        name: '游标下移',
                        callback: function () {	_this.游标下移("");},
                        hotkeys: [{ modifiers: ["Alt"], key: "K" } ]
                });
                _this.addCommand({
                    id: 'mouse-left',
                    name: '游标左移',
                    callback: function () {	_this.游标左移("");},
                    hotkeys: [{ modifiers: ["Alt"], key: "J" } ]
                });
                _this.addCommand({
                    id: 'mouse-right',
                    name: '游标右移',
                    callback: function () {	_this.游标右移("");},
                    hotkeys: [{ modifiers: ["Alt"], key: "L" } ]
                });
                _this.addCommand({
                    id: 'mouse-start',
                    name: '游标置首',
                    callback: function () {	_this.游标置首("");},
                    hotkeys: [{ modifiers: ["Alt"], key: "U" } ]
                });
                _this.addCommand({
                    id: 'mouse-end',
                    name: '游标置尾',
                    callback: function () {	_this.游标置尾("");},
                    hotkeys: [{ modifiers: ["Alt"], key: "O" } ]
                });
                
                if(_this.settings.toggleMD){}
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
                        id: 'auto-texts',
                        name: '自动设置标题',
                        callback: function() { _this.自动设置标题(); }
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
                        name: '*斜体*',
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
                //};

                if(this.settings.toggleHtml){}
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
                //};
                

                if(this.settings.toggleZH){}
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
                    /* _this.addCommand({
                        id: 'jian-fan',
                        name: '简体转繁',
                        callback: function() { _this.简体转繁(); }
                    });
                    _this.addCommand({
                        id: 'fan-jian',
                        name: '繁体转简',
                        callback: function() { _this.繁体转简(); }
                    }); */
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
                //}
                
                if(this.settings.toggleTS){}
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
                        id: 'delete-list',
                        name: '删除当前段落',
                        callback: function() { _this.删除当前段落(); }
                    });
                    _this.addCommand({
                        id: 'Selection-text',
                        name: '选择当前整段',
                        callback: function() { _this.选择当前整段(); }
                    });
                    _this.addCommand({
                        id: 'Selection-juzi',
                        name: '选择当前整句',
                        callback: function() { _this.选择当前整句(); }
                    });
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
                //}
                
                if(this.settings.toggleLS){}
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
                        id: 'add-twoSpace',
                        name: '首行缩进两字符',
                        callback: function() { _this.首行缩进两字符(); }
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
                //};

                _this.addSettingTab(new SettingsTab(_this.app, _this));
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
    /*


    */
    MyPlugin.prototype.获取编辑器信息 = function() {
        //初始信息获取，最基本函数
        编辑模式 = this.获取编辑模式 ();
        笔记全文 = 编辑模式.getDoc();
        笔记正文 = this.获取笔记正文 ();
        所选文本 = this.获取所选文本 ();
        当前光标 = 编辑模式.getCursor();
        当前行号 = 当前光标.line;
        当前行文本 = 编辑模式.getLine(当前行号);
        选至行首 = 编辑模式.getRange({line:当前行号,ch:0}, 当前光标);
        选至行尾 = 编辑模式.getRange(当前光标,{line:当前行号,ch:当前行文本.length});
    };

    MyPlugin.prototype.关闭格式刷 = function() {
        //关闭所有格式刷
        isGLS =false;
        isCTS =false;
        isXTS = false;
        isSCS = false;
        isXHS = false;
        isSB = false;
        isXB = false;
    };
    MyPlugin.prototype.游标上移 = function() {
        this.获取编辑器信息 ();
        编辑模式.exec("goUp");
    };
    MyPlugin.prototype.游标下移 = function() {
        this.获取编辑器信息 ();
        编辑模式.exec("goDown");
    };
    MyPlugin.prototype.游标左移 = function() {
        this.获取编辑器信息 ();
        编辑模式.exec("goLeft");
    };
    MyPlugin.prototype.游标右移 = function() {
        this.获取编辑器信息 ();
        编辑模式.exec("goRight");
    };
    MyPlugin.prototype.游标置首 = function() {
        this.获取编辑器信息 ();
        编辑模式.exec("goStart");
    };
    MyPlugin.prototype.游标置尾 = function() {
        this.获取编辑器信息 ();
        编辑模式.exec("goEnd");
    };

    MyPlugin.prototype.转换内部链接 = function() {
    	var _defaultChar = this.settings.defaultChar;        
        this.获取编辑器信息 ();
        if(所选文本==""){
        	this.替换所选文本 ("[[");
        	return;
        }
        //new obsidian.Notice("划选内容："+所选文本);
        var link = /[\"\|\[\]\?\\\*\<\>\/:]/g;	//是否包含[]()及标点符号
        var link1 = /^([^\[\]]*)!\[+([^\[\]]*)$|^([^\[\]]*)\[+([^\[\]]*)$|^([^\[\]]*)\]+([^\[\]]*)$|^([^\[\]]*)\[([^\[\]]*)\]([^\[\]]*)$/g;	//是否只包含一侧的[[或]]
  		var link2 = /^[^\[\]]*(\[\[[^\[\]]*\]\][^\[\]]*)+$/g;	//是否包含N组成对的内链语法
  		var link4 = /([^\[\]\(\)\r\n]*)(\n*)(http.*)/mg;	//是否包含 说明文本&网址
	  	var link5 = /!?\[([^\[\]\r\n]*)(\n*)\]\((http[^\(\)]*)\)/mg;	//是否包含 [说明文本](网址)
  		var link8 = eval("/(["+_defaultChar+"])/g");
	  	if (link.test(所选文本)) {
	  		if (link1.test(所选文本)){
                new obsidian.Notice("划选内容不符合内链语法格式！");
	  			return;
	  		}else if (link2.test(所选文本)){
                //new obsidian.Notice("划选内容包含内链语法格式！");
	  			所选文本 = 所选文本.replace(/(\[\[(.*\|)*)/g,"");
                所选文本 = 所选文本.replace(/\]\]/g,"");
	  		}else if(link5.test(所选文本)){
	  			所选文本 = 所选文本.replace(link5,"$1$3");
                //new obsidian.Notice("划选内容包含有[]()链接语法！");
	  		}else if(link4.test(所选文本)){
	  			所选文本 = 所选文本.replace(link4,"[$1]($3)");
	  			所选文本 = 所选文本.replace("[\r\n]","");
                //new obsidian.Notice("划选内容包含有说明文本和网址！");
	  		}else{
                new obsidian.Notice("文件名不能包含下列字符:\*\"\\\/\<\>\:\|\?");
                return;
            }
		}else{
            //new obsidian.Notice("划选内容未包含内链语法格式！需要转换");
			if (link8.test(所选文本)){
				所选文本 = 所选文本.replace(link8, "]]$1[[");
			}
			所选文本 = "[[" + 所选文本 + "]]";
		}
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.转换同义链接 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){return}
        var lNum = 所选文本.length +3
        if (!所选文本) {
        	this.替换所选文本 ("[[");
        	return;
        }
        var link = /[\"\|\[\]\?\\\*\<\>\/:\n]/g;	//是否包含[]()及标点符号
  	  	if (link.test(所选文本)) {
            return;
		}else{
			所选文本 = "[[|" + 所选文本 + "]]";
		}
        this.替换所选文本 (所选文本);
        
        var i=0;
        while (i<lNum){
            编辑模式.exec("goLeft");
            i++;
        }
    };

    MyPlugin.prototype.转换粗体 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isCTS){
                isCTS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isCTS = true;
                new obsidian.Notice("「粗体」刷已打开！\n提醒：首尾不要选中标点。");
            }
        }else{
            var link = /\*\*([^\*]*)\*\*/g;	//是否包含加粗符号
            var link1 = /^[^\*]*\*\*[^\*]*$/;	//是否只包含一侧的**
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现==符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/\*\*/g,"");    //new obsidian.Notice("成对出现**符号");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"**$1**");
                所选文本 = 所选文本.replace(/^\*\*\*\*$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    MyPlugin.prototype.转换高亮 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isGLS){
                isGLS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isGLS = true;
                new obsidian.Notice("「高亮」刷已打开！");
            }
        }else{
            var link = /==[^=]*==/;	//是否包含高亮符号
            var link1 = /^[^=]*==[^=]*$/;	//是否只包含一侧的==
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现==符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/==/g,"");    //new obsidian.Notice("成对出现==符号");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"==$1==");
                所选文本 = 所选文本.replace(/^====$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    MyPlugin.prototype.转换斜体 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isXTS){
                isXTS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isXTS = true;
                new obsidian.Notice("「斜体」刷已打开！\n提醒：首尾不要选中标点。");
            }
        }else{
            var link = /\*[^\*]*\*/;	//是否包含高亮符号
            var link1 = /^[^\*]*\*[^\*]*$/;	//是否只包含一侧的\*
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现\*符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/\*/g,"");    //new obsidian.Notice("成对出现\*符号");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"\*$1\*");
                所选文本 = 所选文本.replace(/^\*\*$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
    };
    MyPlugin.prototype.转换删除线 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isSCS){
                isSCS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isSCS = true;
                new obsidian.Notice("「删除线」刷已打开！");
            }
        }else{
            var link = /~~[^~]*~~/;	//是否包含删除线符号
            var link1 = /^[^~]*~~[^~]*$/;	//是否只包含一侧的~~
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现~~符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/~~/g,"");    //new obsidian.Notice("成对出现~~符号");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"~~$1~~");
                所选文本 = 所选文本.replace(/^~~~~$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    MyPlugin.prototype.转换下划线 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isXHS){
                isXHS = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isXHS = true;
                new obsidian.Notice("「下划线」刷已打开！");
            }
        }else{
            var link = /\<u\>([^\<\>]*)\<\/u\>/mg;	//是否包含下划符号
            var link1 = /^[^\<\>]*\<\/?u\>[^\<\>]*$/;	//是否只包含一侧的<>
            if (link1.test(所选文本)){
                return; //new obsidian.Notice("只有一侧出现<>符号");
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(link,"$1");
            }else{
                所选文本 = 所选文本.replace(/^(.*)$/mg,"<u>$1</u>");
                所选文本 = 所选文本.replace(/^\<u\>\<\/u\>$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        }
        
    };
    MyPlugin.prototype.转换行内代码 = function() {
        this.获取编辑器信息 ();
        var link = /`[^`]*`/;	//是否包含代码行符号
        var link1 = /^[^`]*`[^`]*$/;	//是否只包含一侧的`

        if (link1.test(所选文本)){
            //new obsidian.Notice("只有一侧出现`符号");
            return;
        }else if (link.test(所选文本)){
            //new obsidian.Notice("成对出现`符号");
            所选文本 = 所选文本.replace(/`/g,"");
        }else{
            //new obsidian.Notice("需要补充`符号");
            所选文本 = 所选文本.replace(/^(.*)$/mg,"`$1`");
        }
        this.替换所选文本 (所选文本);
        编辑模式.exec("goRight");
    };

    MyPlugin.prototype.转换代码块 = function() {
        this.获取编辑器信息 ();
        var link = /```[^`]+```/;	//是否包含代码行符号
        var link1 = /^[^`]*```[^`]*$/m;	//是否只包含一侧的`

        所选文本 = 所选文本.replace(/\n/g,"↫");
        if (link1.test(所选文本)){
            //new obsidian.Notice("只有一侧出现```符号");
            return;
        }else if (link.test(所选文本)){
            //new obsidian.Notice("成对出现```符号");
            所选文本 = 所选文本.replace(/↫*```↫?|↫?```↫*/g,"");
        }else{
            //new obsidian.Notice("需要补充```符号");
            所选文本 = 所选文本.replace(/^(.*)$/m,"↫```↫$1↫```↫");
        }
        所选文本 = 所选文本.replace(/↫/g,"\n");
        this.替换所选文本 (所选文本);
        编辑模式.exec("goLeft");
        编辑模式.exec("goLeft");
        编辑模式.exec("goLeft");
        编辑模式.exec("goLeft");
    };

    MyPlugin.prototype.转换三浪线 = function() {
        this.获取编辑器信息 ();
        var link = /~~~[^~]+~~~/;	//是否包含代码行符号
        var link1 = /^[^~]*~~~[^~]*$/m;	//是否只包含一侧的~

        所选文本 = 所选文本.replace(/\n/g,"↫");
        if (link1.test(所选文本)){
            //new obsidian.Notice("只有一侧出现~~~符号");
            return;
        }else if (link.test(所选文本)){
            //new obsidian.Notice("成对出现~~~符号");
            所选文本 = 所选文本.replace(/~~~↫?|↫?~~~/g,"");
        }else{
            //new obsidian.Notice("需要补充~~~符号");
            所选文本 = 所选文本.replace(/^(.*)$/m,"~~~↫$1↫~~~");
        }
        所选文本 = 所选文本.replace(/↫/g,"\n");
        this.替换所选文本 (所选文本);
        编辑模式.exec("goRight");
    };

    MyPlugin.prototype.转换上标 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isSB){
                isSB = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isSB = true;
                new obsidian.Notice("「上标」刷已打开！");
            }
        }else{
            var link = /\<sup\>[^\<\>]*\<\/sup\>/g;	//是否包含<sup>下标</sup>
            var link1 = /\<sup\>[^\<\>\/]*$|^[^\<\>]*\<\/sup\>/g;	//是否只包含一侧的<sup>下标</sup>
            if (link1.test(所选文本)){
                //new obsidian.Notice("只有一侧出现<sup>下标</sup>符号");
                return;
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/(\<sup\>|\<\/sup\>)/g,"");
            }else{
                所选文本 = 所选文本.replace(/^(.+)$/mg,"\<sup\>$1\<\/sup\>");
                所选文本 = 所选文本.replace(/^\<sup\>\s*\<\/sup\>$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        };
    };

    MyPlugin.prototype.转换下标 = function() {
        this.获取编辑器信息 ();
        if(所选文本==""){
            if(isXB){
                isXB = false;
                new obsidian.Notice("已关闭格式刷！");
            }else{
                this.关闭格式刷();
                isXB = true;
                new obsidian.Notice("「下标」刷已打开！");
            }
        }else{
            var link = /\<sub\>[^\<\>]*\<\/sub\>/g;	//是否包含<sub>下标</sub>
            var link1 = /\<sub\>[^\<\>\/]*$|^[^\<\>]*\<\/sub\>/g;	//是否只包含一侧的<sub>下标</sub>
            if (link1.test(所选文本)){
                return;
            }else if (link.test(所选文本)){
                所选文本 = 所选文本.replace(/(\<sub\>|\<\/sub\>)/g,"");
            }else{
                所选文本 = 所选文本.replace(/^(.+)$/mg,"\<sub\>$1\<\/sub\>");
                所选文本 = 所选文本.replace(/^\<sub\>\s*\<\/sub\>$/mg,"");
            }
            this.替换所选文本 (所选文本);
            编辑模式.exec("goRight");
        };
    };

    MyPlugin.prototype.转换挖空 = function() {
        this.获取编辑器信息 ();
        var link = /\{\{c\d::[^\{\}]+\}\}/g;	//是否包含{{c*::}}
        var link1 = /\{\{c[^\{\}]*$|^[^\{\}]*\}\}/g;	//是否只包含一侧的{{c*::}}

        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/(\{\{c\d::|\}\})/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"\{\{c1::$1\}\}");
        }
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.选择当前整段 = function () {    
        this.获取编辑器信息 ();
        编辑模式.setSelection({line:当前行号,ch:0}, {line:当前行号,ch:当前行文本.length});
    };

    MyPlugin.prototype.选择当前整句 = function () {
        this.获取编辑器信息 ();
        var 句前 = 选至行首.match(/(?<=(^|[。？！]))[^。？！]*$/)[0];
        var 句后 = 选至行尾.match(/^[^。？！]*([。？！]|$)/)[0];
        var _length1 = 选至行首.length-句前.length;
        var _length2 = 选至行首.length+句后.length;
        //new obsidian.Notice(句前+"\n光标\n"+句后);
        编辑模式.setSelection({line:当前行号,ch:_length1}, {line:当前行号,ch:_length2});
    };

    MyPlugin.prototype.重复当前行 = function () {
        this.获取编辑器信息 ();
        var 新行文本 = "\n" + 当前行文本;
        笔记全文.replaceRange(新行文本, {line:当前行号,ch:当前行文本.length}, {line:当前行号,ch:当前行文本.length});
    };

    MyPlugin.prototype.智能符号 = function () {
        var 标前两字 = 编辑模式.getRange({line:当前行号,ch:选至行首.length-2}, 当前光标);
        var 标后两字 = 编辑模式.getRange(当前光标,{line:当前行号,ch:选至行首.length+2});
        //new obsidian.Notice("标前两字\n"+标前两字+"\n\n标后两字：\n"+标后两字);

        if(选至行尾.match(/^(\]\]|\=\=|\*\*|\~\~)/)){
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");   //如果下个字符是后括号，则跃过
        }else if(选至行尾.match(/^[$》〉］｝】〗〕』」）}\)]/)){
            编辑模式.exec("goRight");   //如果下个字符是后括号，则跃过
        }else if(标前两字.match(/^[【\[][（\(]$/)){
            笔记全文.replaceRange("〖", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[（\(][《\<]$/)){
            笔记全文.replaceRange("〈", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[\(（][【\[]$/)){
            笔记全文.replaceRange("〔", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[“\"][【\[]$/)){
            笔记全文.replaceRange("『", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^[‘\'][【\[]$/)){
            笔记全文.replaceRange("「", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^……$/)){
            笔记全文.replaceRange("^", {line:当前行号,ch:选至行首.length-2}, 当前光标);
        }else if(标前两字.match(/^￥￥$/)){
            笔记全文.replaceRange("$$", {line:当前行号,ch:选至行首.length-2}, 当前光标);
            编辑模式.exec("goLeft");
        }else if(选至行首.match(/《[^《》〈〉｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("》", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/〈[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("〉", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/［[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("］", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/｛[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("｝", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/【[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("】", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/〖[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("〗", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/〔[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("〕", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/『[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("』", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/「[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("」", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/（[^《》〈〉［］｛｝【】〖〗〔〕（）『』「」]*$/)){
            笔记全文.replaceRange("）", 当前光标, 当前光标);
            编辑模式.exec("goRight");
        }else if(选至行首.match(/^》$/)){
            笔记全文.replaceRange(">", {line:当前行号,ch:0}, 当前光标);
        }else if(选至行首.match(/^、$/)){
            笔记全文.replaceRange("/", {line:当前行号,ch:0}, 当前光标);
        }else if(选至行首.match(/\[\[[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("]]", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/==[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("==", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/\*\*[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("**", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/%%[^=\[\]\*~%]*$/)){
            笔记全文.replaceRange("%%", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/~~[^=\[\]\*~]*$/)){
            笔记全文.replaceRange("~~", 当前光标, 当前光标);
            编辑模式.exec("goRight");
            编辑模式.exec("goRight");
        }else if(选至行首.match(/^(dataview|dv)$/i)){
            笔记全文.replaceRange("```dataview\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(mermaid|mm)$/i)){
            笔记全文.replaceRange("```mermaid\ngraph TD\n\nA[2021]\nB[2022]\n\nA-->B\n```\n", {line:当前行号,ch:0}, 当前光标);
        }else if(选至行首.match(/^(query|qy)$/i)){
            笔记全文.replaceRange("```query\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(JavaScript|js)$/i)){
            笔记全文.replaceRange("```JavaScript\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(Java|ja)$/i)){
            笔记全文.replaceRange("```Java\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(Python|py)$/i)){
            笔记全文.replaceRange("```Python\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }else if(选至行首.match(/^(CSS)$/i)){
            笔记全文.replaceRange("```CSS\n\n```\n", {line:当前行号,ch:0}, 当前光标);
            编辑模式.exec("goLeft");
            编辑模式.exec("goUp");
        }
    };

    MyPlugin.prototype.标题语法 = function(_str) {
        var link = eval("/^"+_str+" ([^#]+)/");	//是否包含几个#符号
       this.获取编辑器信息 ();
        var 新文本 = "";
        if(_str==""){
            新文本 = 当前行文本.replace(/^\s*#+\s/,"");
        }else if (link.test(当前行文本)){
            新文本 = 当前行文本.replace(link,"$1");
        }else{
            新文本 = 当前行文本.replace(/^#+[ ]+/,"");
            新文本 = 新文本.replace(/^\s*/,_str+" ");
        }
        //new obsidian.Notice(新文本);
        笔记全文.replaceRange(新文本, {line:当前行号,ch:0}, {line:当前行号,ch:当前行文本.length});
        if(当前行文本==""){  //如果当前行为空，指定标题后 光标放置末尾
            var i=0;
             while (i<_str.length+1){
                编辑模式.exec("goRight");
                i++;
            }
        };
    };

    MyPlugin.prototype.转换文字颜色 = function(_color) {
        var _html0 = /\<font color=[0-9a-zA-Z#]+[^\<\>]*\>[^\<\>]+\<\/font\>/g;
        var _html1 = /^\<font color=[0-9a-zA-Z#]+[^\<\>]*\>([^\<\>]+)\<\/font\>$/;
        var _html2 = '\<font color='+_color+'\>$1\<\/font\>';
        var _html3 = /\<font color=[^\<]*$|^[^\>]*font\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(所选文本);
        this.获取编辑器信息 ();
        if (_html3.test(所选文本)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(所选文本)){
            if(_html1.test(所选文本)){
                //new obsidian.Notice("替换颜色！");
                所选文本 = 所选文本.replace(_html1,_html2);
            }else{
                所选文本 = 所选文本.replace(/\<font color=[0-9a-zA-Z#]+[^\<\>]*?\>|\<\/font\>/g,""); 
            }
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.转换背景颜色 = function(_color) {
        var _html0 = /\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>[^\<\>]+\<\/span\>/g;
        var _html1 = /^\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>([^\<\>]+)\<\/span\>$/;
        var _html2 = '\<span style=\"background\-color:'+_color+'\"\>$1\<\/span\>';
        var _html3 = /\<span style=[^\<]*$|^[^\>]*span\>/g;	//是否只包含一侧的<>
        //new obsidian.Notice(所选文本);
        this.获取编辑器信息 ();
        if (_html3.test(所选文本)){
            return; //new obsidian.Notice("不能转换颜色！");
        }else if (_html0.test(所选文本)){
            if(_html1.test(所选文本)){
                所选文本 = 所选文本.replace(_html1,_html2); 
            }else{
                所选文本 = 所选文本.replace(/\<span style=[\"'][^\<\>]*color:[0-9a-zA-Z#]+[\"'][^\<\>]*\>|\<\/span\>/g,"");
                //new obsidian.Notice("需要去除颜色！");
            }
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,_html2);  //new obsidian.Notice("可以转换颜色！");
        }
        this.替换所选文本 (所选文本);
    };
    
    MyPlugin.prototype.转换无语法文本 = function() {
        this.获取编辑器信息 ();
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\s*\- |^\-+$|^\*+$)/mg;
        if(所选文本 == ""){
            if(isCTS || isGLS || isSB || isSCS || isXB || isXHS || isXTS){
                this.关闭格式刷();
                new obsidian.Notice("已关闭格式刷！");
            }else{
                //new obsidian.Notice("请先划选部分文本，再执行命令！");
                var reg1 = /(~~|%%|==|\*\*?|\<[^\<\>]*\>|!?\[\[*|`|_|!?\[)([^!#=\[\]\<\>\`_\*~\(\)]*)$/;
                var reg2 = /^([^!=\[\]\<\>\`_\*~\(\)]*)(~~|%%|==|\*\*?|\<[^\<\>]*\>|\]\]|`|_|\]\([^\(\)\[\]]*\))/;
                if(选至行首.match(reg1)!=null && 选至行尾.match(reg2)!=null){
                    选至行首 = 选至行首.replace(reg1,"$2");
                    选至行尾 = 选至行尾.replace(reg2,"$1");
                    var _ch = 选至行首.length;
                    笔记全文.replaceRange(选至行首+选至行尾, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
                    编辑模式.setCursor({line:当前行号,ch:_ch});
                }
            }
        }else{
            所选文本 = 所选文本.replace(mdText,"");
            所选文本 = 所选文本.replace(/^[ ]+|[ ]+$/mg,"");
            所选文本 = 所选文本.replace(/\!?\[\[([^\[\]\|]*\|)*([^\(\)\[\]]+)\]\]/g,"$2");
            所选文本 = 所选文本.replace(/\!?\[+([^\[\]\(\)]+)\]+\(([^\(\)]+)\)/g,"$1");
            所选文本 = 所选文本.replace(/`([^`]+)`/g,"$1");
            所选文本 = 所选文本.replace(/_([^_]+)_/g,"$1");
            所选文本 = 所选文本.replace(/==([^=]+)==/g,"$1");
            所选文本 = 所选文本.replace(/\*\*?([^\*]+)\*\*?/g,"$1");
            所选文本 = 所选文本.replace(/~~([^~]+)~~/g,"$1");
            所选文本 = 所选文本.replace(/(\r*\n)+/mg,"\r\n");
            this.替换所选文本 (所选文本);
        }
    };

    MyPlugin.prototype.括选文本1 = function() {
        var link = /.*【[^【】]+】.*/g;	//是否包含【】
        var link1 = /【[^【】]*$|^[^【】]*】/g;	//是否只包含一侧的【】
        this.获取编辑器信息 ();
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[【】]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"【$1】");
            所选文本 = 所选文本.replace(/^【\s*】$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.括选文本2 = function() {
        var link = /.*（[^（）]*）.*/g;	//是否包含【】
        var link1 = /（[^（）]*$|^[^（）]*）/g;	//是否只包含一侧的【】
        this.获取编辑器信息 ();
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[（）]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"($1)");
            所选文本 = 所选文本.replace(/^(\s*)$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.括选文本3 = function() {
        var link = /.*「[^「」]*」.*/g;	//是否包含「」
        var link1 = /「[^「」]*$|^[^「」]*」/g;	//是否只包含一侧的「
        this.获取编辑器信息 ();
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[「」]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"「$1」");
            所选文本 = 所选文本.replace(/^「\s*」$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.括选文本4 = function() {
        var link = /.*《[^《》]*》.*/;	//是否包含《》
        var link1 = /《[^《》]*$|^[^《》]*》/;	//是否只包含一侧的《
        this.获取编辑器信息 ();
        if (link1.test(所选文本)){
            return;
        }else if (link.test(所选文本)){
            所选文本 = 所选文本.replace(/[《》]/g,"");
        }else{
            所选文本 = 所选文本.replace(/^(.+)$/mg,"《$1》");
            所选文本 = 所选文本.replace(/^《\s*》$/mg,"");
        }
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.删除当前段落 = function() {
        //优化Ob自带功能，支持删除光标所在链接文本，修正有序列表的序号
        this.获取编辑器信息 ();
        var reg = /^[\t\s]*\d+(?=\.\s[^\s])/mg;
        if(当前行文本.match(reg)==null){
            //new obsidian.Notice("当前不是列表");
            var 选至行首 = 编辑模式.getRange({line:当前行号,ch:0}, 当前光标);
            var 选至行尾 = 编辑模式.getRange(当前光标,{line:当前行号,ch:当前行文本.length});
            var reg1 =/^(.*\[\[)[^\[]+$/;
            var reg2 = /^[^\]]+(\]\].*)$/

            //当前光标在[[]]中间，只删除链接文字
            if(reg1.test(选至行首) && reg2.test(选至行尾)){
                new obsidian.Notice("优先删除链接内容，供修改！");
                选至行首 = 选至行首.replace(reg1,"$1");
                选至行尾 = 选至行尾.replace(reg2,"$1");
                笔记全文.replaceRange(选至行首+选至行尾, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
                编辑模式.setCursor({line:当前行号,ch:选至行首.length});
            }else{
                //当前所在行为普通文本，直接删除
                笔记全文.replaceRange("", {line:当前行号,ch:0},{line:Number(当前行号+1),ch:0});
            }
        }else{
            //当前所在行为有序列表的一项，则调小后表部分的序号
            var 末行行号 = 编辑模式.lastLine();
            var 末行文本 = 编辑模式.getLine(末行行号);
            var 选至文末 = 编辑模式.getRange({line:当前行号,ch:0},{line:末行行号,ch:末行文本.length}).replace(/\n/g,"↫");
            var 后表部分 = 选至文末.match(/^([\t\s]*\d\.\s[^↫]*↫)+/)[0].replace(/↫/g,"\n"); //替换为单行文本，再截取后表部分
            var 后表行数 = 后表部分.match(/\n/g).length;    //计算换行次数
            var 缩进字符 = 当前行文本.match(/^[\t\s]*(?=\d)/)[0];
            var reg3 = eval("/(?<=^"+缩进字符+")\\d+(?=\\.*\\s)/mg");    //按当前行的缩进格式进行查找替换
            后表部分 = 后表部分.replace(reg3, function(a){return a*1-1;});
            后表部分 = 后表部分.replace(/^[^\n]*\n/,"");
            //new obsidian.Notice("选至文末\n"+选至文末);
            笔记全文.replaceRange(后表部分, {line:当前行号,ch:0},{line:当前行号+后表行数,ch:编辑模式.getLine(当前行号+后表行数).length});
        };
    };
    
    MyPlugin.prototype.转换待办列表 = function() {
        this.获取编辑器信息 ();
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[) (?=\]\s[^\s])/mg,"x☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)x(?=\]\s[^\s])/mg,"-☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\-(?=\]\s[^\s])/mg,"!☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\!(?=\]\s[^\s])/mg,"?☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\?(?=\]\s[^\s])/mg,">☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\>(?=\]\s[^\s])/mg,"<☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\<(?=\]\s[^\s])/mg,"+☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[)\+(?=\]\s[^\s])/mg," ☀");
        所选文本 = 所选文本.replace(/(?<=^\s*([\-\+]|[0-9]+\.)\s\[[\sx\-\+\?\!\<\>])☀(?=\]\s[^\s])/mg,"");
        this.替换所选文本 (所选文本);
    };

    MyPlugin.prototype.自动设置标题 = function() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/\r?\n/g,"↫");
        笔记正文 = 笔记正文.replace(/↫\s*↫/g,"↫↫");
        笔记正文 = 笔记正文.replace(/\s*(?=↫)/g,"");
        笔记正文 = 笔记正文.replace(/(?<=^|↫)([^#`\[\]\(\)↫]{3,}[^\.\?\!:,0-9，：。？！）↫])(?=↫|$)/g,"↫### $1↫");
        笔记正文 = 笔记正文.replace(/#+([^#↫]+)↫*$/mg,"$1");    //取消末行标题
        笔记正文 = 笔记正文.replace(/↫{3,}/g,"\r\n\r\n");
        笔记正文 = 笔记正文.replace(/↫/g,"\r\n");
        this.替换笔记正文 (笔记正文);
    };
    
    MyPlugin.prototype.指定当前文件名 = function () {
        this.获取编辑器信息 ();
        当前文件路径 = this.app.workspace.getActiveFile().path;
        if (所选文本 == ""){return};
        //navigator.clipboard.writeText(所选文本);
        //this.app.workspace.activeLeaf.replaceSelection(所选文本);
        this.app.vault.adapter.rename(当前文件路径, 所选文本+".md"); //强行重命名，不能全局更新
        //new obsidian.Notice(当前文件路径+"\n"+所选文本);
    };

    MyPlugin.prototype.获取相对路径 = function () {
        当前文件 = _this.app.workspace.getActiveFile();
        当前文件路径 = 当前文件.path;
        //navigator.clipboard.writeText(当前文件路径)
        var 相对目录 = 当前文件路径.replace(/(?<=\/)[^\/]+$/m,"");
        new obsidian.Notice("当前笔记位于："+相对目录);
    };

    MyPlugin.prototype.粘贴表格 = function() {
    	this.获取编辑器信息 ();
    	var 分隔行 = "";        //获取 当前窗口  //其中const是【常数】
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
			编辑模式.replaceSelection(xlsText);
			//将当前光标位置替换为处理后的md语法表格数据
			//mdView.setMode(mdView.previewMode)
		})
		.catch(err => {
			console.error('未能读取到剪贴板上的内容: ', err);
		});
    }
    
    MyPlugin.prototype.获取标注文本 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        var tmp = 笔记正文.replace(/^(?!#+ |#注释|#标注|#批注|#反思|#备注|.*==|.*%%).*$|^[^#\n%=]*(==|%%)|(==|%%)[^\n%=]*$|(==|%%)[^\n%=]*(==|%%)/mg,"\n");
        tmp = tmp.replace(/[\r\n|\n]+/g,"\n")        
        new obsidian.Notice("已成功获取，请粘贴！");
        navigator.clipboard.writeText(tmp);
    };

    MyPlugin.prototype.获取无语法文本 = function() {
        this.获取编辑器信息 ();
        var mdText = /(^#+\s|(?<=^|\s*)#|^>|^\- \[( |x)\]|^\+ |<[^<>]+>|^1\. |^\-+$|^\*+$|==|\*+|~~|```|!*\[\[|\]\])/mg;
        if(所选文本 == ""){
            new obsidian.Notice("请先划选部分文本，再执行命令！");
        }else{
            所选文本 = 所选文本.replace(/\[([^\[\]]*)\]\([^\(\)]+\)/img,"$1");
            所选文本 = 所选文本.replace(mdText,"");
            所选文本 = 所选文本.replace(/^[ ]+|[ ]+$/mg,"");
            所选文本 = 所选文本.replace(/(\r\n|\n)+/mg,"\n");
            new obsidian.Notice("无语法文本 已成功获取，请粘贴！");
            navigator.clipboard.writeText(所选文本);
        }
    };

    MyPlugin.prototype.嵌入当前网址页面 = function () {
        this.获取编辑器信息 (); 
        var vid,web;
        var 基本格式 = '\n<iframe src="■" width=100% height="500px" frameborder="0" scrolling="auto"></iframe>';
        if(所选文本.match(/^https?:\/\/[^:]+/)){
            if(所选文本.match(/^https?:\/\/v\.qq\.com/)){
                vid = 所选文本.replace(/^http.*\/([^\/=\?\.]+)(\.html.*)?$/,"$1");
                web = "https://v.qq.com/txp/iframe/player.html?vid="+vid;
            }else if(所选文本.match(/^https?:\/\/www\.bilibili\.com/)){
                vid = 所选文本.replace(/^http.*\/([^\/=\?\.]+)(\?spm.*)?$/,"$1");
                web = "https://player.bilibili.com/player.html?bvid="+vid;
            }else if(所选文本.match(/^https?:\/\/www\.youtube\.com/)){
                vid = 所选文本.replace(/^http.*?v=([^\/=\?\.]+)(\/.*)?$/,"$1");
                web = "https://www.youtube.com/embed/"+vid;
            }else{
                web = 所选文本;
            }
            基本格式 = 基本格式.replace(/■/,web);
            笔记全文.replaceRange(基本格式, {line:当前行号,ch:当前行文本.length},{line:当前行号,ch:当前行文本.length});
            编辑模式.exec("goRight");
        }else{
            new obsidian.Notice("所选文本不符合网址格式，无法嵌入！");
        }
    };

    MyPlugin.prototype.批量插入空行 = function() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<!^(\s*\- |\s*[0-9]+\.|\s*\>|\n)[^\n]*)\n(?!(\s*\- |\s*[0-9]+\.|\s*\>|\n))/g,"$1\n\n");
        this.替换笔记正文 (笔记正文);
    };
    
    MyPlugin.prototype.批量去除空行 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(\r\n|\n)[\t\s]*(\r\n|\n)/g,"\n");
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.首行缩进两字符 = function() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        //new obsidian.Notice(笔记正文);
        if(isIndent){
            笔记正文 = 笔记正文.replace(/^[‌‌‌　]+/mg,"");
            笔记正文 = 笔记正文.replace(/^(?!([\n\s\>#]+|```|\-\-\-|\|[^\|]|\*\*\*))/mg,"‌‌‌　　");
            isIndent = false;
        }else{
            笔记正文 = 笔记正文.replace(/^[‌‌‌　]+/mg,"");
            isIndent = true;
        }
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.末尾追加空格 = function() {
		this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<!(\-\-\-|\*\*\*|\s\s))\n/g,"  \n");
        this.替换笔记正文 (笔记正文);
    };
        
    MyPlugin.prototype.去除末尾空格 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/\s\s\n/g,"\n")
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.上方插入空行 = function(_str) {
        this.获取编辑器信息 ();
        var 新文本 = "\r\n"+当前行文本;
        笔记全文.replaceRange(新文本, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
    };

    MyPlugin.prototype.下方插入空行 = function(_str) {
        this.获取编辑器信息 ();
        var 新文本 = 当前行文本+"\r\n";  //.replace(/^([^\r\n]*)$/,"$1\n");
        笔记全文.replaceRange(新文本, {line:当前行号,ch:0},{line:当前行号,ch:当前行文本.length});
        编辑模式.setSelection({line:当前行号,ch:当前行文本.length+1}, {line:当前行号,ch:当前行文本.length+1});
    };
   
    MyPlugin.prototype.添加中英间隔 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/([a-zA-Z]+)([一-鿆]+)/g,"$1 $2")
        笔记正文 = 笔记正文.replace(/([一-鿆]+)([a-zA-Z]+)/g,"$1 $2")
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.去除所有空格 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/[ 　]+/g,"")
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.同目录下一笔记 = function() {
        var 当前文件 = this.app.workspace.getActiveFile();
        var 当前文件路径 = 当前文件.path;
        //当前文件路径 = 当前文件路径.replace(/\.md/,"")
        //new obsidian.Notice(当前文件路径);

        var 库文件路径列表 = this.app.vault.getMarkdownFiles().map((file) => {
            return file.path;
        });

        var _string = 库文件路径列表.toString();
        _string = _string.replace(/(^|,)([^\/,]+)(?=\/)/img,"$1■$2");
        new obsidian.Notice(_string);
        var newList = _string.split(",");
        newList.sort();

        navigator.clipboard.writeText(newList.toString().replace(/,/g,"\n"));
        new obsidian.Notice("文件列表已写入剪贴板！");
        
        var _mdID = 库文件路径列表.findIndex(checkAdult);
        new obsidian.Notice(_mdID + " " + 当前文件路径 + "\n" + Number(_mdID-1) + " " + 库文件路径列表[_mdID-1]);

        function checkAdult(age) {
            return age.includes(当前文件路径)
        }
    }

    MyPlugin.prototype.搜索当前文本 = function() {
        var 当前文件 = this.app.workspace.getActiveFile();
        var 当前文件路径 = 当前文件.name;
        new obsidian.Notice(当前文件路径);
        当前文件路径 = 当前文件路径.replace(/\.md$/,"")
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        var _txt = view.getSelection();
        _txt = _txt.replace(/^/,"path:"+当前文件路径+" /")
        this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch(_txt)
    };

    MyPlugin.prototype.修复意外断行 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<=[^a-zA-Z])\s+(?=\r*\n)/g,"")
        笔记正文 = 笔记正文.replace(/(?<=[a-zA-Z])\s+(?=\r*\n)/g," ")
        //去除末尾非字母后的空格，将末尾字母后的多个空格保留一个
        笔记正文 = 笔记正文.replace(/([^。？！\.\?\!])(\r?\n)+/g,"$1")
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.修复错误语法 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/[\[【]([^\[\]【】]*)[】\]][（|\(]([^\(\)（）]*)[）|\)]/g,"\[$1\]\($2\)");
        //将 【】（）或【】() 转换为[]()
        笔记正文 = 笔记正文.replace(/\[+([^\[\]]*)\]+\(/g,"\[$1\](");
        //处理 bookXnote 回链语法，将 [[链接]]() 转换为 []()
        笔记正文 = 笔记正文.replace(/(?<=^|\s)    /mg,"\t");
        //把 四个空格转换为 制表符
        笔记正文 = 笔记正文.replace(/\*\s+\>\s+/g,"- ");
        //处理 bookXnote 回链语法中的列表
        笔记正文 = 笔记正文.replace(/(?<=\s)[0-9]+。 /g,"1. ");
        //把 1。 转换为 有序列表样式
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.英转中文标点 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]]),/g,"，")
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]])\./isg,"。");   //数字后的黑点不转为句号
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]])\?/g,"？")
        笔记正文 = 笔记正文.replace(/(?<=[^a-z0-9\>\]])!(?=[^\[])/g,"！")
        笔记正文 = 笔记正文.replace(/;/g,"；")
        笔记正文 = 笔记正文.replace(/(?<=[^:]):|:(?=[^:])/g,"：")
        笔记正文 = 笔记正文.replace(/\(/g,"（")
        笔记正文 = 笔记正文.replace(/\)/g,"）")
        笔记正文 = 笔记正文.replace(/\{([^{}]*)\}/g,"｛$1｝")
        笔记正文 = 笔记正文.replace(/\"([^\"]*?)\"/g,"“$1”")
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.中转英文标点 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        笔记正文 = 笔记正文.replace(/，/g,",")
        笔记正文 = 笔记正文.replace(/。/g,"\.")
        笔记正文 = 笔记正文.replace(/？/g,"\?")
        笔记正文 = 笔记正文.replace(/！/g,"!")
        笔记正文 = 笔记正文.replace(/；/g,";")
        笔记正文 = 笔记正文.replace(/：/g,":")
        笔记正文 = 笔记正文.replace(/（/g,"\(")
        笔记正文 = 笔记正文.replace(/）/g,"\)")
        笔记正文 = 笔记正文.replace(/｛([^｛｝]*)｝/g,"{$1}")
        笔记正文 = 笔记正文.replace(/“([^“”]*)”/g,"\"$1\"")
        this.替换笔记正文 (笔记正文);
    };

    MyPlugin.prototype.转换路径 = function() {
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        var link1 = /^[a-zA-Z]:\\/;	//符合普通路径格式
        var link2 = /^(\[[^\[\]]*\]\()*file:\/\/\/[^\(\)]*\)*/;	//符合[](file路径)格式
        var link3 = /^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/;	//意外路径格式
        if (link1.test(笔记正文)){
            笔记正文 = 笔记正文.replace(/\s/mg,"%20");
            笔记正文 = 笔记正文.replace(/^(.*)$/m,"\[file\]\(file:///$1\)");
            笔记正文 = 笔记正文.replace(/\\/img,"\/");
            this.替换笔记正文 (笔记正文);
        }else if(link2.test(笔记正文)){
            笔记正文 = 笔记正文.replace(/%20/mg," ");
            笔记正文 = 笔记正文.replace(/^(\[[^\[\]]*\]\()*file:\/\/\/([^\(\)]*)\)*/m,"$2");
            笔记正文 = 笔记正文.replace(/\//mg,"\\");
            this.替换笔记正文 (笔记正文);
        }else if(link3.test(笔记正文)){
            笔记正文 = 笔记正文.replace(/^\[[^\[\]]*\]\(([a-zA-Z]:\\[^\(\)]*)\)*/m,"$1");
            this.替换笔记正文 (笔记正文);
        }else{
            new obsidian.Notice("您划选的路径格式不正确！");
            return
        }
    };

    MyPlugin.prototype.简体转繁 = function(){
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        var _list1 = this.settings.jtList;
        var _list2 = this.settings.ftList;
        
        for (var i=0;i<_list1.length;i++){ 
            笔记正文 = 笔记正文.replace(eval("/"+_list1[i]+"/g"),_list2[i]);
        }
        this.替换笔记正文 (笔记正文);
    }

    MyPlugin.prototype.繁体转简 = function(){
        this.获取编辑器信息 ();
        if (!笔记正文) return;
        var _list1 = this.settings.jtList;
        var _list2 = this.settings.ftList;        
        for (var i=0;i<_list1.length;i++){ 
            笔记正文 = 笔记正文.replace(eval("/"+_list2[i]+"/g"),_list1[i]);
        }
        this.替换笔记正文 (笔记正文);
    }

    /*
    以下为基本函数，涉及 获取所选文本、获取笔记正文、替换所选文本、替换笔记正文、获取编辑模式
    */
    MyPlugin.prototype.获取所选文本 = function() {
        var cmEditor = this.获取编辑模式 ();
        if (!cmEditor) return;
        var Selection = cmEditor.getSelection();
       	return Selection;
    };

    MyPlugin.prototype.获取笔记正文 = function() {
        var cmEditor = this.获取编辑模式 ();
    	if (!cmEditor) return;
         if (cmEditor.getSelection() != "") {
       		return cmEditor.getSelection();
        } else {
            return cmEditor.getValue();         
        }
    };

    MyPlugin.prototype.替换所选文本 = function(Selection) {
        var cmEditor = this.获取编辑模式 ();
        cmEditor.replaceSelection(Selection);
    };

    MyPlugin.prototype.替换笔记正文 = function(lines) {
        var cmEditor = this.获取编辑模式 ();
        if (cmEditor.getSelection() != "") {
            cmEditor.replaceSelection(lines);
        } else {
            cmEditor.setValue(lines);
        }
    };

    MyPlugin.prototype.获取编辑模式 = function () {
        var _view = this.app.workspace.activeLeaf.view;
        if (_view.getMode() == 'source') {
            var cmEditor = _view.sourceMode.cmEditor;
            return cmEditor;
        }else{
            //new obsidian.Notice("阅读视图！");
            return null;
        }        
    };
    /*

    */
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
        containerEl.createEl('h2', { text: '增强编辑 0.4.1' });
        new obsidian.Setting(containerEl)
            .setName('📣 转换内部链接「Alt+Z」 在选文两端添加或去除 [[ ]] 符号')
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
        var div0 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var linkText = document.createDocumentFragment();
        linkText.appendText('转换同义链接「Alt+Q」：将选文转换为 [[|选文]] 样式后再选择文档')
        linkText.appendChild(document.createElement('br'));
        div0.appendChild(linkText);

        new obsidian.Setting(containerEl)
            .setName('📣 智能换行「Enter」 默认支持```代码块```内换行缩进效果')
            .setDesc('启用此项后，在非列表或代码块的文本中按下回车后补加一次换行；如想普通换行，可按下 Shift+Enter 键。')
            .addToggle(function (toggle) { return toggle.setValue(_this.settings.twoEnter)
                .onChange(function (value) {
                _this.settings.twoEnter = value;
                _this.plugin.saveSettings();
            }); });
        new obsidian.Setting(containerEl)
            .setName('📣 键控游标「Alt+IJKL」 利用主键盘区控制编辑区的游标位置')
            .setDesc('按下Alt+ I上 J左 K下 L右 U首 O尾 快捷键，控制游标移动位置。')

        new obsidian.Setting(containerEl)
            .setName('📣 智能语法「Alt+;」 自动转换、匹配或跳过各种类型的括号或代码块语法')
            .setDesc('可将[( (< ([ "[ \'[等组合转为〖〈〔『「，或将dv、qy、mm、CSS、js、ja、ty等字符串转为代码块语法。')
        
        new obsidian.Setting(containerEl)
            .setName('📣 设置标题及粗、斜、删、亮等效果（MarkDown语法）功能。')
            .setDesc('启用后，当未选文本时按下Alt+C +G +S +U +N 等快捷键，即会开启或关闭 相应的MD语法「格式刷」功能。')
            /*.addToggle(function (toggle) { return toggle.setValue(_this.settings.toggleMD)
                .onChange(function (value) {
                _this.settings.toggleMD = value;
                _this.plugin.saveSettings();
                new obsidian.Notice("重启Obsidian后方可让设置生效！");
            }); });*/
        var div1 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var mdText = document.createDocumentFragment();
        mdText.appendText('转换标题语法「Ctrl+1-6」∶指定或取消当前行文本为N级标题');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换粗体语法「Alt+C」∶将选文转为或去除 **粗体** 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换斜体语法「Alt+X」∶将选文转为或去除 *斜体* 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换行内代码「Alt+D」∶将选文转为或去除 `行内代码` 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换删除线「Alt+S」∶将选文转为或去除 ~~删除线~~ 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换下划线「Alt+H」∶将选文转为或去除 <u>下划线</u> 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换代码块「未设置」∶将选文转为或去除 ```代码块``` 效果');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('转换无语法文本「Ctrl+Alt+Z」∶鼠标点击或划选文本的语法部分，可去除相应的markdown语法字符');
        mdText.appendChild(document.createElement('br'));
        mdText.appendText('获取无语法文本「Ctrl+Alt+C」∶去除选文中的所有markdown语法字符，并写入剪贴板');
        mdText.appendChild(document.createElement('br'));
        div1.appendChild(mdText);

        new obsidian.Setting(containerEl)
            .setName('📣 设置设置彩色文字及背景、上下标等效果（Html语法）功能。')
            /*.addToggle(function (toggle) { return toggle.setValue(_this.settings.toggleHtml)
                .onChange(function (value) {
                _this.settings.toggleHtml = value;
                _this.plugin.saveSettings();
                new obsidian.Notice("重启Obsidian后方可让设置生效！");
            }); });*/
        var div2 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var htmlText = document.createDocumentFragment();
        htmlText.appendText('转换文字颜色「Ctrl+Shift+1-7」∶将选文转为或去除 赤橙黄绿青蓝紫 颜色');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换背景颜色「Ctrl+Alt+1-7」∶将选文背景转为或去除 赤橙黄绿青蓝紫 颜色');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换上标语法「Alt+U」∶将选文转为或去除 <sup>上标</sup> 效果');
        htmlText.appendChild(document.createElement('br'));
        htmlText.appendText('转换下标语法「Alt+N」∶将选文转为或去除 <sub>下标</sub> 效果');
        htmlText.appendChild(document.createElement('br'));
        div2.appendChild(htmlText);

        new obsidian.Setting(containerEl)
            .setName('📣 设置标点、符号、状态等转换功能。')
            /*.addToggle(function (toggle) { return toggle.setValue(_this.settings.toggleZH)
                .onChange(function (value) {
                _this.settings.toggleZH = value;
                _this.plugin.saveSettings();
                new obsidian.Notice("重启Obsidian后方可让设置生效！");
            }); });*/
        var div3 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var charText = document.createDocumentFragment();
        charText.appendText('英转中文标点「未设置」∶将笔记中的英文标点转换为中文标点，如,.?!"等');
        charText.appendChild(document.createElement('br'));
        charText.appendText('中转英文标点「未设置」∶将笔记中的中文标点转换为英文标点，如，。？！“等');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换路径语法「未设置」∶将 c:\\windows 与 [](file:///c:\/windows) 路径语法相互转换');
        charText.appendChild(document.createElement('br'));
        // charText.appendText('简体转为繁体「未设置」：将笔记中的简体汉字转换为繁体汉字');
        // charText.appendChild(document.createElement('br'));
        // charText.appendText('繁体转为简体「未设置」：将笔记中的繁体汉字转换为简体汉字');
        // charText.appendChild(document.createElement('br'));
        charText.appendText('转换待办状态「未设置」：转换选文行首的待办状态，顺序为 -[ x-!?><+] 效果');
        charText.appendChild(document.createElement('br'));
        charText.appendText('转换挖空「未设置」：将选文转为或去除 {{c1::选文}} 效果');
        charText.appendChild(document.createElement('br'));
        charText.appendText('【选文】「未设置」：在选文两端添加或去除 【】符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('（选文）「未设置」：在选文两端添加或去除 （）符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('「选文」「未设置」：在选文两端添加或去除 「」符号');
        charText.appendChild(document.createElement('br'));
        charText.appendText('《选文》「未设置」：在选文两端添加或去除 《》符号');
        div3.appendChild(charText);

        new obsidian.Setting(containerEl)
            .setName('📣 设置粘贴表格、修复语法、选择段句等功能。')
            /*.addToggle(function (toggle) { return toggle.setValue(_this.settings.toggleTS)
                .onChange(function (value) {
                _this.settings.toggleTS = value;
                _this.plugin.saveSettings();
                new obsidian.Notice("重启Obsidian后方可让设置生效！");
            }); });*/
        var div4 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var toolText = document.createDocumentFragment();
        toolText.appendText('粘贴MD表格「Ctrl+Alt+V」∶将复制的Office表格直接粘贴为MarkDown语法表格');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('修复错误语法「未设置」∶修复错误的MD语法，如1。列表、【】（）链接、[[]]()回链等');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('修复意外断行「未设置」∶修复笔记中的意外断行（删除结尾不是句式标点的换行符）');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('搜索当前文本「未设置」：通过搜索面板在当前文档中搜索划选内容。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前整段「未设置」：选择光标所在的当前整段文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('选择当前整句「未设置」：选择光标所在的当前整句（中文）文本。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('获取标注文本「未设置」∶获取标题、高亮、注释及前缀(#标注\批注\反思)等文本内容');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('自动设置标题「未设置」∶将选文中的单行文本（末尾非标点或数字）转为标题');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('指定当前文件名「未设置」：划选文字后指定为当前笔记的文件名。');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('嵌入当前网址页面「未设置」∶在行末插入iframe代码来嵌入所选网址页面');
        toolText.appendChild(document.createElement('br'));
        toolText.appendText('获取相对路径「未设置」：获取当前笔记在库目录内的相对路径。');
        toolText.appendChild(document.createElement('br'));
        div4.appendChild(toolText);


        new obsidian.Setting(containerEl)
            .setName('📣 设置增减空行或空格等功能。')
            /*.addToggle(function (toggle) { return toggle.setValue(_this.settings.toggleLS)
                .onChange(function (value) {
                _this.settings.toggleLS = value;
                _this.plugin.saveSettings();
                new obsidian.Notice("重启Obsidian后方可让设置生效！");
            }); });*/
        var div5 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var lineText = document.createDocumentFragment();
        lineText.appendText('删除当前段落「Ctrl+D」∶去除当前段落文本;若在[[]]内会先删除链接内容;当遇有序列表项时会正常调小后面序号。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('批量插入空行「Ctrl+Shift+L」∶在划选的文本行或全文中间批量插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('批量去除空行「Ctrl+Alt+L」∶批量去除划选文本或全文中的空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('上方插入空行「未设置」∶在当前文本行的上行插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('下方插入空行「未设置」∶在当前文本行的下行插入空白行');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('末尾追加空格「未设置」∶在每行文本的末尾追加两个空格');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('去除末尾空格「未设置」∶批量去除每个文本行末尾的空格字符');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('添加中英间隔「未设置」：在正文的汉字与字母之间批量添加空格，如 china 中国。');
        lineText.appendChild(document.createElement('br'));
        lineText.appendText('去除所有空格「未设置」：去除正文中所有的全、半角空格');
        lineText.appendChild(document.createElement('br'));
        div5.appendChild(lineText);

        var div6 = containerEl.createEl('p', {
            cls: 'recent-files-donation',
        });
        var qqText = document.createDocumentFragment();
        qqText.appendText('🆗 欢迎向蚕子(QQ:312815311) 提出操作需求和建议，我们来共同增强Obsidian软件的编辑功能！');
        div6.appendChild(qqText);
    };
    return SettingsTab;
}(obsidian.PluginSettingTab));

module.exports = MyPlugin;