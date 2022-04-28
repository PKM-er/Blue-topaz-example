## ⏳更新日志
### 更新 📅2022-04-28
- 主页天气数据优化 可以自动获取地址
- 日记模板样式微调
### 更新 📅2022-04-27
- ✔️新增内容
	- 教程
		- 增加移植主页设计视频讲解[OB主页快速移植](https://www.bilibili.com/video/BV18S4y1Y7Wb?spm_id_from=333.999.0.0)
	- 插件类
		- markdown-prettifier 
		- nldates-obsidian 
		- chat view 
		- folder note 
		- obsidian-quiet-outline 
		- obsidian-reveal-active-file 
		- obsidian-tasks-plugin
		- plugin-changelogs
		- scambier.obsidian-omnisearch
		- settings-search
		- obsidian-enhancing-mindmap
	- css类
		- 【图标】iconfont.css 提供文件夹图标
		- 【日记】timeline.css 日记文档提供时间线样式
		- 【日记】periodic日历.css 日记日历导航样式
		- 【天气】weather.css
	- 功能
		- 增加通过dataviewjs 生成可编辑的表格 示例[[可以编辑的dv表格]]
		- 增加任务卡片 示例，汇集一些常用写法[[任务卡片]]
		- 可单独定制笔记背景示例[[单独定制笔记背景]]
		- 多彩高亮  涂黑挖空等语法 示例[[多彩高亮（三种语法）]] [[涂黑和挖空效果（三种语法）]]
		- 增加通过chatview插件生成对话笔记示例 [[对话形式笔记#^115719]]
		- 通过dataviewjs 可以正确展示本地图片 [[电影观看清单-状态控制（dvjs）#^79cf0d]]
		- 增加callout banner 头图功能演示 [[电影看板]]
		- 增加侧边栏 悬浮大纲  快捷搜索按钮
		- 增加MOC自动生成，ctrl+点击文件夹 即可自动生成MOC [[如何快速生成MOC(文件夹的文件目录列表)？]]
		- 增加首页动态天气效果，并增加天气模板[[天气模板dv查询]]
- ❌移除 s
	- cm-chs-path 插件 😜理由：中文分词一般用不到
	- cm-editor-syntax-highlight 插件 😜理由：ob自带语法高亮
	- obsidian-frontmatter-tag-suggest  😜理由：various-complements已有类似功能
	- obsidian-icon-folder插件 😜理由：文件夹图标可通过css设置，此插件更新后下载的本地图标过于臃肿
	- 移除home 主页通过wolai api调用图标 😜理由：可通过svg动态生成。
- 🛠️修复
	- templater-obsidian 插件新增inputdate类型
	- tips 文档 新增多彩高亮 涂黑挖空介绍
	- 每日一句接口优化，增加获取成功概率
	- 豆瓣获取电影模板 优化，增加更多字段
	- dataviewjs 可视化检索文件 日期无法正确选中[[通过下拉框检索文件示例]]
	- home主页日历图标更换为动态svg图标
- 🔔模板文件夹变动
	- 内容修改
		- fetchhomepage.js 
		- moviefromdouban.js 
		- getweather.js
		- tp-movie-douban.md
		- tp-日记模板-带进度.md
		- tp_foldermoc.md
		- 常用工具.md
		- button.md
	- 新增
		- weatherView.js

### 更新 2022-04-10
1. 示例库配置字体 [LXGW WenKai / 霞鹜文楷](https://github.com/lxgw/LxgwWenKai/releases/tag/v1.233.5)
2. 代码块采用等宽字体 [ JetBrainsMono](https://github.com/JetBrains/JetBrainsMono/releases/tag/v2.242)
### 更新 2022-04-09
1. 重构分栏示例说明，增加更多的分栏效果
2. 增加timeline callout示例
3. 精简示例库体积
视频:[告别单调的Obsidian，Ob的版面也可以丰富起来！ (bilibili.com)](https://www.bilibili.com/video/BV1G5411U7m8/)
### 更新 2022-04-04
1. 更新cmenu插件 适应最新版增强编辑4.7以上版本
2. 增加callout使用说明和示例[[ob提示框(Callout)样式展示]] 
3. 豆瓣图书模板更新，使用callout模板[[tp-book-callout]]
4. 豆瓣脚本支持更多属性比如出版年月，作者简介，原文摘要等[[《从零开始的女性主义》|豆瓣图书笔记示例]]
5. 侧边栏增加音乐播放器[[如何在OB里添加多彩时钟和音乐播放器]]
6. 魔方配色增加 黑金配色设置[[魔方配色设置说明#2 黑金风格配色方案（适合暗色主题）]]
7. 主题tips 增加`![]()`格式的图片位置设置示例[[🥑Blue Topaz Themes Tips#格式的图片]]
8. 增加文件夹[[moc]]
### 更新 2022-03-21
- 豆瓣脚本优化，支持输入isbn添加
- 增加悬浮表格编辑插件
- 主页伪看板字体大小统一
  本次更新影响文件 
|  文件名                     |  操作      |
|:-------------------------|:---------|
|  【自定义】myhome 样式.css      |  新增内容    |
| bookfromdouban.js        | 新增内容     |
| MD表格悬浮编辑测试.md            | 新添文件     |

### 更新 2022-03-15
- 增加侧边栏一键启动悬浮memos
- 增加运行示例库最低配置说明[[README#常见问题]]
- 增加一键启动全局memos（库中库）
### 更新  2022-03-10
- 增加嵌套库玩法 具体教程参考[[Obsidian 库中库玩法]]
- 修复侧边栏按钮如果不打开md文件就无法点击的问题
- 优化侧边栏memos样式

### 更新  2022-03-08
- 更新了豆瓣图书脚本，解决有的图书无法获取的问题
- 修复首页下拉到底部出现大块空白的问题
- 增加linkcard插件，嵌入网址自动显示， 并美化样式
- cmenu插件匹配最新的zh增强编辑功能
- 修复教程中的个别无效链接。
### 更新  2022-03-01
- 使用 faststart脚本 大幅提高ob [[如何提高Obsidian的启动速度？|启动速度]]
- 修复float-toc 插件目录太长无法滚动的问题
- 添加Dynamic Highlights插件 实现时间和dataview字段突出显示

### 更新  2022-02-16
增加从豆瓣获取电影卡片
增加对dataview卡片直接编辑元数据 
增加插件Hoteys for specific files 直接在ob里打开嵌入网页
优化日记模板,更具有通用性。
修复了cmenu插件对zh编辑增强0.4.x的支持
