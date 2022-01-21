---
obsidianUIMode: preview
---
## 引言

This Vault  contains the basic functions of Obsidian and has built-in common Obsidian plugins.
Notice：You need to open this vault with [Obsidian](https://obsidian.md/) 

---

本[Examples库](https://github.com/cumany/Blue-topaz-examples)由Cuman建立，Tips教程由BT主题作者3F撰写。
本库是一个包含Obsidian基本功能的入门库，并内置了Obsidian的常用插件。
需要用[Obsidian](https://obsidian.md/)软件打开本库即可。
特别感谢@Johnny @Lillianwho  @lavi @成雙酱 @锋华 提供的教程和创作思路。
如果有问题或者建议 请加入Topaz社区[Topaz QQ群](https://jq.qq.com/?_wv=1027&k=TWGhXs40)  [Obsidian频道](https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&inviteCode=zHpby&from=246610&biz=ka)

本文档后续更新 请关注
 -  [Examples库](https://github.com/cumany/Blue-topaz-examples) 
 -  [Blue topaz 主题用法示例 - 飞书文档 (feishu.cn)](https://kknwfe6755.feishu.cn/docs/doccn67RYLVN4IQZiJTwviIdnog)


## 效果图
![](https://gitee.com/cuman/imgbed/raw/master/images/202112312335857.jpg)

## 内置的插件
| 插件名称                                | 解释                                                            |
| --------------------------------------- | --------------------------------------------------------------- |
| ZH增强编辑                              | 提供大量格式排版相关快捷操作                                    |
| workspaces-plus                         | 工作区切换                                                      |
| templater-obsidian                      | Ob模板插件                                                      |
| tag-wrangler                            | 标签修改                                                        |
| table-editor-obsidian                   | 表格辅助                                                        |
| remember-cursor-position                | 记住光标位置                                                    |
| recent-files-obsidian                   | 最近文件列表                                                    |
| quickadd                                | 快速添加命令和动作                                              |
| plugin-changelogs                       | 插件历史记录                                                    |
| obsidian-theme-design-utilities         | 主题调试插件，可关闭                                            |
| obsidian-style-settings                 | 主题设置插件，必备                                              |
| obsidian-shellcommands                  | 系统命令执行插件                                                |
| obsidian-outliner                       | 类似幕布操作插件                                                |
| obsidian-kanban                         | 看板                                                            |
| obsidian-frontmatter-tag-suggest        | yaml输入标签弹出提示                                            |
| obsidian-collapse-all-plugin            | 一键折叠文件夹                                                  |
| ~~obsidian-codemirror-options~~         | v0.13.14之前的所见即所得插件， v0.13.14之后的ob版本直接关闭即可 |
| obsidian-checklist-plugin               | 任务列表插件                                                    |
| obsidian-banners                        | 主页显示头图                                                    |
| obsidian-admonition                     | 文本框插件                                                      |
| hotkey-helper                           | 热键提示插件                                                    |
| ~~homepage~~                            | 打开ob显示主页插件,非必须已禁用                                 |
| dataview                                | 数据查询插件                                                    |
| cMenu 魔改版by cuman                    | 快捷工具栏，需要依赖zh增强编辑插件                              |
| ~~cm-editor-syntax-highlight-obsidian~~ | 语法高亮插件，不兼容v0.13.14之后的ob版本直接关闭即可            |
| calendar                                | 日历插件                                                        |
| buttons                                 | 按钮插件                                                        |
| Obsidian Icon Folder                    | 文件自定义图标插件                                              |
| obsidian-view-mode-by-frontmatter       | 通过yaml设置文档默认打开是预览还是编辑模式                      |
| obsidian-floating-toc-plugin            | 编辑模式浮动大纲                                                |
| obsidian-memos by bon                   | 流水账的方式记录日记，依赖日记插件。                            |

## 常见问题
1. 如何获取指定地区的天气？
	主页天气代码默认根据ip地址自动获取，如果手动指定`https://i.tianqi.com/?c=code&id=34&bdc=%23&icon=4&site=14&py=chongqing` chongqing改为你想要的城市拼音即可。
2. 如何更换字体？
	打开 style settings设置，2.2.1字体设置，主字体里填写**字体名称**即可。注意如果字体名称有空格需要用单引号括起来。
	字体需要安装到系统里才会成功调用，比如win系统安装后显示的**字体名称**才是真正的字体名称。
	![[Pasted image 20220119151051.png]]
3. 如何更换Ob背景图？
	打开 style settings设置，1.2.1工作页面背景，开启背景，并在custom theme light(亮色主题使用)或者custom theme dark(暗色主题使用)里设置壁纸路径.壁纸路径需要使用类似格式url("app://local/XXXXX)设置本地图片。
	比如windows图片路径置
	url(app://local/D:/Documents/XXXX.jpg")
	mac系统图片路径设置 url("app://local/Users/XXXX .jpg")
4. 工作区页面背景跟笔记背景的区别?
	工作区页面背景是指整个OB界面背景，笔记背景仅仅是当前md文档的背景。两者不冲突可以同时设置，当然背景也就叠加一起了。
5. 主页的歌曲和每日一言如何更新？
	点击主页的topaz图片 或者侧边栏的重载主页 都可以重新获取最新的歌曲和一言。重新获取后如何没有显示出来，点击刷新主页即可。
	![[Pasted image 20220119152758.png]]
6. 备忘录Memos 无法启动打开？
	开启核心插件日记，并制定日记文件夹位置。
7. 主页加载部分数据没有显示全？
	如果时钟不动或者主页没有显示全。手动点一下刷新主页即可。