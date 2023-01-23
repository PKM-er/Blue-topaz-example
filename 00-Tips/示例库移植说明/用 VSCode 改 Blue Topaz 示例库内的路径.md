---
cssclass:
source: https://mp.weixin.qq.com/s/Q6EgFZZvYH5yUodit7ghMA
tags:
  - myOB
  - readme
  - BTE
topics: vault aggregation
created: "2023-01-21 13:38"
updated: "2023-01-21 13:49"
---
# 用 VSCode 改 Blue Topaz 示例库内的路径
* 示例库为什么能够被迁移？ ，本质上就是用自己的文件夹目录替换掉示例库的文件夹目录，而VSCode， 就是替换文件内容的得心应手的工具。接下来就用这个工具对示例库的路径进行替换。*

## 具体步骤
*需要对原示例库中各个笔记文件、脚本文件、插件设置中的路径进行替换 。也就是要替换路径的，是在上两个步骤中移动的 *

#### 上两个步骤中，共移动了
- **88-Template 目录**
> [!blank]
		> - 88-Template 目录下的文件到 Z-120 BTE Homepage 目录内
			> - 88-Template\\EnablepluginList 目录下的文件到 Z-610 目录内
			> - 88-Template\\tp 目录下的文件到 Z-200 目录内
			> - 88-Template\\script 目录下的文件到 Z-300 目录内
			> - 88-Template\\ReactJS 目录下的文件到 Z-400 目录内
- **60-Canvas 目录**下的文件（夹） Z-120 BTE CanvasHome 目录内，子目录保持了不变
- **99-Attachment 目录**，整个移动到了 Y-000 目录
- **其它数据文件夹**（50-Iinbox暂时按照数据文件夹处理），全部整个移动到 X-110_BTE 目录内，成为了它的子目录，原目录名称保持必变
> [!blank]
			> - 00-Tips目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/00-Tips`
			> - 10-Help目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/10-Help`
			> - 20-Diary目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/20-Diary`
			> - 30-Reading目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/30-Reading` 
			> - 40-Booknote目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/40-Booknote`
			> - 50-Inbox目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/50-Inbox` 
			> - 77-Example目录，移动到了 X-110_BTE 目录下，成为了 `X-000/X-100/X-110_BTE/77-Example` 



### 打开VScode 用VScode替换Rainbell示例库的文件路径|（参考Rainbell示例库移植的说明笔记了解替换过程中需要注意的问题和简单使用方法）  
> [!info]
> - 不熟悉VSCode替换，可以先查看 用VScode替换Rainbell示例库的文件路径|这里的的笔记做一简单的了解 。
> - 本笔记不再做屏幕截图说明，具体可以参考视频。
> - 这里只做示例库的Obsidian文件夹，即 `88-Template` 文件夹的路径文本替换，替换后原始库的功能基本上就可以正常使用了，个别插件的路径可能还需要进一步的调整，放在 迁移后一些特殊问题及解决方法 做说明。
> - 如果想在迁移后`ZJD`的库中查看原示例库内的示例笔记，还需要对这些文件夹也进行和这里描述的替换一样进行替换。

#### 1. 替换顺序及原则
- 替换时最先替换最深层目录的路径，比如，在`88-Template`目录下还有 `tp`, `script`等几个目录，替换时就要从子目录开始替换。
- 由于在迁移目录时，只迁移了部分子目录下的文件，所以只需对迁移的这部分文件的路径进行替换即可。比如，`tp` 目录下的模板文件都被迁移到了 Z-200 ，那么，`tp` 目录路径就需要替换成 Z-200 ，而在`script`目录下还有一些子目录，是整个目录迁移到 Z-300 目录下的，就不需要在对这些字母进行路径替换，只替换`script`为 Z-300 即可。
- 替换时如果发现替换后的目录已经有`ZJD`的库的路径，就不需要进行替换，且要在替换之前将其排除在被替换的文件列表之外， 用VScode替换Rainbell示例库的文件路径#^8f5151|详查看此文内（1-8）的详细解释 。也可以不进行这类替换，直接打开来的示例库进行查看。*替换这里的路径的好处是可以检验迁移是否成功* 

#### 2. 需要的替换内容
! Blue Topaz示例库迁移到2XDF库时需要替换的路径  
##### [也可以下载观看视频 用VSCode 替换 Blue Topaz 示例库路径（视频）时长：35分08秒（不会剪辑，见谅）百度网盘下载链接：](https://pan.baidu.com/s/1mKyd88ZT1XhvY5SKqvrgYQ?pwd=2xdf) 
提取码：2xdf 
--来自百度网盘超级会员V4的分享
0:00:00 - 0:01:58 文件夹移动后首页的按钮功能消失演示
0:01:59 - 0:02:36 开启VSCode，准备开始替换路径
0:02:37 - 0:03:50 替换 `88-Template/tp/tp`
0:03:51 - 0:05:00 替换 `88-Template/tp/` 和 `88-Template/tp`
0:05:01 - 0:05:55 检查 `88-Template/tp` 相关路径是否全部替换
0:05:56 - 0:07:30 替换 `88-Template/script/` 和 `88-Template/script` 
0:07:31 - 0:09:08 替换并检查 `88-Template/ReactJS/` 和 `88-Template/ReactJS`
0:09:09 - 0:10:14 替换 `88-Template/EnablepluginList`
0:10:15 - 0:13:05 替换 `88-Template/`
0:13:06 - 0:23:50 替换 `88-Template`, `88-Template\`及其子目录 #nf #tbC 有观看视频的朋友可以帮助再细分这部分视频时间段
0:23:51 - 0:25:35 替换 `60-Canvas/`
0:25:36 - 0:26:45 替换 `60-Canvas`
0:26:46 - 0:29:30 修复迁移后`项目跟踪`笔记不正常
0:29:30 - 0:31:25 替换后更改插件 template 中相关路径设置，视频里忘记更改下图中的设置了，按照图中说明更改即可! Pasted image 20230120144453.png  
0:31:26 - 结束 检验迁移效果，更正上述忘记更改的内容 ^bc3959

---
**上一步：** 迁移 Blue Topaz 示例库的数据文件夹  
**下一步：**

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
