---
aliases: '迁移 Blue Topaz 示例库的|Obsidian文件夹'
cssclass:
source: https://mp.weixin.qq.com/s/Q6EgFZZvYH5yUodit7ghMA
tags:
  - myOB
  - readme
  - BTE
topics: vault aggregation
created: "2023-01-21 13:38"
updated: "2023-01-21 13:39"
---
# 迁移 Blue Topaz 示例库的Obsidian文件夹
> [!info] Blue Topaz 示例库的数据文件夹指的是：
> 
> - 88-Template 文件夹以及其目录内的笔记，子文件夹 
> 	- EnablepluginList 插件启用列表
> 	- ReactJS ReactJS 脚本文件夹
> 	- script 脚本文件夹
> 	- tp 模板文件夹
> - 60-Canvas 文件夹以及其目录下的文件和子文件夹
> 	- Assets
> 	- Home
> - 对Obsidian最新的白板核心插件还没有完全了解，这里姑且将其视为Obsidian文件夹。目前迁移后不会影响示例库的功能。

## 具体步骤
#### 这里仅对 `88-Template/tp` 目录迁移做出说明，其它目录可以参照这个目录的做法进行迁移
1. 首先，在`Z-000`目录下建立同上述`Obsidan文件夹`一一对应的文件夹，查看已经设置好的`ZJD`目录结构，可以看出 [[Z-100]]对应[[本库名词解释#^091ac9|保存主页笔记的文件夹]]，[[Z-200]]对应[[本库名词解释#^f75bb0|模板文件夹]]，[[Z-300]]对应[[本库名词解释#^b1c3cd|脚本文件夹]]，[[Z-400]]对应[[本库名词解释#^213195|ReactJS 脚本文件夹]]。
2. 再仔细观察 `2XDF NFS`,可以看到有 [[Z-600]]文件夹，应该可以和 `EnablepluginList` 文件夹对应。在`88-Template`和`60-Canvas`目录下还有一些文件，在 `2XDF NFS` 内并没有相应的对应目录，查看可以发现这些目录下的文件都是和示例库首页相关的笔记，再看有 [[Z-100]] 文件夹对应的是[[本库名词解释#^091ac9|保存主页笔记的文件夹]]，所以，可以在这个目录下建立子文件夹来保存将要迁移过来的文件。为保证不和`ZJD`主页冲突，可以将自己的主页也保存在[[Z-100]]目录之内的另外一个子目录内，比如，[[2XDF]]库有关主页的笔记全都保存在[[Z-100]]的子目录[[2XDF]]目录内。
3. 按照2所说，在[[Z-100]]目录下创建用于保存 Blue Topaz 示例库主页和白板主页的两个子文件，分别是 [[Z-120 BTE CanvasHome]] 和 [[Z-120 BTE Homepage]]目录。（注意：这里的两个子目录名并没有按照本库的[[新增目录命名规则]]来命名，也就是说是可以随意命名文件夹名称的）
	_建议在移动下面的文件夹之前，先暂时停用插件[[Folder Note]]和 [[Waypoint]](也可以不关闭，怀疑当这两个插件开着时进行文件夹移动，好像有点儿问题，不确定。本人是在关闭这两个插件后进行移动操作的)_
	![[Pasted image 20230119221704.png]]
4. 将 Blue Topaz 示例库内的 `88-Template` 文件夹内的所有**子目录内的文件**分别移动到 [[Z-000]] 对应的文件夹内
		- 88-Template/EnablepluginList，对应 [[Z-610]]
		- 88-Template/ReactJS 对应 [[Z-400]]
		- 88-Template/script 对应 [[Z-300]]
		- 88-Template/tp 对应 [[Z-200]]
5. 将 Blue Topaz 示例库内的 `88-Template` 文件夹下的所有文件移动到 [[Z-120 BTE Homepage]]内
6. 将 Blue Topaz 示例库内的 `60-Canvas` 文件夹下的所有文件移动到 [[Z-120 BTE CanvasHome]]内

 ##### 移动这些文件夹或文件时，最好在Obsidian内操作，每次移动前确认要移动的文件数量，不知道什么原因，本人在选择文件移动时，经常选择的文件莫名奇妙的增多，就是说不想移动的文件也会被选择进来，而且不知道这些文件是如何被加入进移动文件选项的，所以，一定要在移动命令执行之前，确认要移动的文件数量。如果无法正确选择要移动的文件，可以先退出Obsidian，在次打开（启动）Obsidian，再进行文件选择移动操作。视频中可以看到本人层多次进行这样的操作，为什么会这样的原因不像。希望有知道原因的高手告知。

###### 全部Obsidian文件夹移动完毕之后，现在目录看起来应是这样的：![[Pasted image 20230120105017.png]]

 ### 至此，Obsidian文件夹内的文件全部移动完毕。此时这个ZJD的Obsidian库在不涉及脚本和Quickadd, 模板插件等特殊功能时，基本正常。

*这里暂时不删除 `60-Canvas` 和 `88-Template` 目录，是为了方便下一步在用VSCode替换文本时可以方便的参考原 Blue Topaz 示例库的目录结构*
 
 **上一步：**[[迁移 Blue Topaz 示例库的数据文件夹]]
 **下一步：**[[用 VSCode 改 Blue Topaz 示例库内的路径]]



> [!success]
> - 98 字体文件夹可以在安装字体后删除，也可以直接删除，不安装字体
> - 99 Attachment 文件夹根据 `2XDF` 目录结构，用同样的方法移动到 [[Y-000]]目录之内
> ### 移动过程中注意观看屏幕右上角，会有链接更新提示，说明这样移动文件夹不会造成文件的双链被破坏！
##### [也可以下载观看视频 迁移 Blue Topaz Obsidian 文件夹（视频）时长：15分35秒（不会剪辑，见谅）百度网盘下载 链接：](https://pan.baidu.com/s/1cKfHD-bzYh3Ww31RfsV9xw?pwd=2xdf )
提取码：2xdf 
--来自百度网盘超级会员V4的分享
- 0:00:00 - 0:03:00 移动数据文件夹后示例库功能回顾
- 0:03:01 - 0:05:46 移动88-Template/tp文件夹的[[模板文件]]
- 0:05:47 - 0:10:51 移动88-Template/script文件夹的脚本文件
- 0:10:52 - 0:13:24 移动88-Template/ReactJS文件夹的脚本文件
- 0:13:25 - 结束 移动88-Template/EnablepluginList文件夹的文件 

---
**上一步：**[[迁移 Blue Topaz 示例库的数据文件夹]]
**下一步：**[[用 VSCode 改 Blue Topaz 示例库内的路径]]

> [!help]- 更多有关示例库迁移相关内容，可阅读……
> 还需要再看看？
>
> ```dataview
> LIST
> FLATTEN topics as flattenedTopics
> WHERE contains(this.topics, flattenedTopics)
> AND file.name != this.file.name
> ```
>
