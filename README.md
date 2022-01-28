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

另外推荐鸟姐的Homepage 也是很棒的风格
[Rainbell129/Obsidian-Homepage: A dashboard for your obsidian vault. (github.com)](https://github.com/Rainbell129/Obsidian-Homepage)

## 效果图
主页视图
![](https://gitee.com/cuman/imgbed/raw/master/images/202112312335857.jpg)
笔记模板
![](https://gitee.com/cuman/imgbed/raw/master/images/202201262104928.png)
卡片视图
![](https://gitee.com/cuman/imgbed/raw/master/images/202201282110608.png)
读书笔记
![](https://gitee.com/cuman/imgbed/raw/master/images/202201282111244.png)
## 内置的插件
斜体插件为可选插件，基本是辅助类，不影响功能性使用。
除去辅助类插件，剩余基本十几个插件就满足Ob个性化使用的同时还能体验不同的功能。

| 插件名称                                | 解释                                                            |
| --------------------------------------- | --------------------------------------------------------------- |
| *ZH增强编辑*                            | (可选)提供大量格式排版相关快捷操作                              |
| workspaces-plus                         | 工作区切换                                                      |
| templater-obsidian                      | Ob模板插件                                                      |
| *tag-wrangler*                          | (可选)标签修改                                                  |
| *Advanced Tables*                       | (可选)表格辅助                                                  |
| *remember-cursor-position*              | (可选)记住光标位置                                              |
| recent-files-obsidian                   | (可选)最近文件列表                                              |
| quickadd                                | 快速添加命令和动作                                              |
| *plugin-changelogs*                     | (可选)插件历史记录                                              |
| *obsidian-theme-design-utilities*       | (可选)主题调试插件                                              |
| obsidian-style-settings                 | 主题设置插件，必备                                              |
| *obsidian-shellcommands*                | (可选)系统命令执行插件                                          |
| obsidian-outliner                       | 类似幕布大纲操作插件                                            |
| obsidian-kanban                         | 看板                                                            |
| *obsidian-frontmatter-tag-suggest*      | (可选)yaml输入标签弹出提示                                      |
| *obsidian-collapse-all-plugin*          | (可选)一键折叠文件夹                                            |
| ~~obsidian-codemirror-options~~         | v0.13.14之前的所见即所得插件， v0.13.14之后的ob版本直接关闭即可 |
| obsidian-checklist-plugin               | 任务列表插件                                                    |
| obsidian-banners                        | 主页显示头图                                                    |
| obsidian-admonition                     | 文本框插件                                                      |
| *hotkey-helper*                         | (可选)热键提示插件                                              |
| ~~homepage~~                            | 打开ob显示主页插件,非必须已禁用                                 |
| dataview                                | 数据查询插件                                                    |
| *cMenu 魔改版by cuman*                  | (可选)快捷工具栏，需要依赖zh增强编辑插件                        |
| ~~cm-editor-syntax-highlight-obsidian~~ | 语法高亮插件，不兼容v0.13.14之后的ob版本直接关闭即可            |
| calendar                                | 日历插件                                                        |
| buttons                                 | 按钮插件                                                        |
| *Obsidian Icon Folder*                  | (可选)文件自定义图标插件                                        |
| obsidian-view-mode-by-frontmatter       | 通过yaml设置文档默认打开是预览还是编辑模式                      |
| *obsidian-floating-toc-plugin*          | (可选)编辑模式浮动大纲                                          |
| obsidian-memos by bon                   | 流水账的方式记录日记，依赖日记插件。                            |
| *bartender*                             | (可选)隐藏边栏图标和状态栏图标                                  |
| *sortable*                              | (可选)表格列排序插件                                            |
| *markdown Pretiffier*                   | (可选)md格式辅助插件可以自动生成更新日期                        |
| *Search on Internet*                    | (可选)ob中快捷进行网络搜索                                      | 


## 主题内置的cssclass样式表

```dataview
table cssclass , usage as "作用"
from "77-Example"
where  usage != null

```

|code-wrap【代码块自动换行】|code-wrap|代码块自动换行|
|----|----|----|
|Image-grid【图片自适应】|img-grid|图片自适应分布|
|inline-list【行内列表】|inline-list|图片和列表混排|
|伪看板|kanban|伪看板的样式，无序列表四分栏|
|全宽显示|fullwidth|缩减栏宽开启下，控制页面全宽显示|
|各类列表和彩虹大纲线|noscroll|隐藏当前页面滚动条|
|图书阅读清单|cards|对dataview表格渲染成卡片视图|
|四象限表格|matrix|四象限表格样式|
|电影观看清单|cards|对dataview表格渲染成卡片视图|
|预览隐藏frontmatter|noyaml|预览状态不显示frontmatter区域|


## 主题内置的ad样式表
ad样式使用方法参考
[[分栏效果示例#前置条件]]
[[分栏效果示例#AD样式效果]]

| Admonition类型 | 解释                | 使用      |
| -------------- | ------------------- | --------- |
| blank          | 全透明框            | ad-blank  |
| def            | definition 定义     | ad-def    |
| thm            | theorem 定理        | ad-thm    |
| lem            | lemma 引理          | ad-cor    |
| cor            | corollary 推论      | ad-lem    |
| pro            | proposition 命题    | ad-pro    |
| hibox          | 自动隐藏框          | ad-hibox  |
| col2           | 内容分左右两栏      | ad-col2   |
| kanban         | 伪看板 无序列表并列 | ad-kanban |
| flex           | 自适应元素分栏      | ad-flex   |

## Javascript作用
> 88-Template\script

| 名称               | 功能                                     | 调用js的功能                    |
| ------------------ | ---------------------------------------- | ------------------------------- |
| bookfromdouban.js  | 根据url从豆瓣获取图书数据                | Quickadd-宏-豆瓣读书            |
| changeSticky.js    | 快捷修改home.md中的四个便签内容          | Quickadd-宏-添加首页便签        |
| colorclock.js      | 彩色时钟js                               | 已通过react组件实现，此js已弃用 |
| fetchhomepage.js   | 获取主页中的联网数据(OB启动后加载)       | quickadd-宏-Home工作区          |
| movies.js          | 从IMDB获取电影数据                       | quickadd-宏-电影卡片            |
| notice.js          | 生成自定义边栏提示                       | quickadd-宏-生成notice          |
| refreshhomepage.js | 重载主页数据，重新获取联网数据           | quickadd-宏-重新获取主页数据    |
| getrandomImage.js  | 随机获取99-Attachment\banner文件夹的图片 | tp-日记模板获取banner     |
| getweather.js      | 获取天气数据                             | tp-日记模板获取天气       | 


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
	开启核心插件日记，并指定日记文件夹位置。
7. 主页加载部分数据没有显示全？
	如果时钟不动或者主页没有显示全。手动点一下刷新主页即可。

