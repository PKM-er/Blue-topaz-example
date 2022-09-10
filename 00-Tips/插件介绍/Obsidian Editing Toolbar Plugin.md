# Obsidian Editing Toolbar Plugin
😀💔⚫
![[cmenu-demo.gif]]
感谢 [cmenu](https://github.com/chetachiezikeuzor/cMenu-Plugin)插件的开发，给我了很多灵感，但这个插件已经一年多没有维护了，于是我重新魔改了它，并增加了很多有趣的功能，包括置顶工具栏,光标跟随等，于是Cmenu toolbar 就诞生了。
**Obsidian Editing Toolbar**是一个提供类似于MS-Word的工具栏的插件，并增加了一个最小的和用户友好的文本编辑器模式，以获得更顺畅的写作/编辑体验。不需要记住复杂的markdown命令，类似于富文本编辑器的所见即所得。
这个插件是专门为那些希望有一个简单的文本编辑器来帮助标记他们的笔记设计的。它解决了必须记住许多热键或命令来实现所需要的功能的问题。一个简单的工具条可以改善你在Obsidian中的写作体验。

> 建议配合[增强编辑插件](https://github.com/obsidian-canzi/Enhanced-editing)，可以添加更多的实用的编辑指令。

## 如何安装
1.  brat安装。插件目前还没有上架官方商店可以通过 [BRAT Plugin](https://obsidian.md/plugins?id=obsidian42-brat)去安装。
`cumany/Cmenu-Toolbar`
2. 手动安装 参考教程
   [Plugins mini FAQ ](https://forum.obsidian.md/t/plugins-mini-faq/7737) 
   [如何安装obsdiain插件](https://publish.obsidian.md/chinesehelp/01+2021%E6%96%B0%E6%95%99%E7%A8%8B/%E5%A6%82%E4%BD%95%E5%AE%89%E8%A3%85obsdiain%E6%8F%92%E4%BB%B6)

## 视频介绍
[谁说Obsidian不如语雀，这个插件让你使用ob不用再记那么多指令了，ob工具栏你值得拥有](https://www.bilibili.com/video/BV1mY4y1T7g2/)

## 功能特性
功能在延续之前cmenu功能的基础上增加了下面额外的功能。
1. 增加新的工具栏样式 tiny
	![|400](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071131715.png)
2. 增加工具栏位置选项，top，following
   ![|400](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071133753.png)
   ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071751006.gif)

3. 增加一些内置命令
	1. change-font-color
	2. change-background-color
	3. indent-list
	4. undent-list
	5. editor-undo
	6. editor-redo
	7. fullscreen-focus
	8. workplace-fullscreen-focus
	9. head 1-6 级标题设置
  ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071707695.png)
4. 支持自定义命令图标
    ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071717111.gif)
5. 支持修改命令名称
    ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071720159.gif)
6. 支持添加子菜单
    ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071722207.gif)
7. 支持菜单拖动排序
8. 增加格式刷功能 内置字体颜色和背景颜色两种格式刷（鼠标中键或者右键可取消格式刷状态）
   ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main//pic/202209071731151.gif)
9. 工具栏图标宽度自适应收缩

![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main/pic/202209072157728.gif)




跟其他插件协作
1. 配合[emjoi toolbar ](obsidian://show-plugin?id=obsidian-emoji-toolbar)快捷插入表情
   ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main/pic/202209092001600.gif)


2. 配合 [Obsidian-Table-Generator](https://github.com/Quorafind/Obsidian-Table-Generator/)   和 [ob-table-enhance](https://github.com/Stardusten/ob-table-enhancer)快捷 插入表格并编辑
   ![](https://ghproxy.com/https://raw.githubusercontent.com/cumany/cumany/main/pic/202209092008571.gif)


增加位置固定和跟随选项。
- 增加了 cmenu 风格 tiny样式，更紧凑。
- 修复了 插件跟随位置判断
- 修复了悬浮效果在边界触发溢出的问题
- 修复了按钮超过一行，背景框不对应问题。
- 修复 黑暗模式图标颜色不一致
- 修复 工具栏越界问题

本示例库已经集成。github.com)](https://github.com/cumany/cMenu-Plugin/releases/tag/1.1.30)

介绍文章：
[Cmenu插件魔改版1.1.23 Obsidian上的工具栏 - 飞书文档 (feishu.cn)](https://kknwfe6755.feishu.cn/docs/doccnQpRTqGYqMT3GAKka5IRnMf)