---
updated: 2022-10-17 09:58:32
aliases: ob提示框(callout)样式展示
created: 2022-08-13 12:45:38
---

> Obaidian 0.14.2 版本后增加了Callout功能，这个功能就是之前 admonition(简称ad插件) 插件收编的，目前语法跟Microsoft Docs 一致。之前用ad插件设置的提示框可以一键转换成最新的语法样式。

## 调用办法
- `ctrl+p` 输入 callout 即可自动输入模板
- 如果先有内容 后加callout 就先选择内容 然后 `ctrl+p`  callout  就搞定了
## 视频教程
[告别单调的Obsidian，Ob的版面也可以丰富起来！ (bilibili.com)](https://www.bilibili.com/video/BV1G5411U7m8/)

## 目前支持的样式列表
## 官方示例
### 提示框类型
> [!note]
> Here's a callout block.
> It supports **markdown** and [[Internal link|wikilinks]].

> [!abstract]

>[!todo]

> [!info]

> [!tip]

> [!success]

> [!question]

> [!warning]

> [!failure]

> [!danger]

> [!bug]

> [!example]

> [!quote]


除了info 类型还支持以下类型
- note
- abstract, summary, tldr
- info, todo
- tip, hint, important
- success, check, done
- question, help, faq
- warning, caution, attention
- failure, fail, missing
- danger, error
- bug
- example
- quote, cite
### 提示框的各种用法

1. 可以没有内容直接显示标题
> [!TIP] Callouts can have custom titles, which also supports **markdown**!

1. 折叠提示框
> [!FAQ]- Are callouts foldable?
> Yes! In a foldable callout, the contents are hidden until it is expanded.

1. 自定义提示框
可以通过css设置my-callout-type 的样式

```css
.callout[data-callout="my-callout-type"] {
    --callout-color: 0, 0, 0;
    --callout-icon: icon-id;
    --callout-icon: '<svg>...custom svg...</svg>';
}
```

## 主题自定义示例
#### 目前支持的callout类型
通过添加callout类型，实现各类样式控制。下面以Blue Topaz主题内置的callout样式举例说明，目前支持的callout样式有：

| Callout类型           | 解释                            | 使用                                    |
| --------------------- | ------------------------------- | --------------------------------------- |
| cloze                  | 字体模糊效果                    | >[!cloze]                               |
| kanban                | 伪看板 无序列表并列             | >[!kanban]                              |
| hibox                 | 自动隐藏框                      | >[!hibox]                               |
| bookinfo              | 图书卡片(图片表格左右分布)      | >[!bookinfo]                            |
| xx%                   | callout宽度xx代表10-100的数值   | >[!30%]                                 |
| right\|left\|center   | callout布局位置                 | >[!right] <br>>[!left]<br>>[!center]    |
| indent                | 全文自动缩进2字符               | >[!indent]                              |
| blank                 | callout 全透明块                | >[!blank]                               |
| timeline                      |            时间线样式                     |    [[timeline callout效果]]                                     |

**注意 以上类型都可以互相组合使用，具体看下面例子**
Ob 0.14.5 以后支持 metadata写法 也就是用管道分割
比如`> [!note|right]` 把一些属性信息用竖线分割，这样就不会影响callout类型。管道后的参数就是metadata。
#### 目前支持metadata的属性

| 属性名称            | 解释                          |
| ------------------- | ----------------------------- |
| xx%                 | callout宽度xx代表10-100的数值 |
| right\|left\|center | callout布局位置               |
| indent              | 全文自动缩进2字符             |
| nowrap              | 元素不换行(包括图片横排显示)  |
| noicon              | 隐藏callout图标               |
| banner              | 可以用图片作为callout标题     |
| notitle             | 隐藏callout标题栏             |
| noborder            | 隐藏callout边框               |
| grid                | 元素网格化布局                |                           |

### 模糊字体
>[!cloze]
>隐藏文本

### 伪看板 kanban
> [!kanban]+ Callout 看板测试
>- [ ] callout 看板测试
>	- [ ] 3333
>	- [ ] 3333
>		- [ ] 333
>		- [ ] 333
>- [ ] 第二个菜单22
>	- [ ] 子列表
>- [ ] 第三个菜单 最好在源码模式下编辑
>	- [ ] 测试测333
>	- [ ] 测试测444
>- [ ] 22222
>- [ ] 2234444
>- 555555
>- 777777

### 自动隐藏框 hibox
>[!hibox]
>这是可以自动隐藏的文字部分
>- 122333
>- [ ] 3333
>	- [x] 33333
>- [ ] 4444

### 信息卡 infobox

> [!Infobox|notitle right 45%]+ ## 关羽
>![[Pasted image 20220331161219.png|circle]]
> 

| 本名     | 关羽                          |
|:-------- |:--------------------------------------------- |
| 别名     | 关云长、关公、汉寿亭侯、武圣                 |
| 昵称     | 二爷                                                                 |
| 国籍     | 中国                                       |
| 出生     | 约160年                                |
| 逝世     | 220年（约60岁）               |
| 职业     | 将领                              |
| 活跃年代 | 东汉末年                       |
| 相关人士 | 大哥：刘备<div>三弟：张飞<br></div><div>子女：关平、关银屏<br></div> |

> [!tip|indent] 三国人物--关羽
> 关羽早年因杀人逃离家乡，奔向涿郡，在此处结识刘备与张飞，三人相谈甚欢，恩若兄弟。
> 建安五年（200年）刘备投奔袁绍，关羽被曹操捉拿后担任偏将军，在万军之中斩杀颜良，立下了大功。不过之后关羽离开曹操阵营投奔刘备，曹操并未挽留，而是认为“彼各为其主”，放他离开了。
> 之后关羽跟随刘备投奔刘表，刘表去世后刘备在南逃过程中派遣关羽带领数百艘船前往江陵，并在被曹操追杀后成功与之汇合，一同前往夏口。在刘备平定益州后关羽总督荆州诸事，并在之后进行了刮骨疗毒的壮举。
> 建安二十四年（219年）刘备自封为汉中王，赐关羽前将军之职，之后在樊城之战中一举斩落庞德，威震华夏。但之后由于孙权反水偷袭以及部下倒戈东吴，关羽军队溃散，败走麦城，被孙权部将抓获，同年十二月在临沮被斩杀。
> 之后孙权将关羽的头颅送给曹操，曹操以诸侯之礼下葬于洛阳，孙权则将身躯下葬于当阳。后被蜀后主刘禅追谥为壮缪侯。
> 关羽去世后，民间尊为“关公”，历代朝廷多有褒封。清朝雍正时期，尊为“武圣”，与“文圣”孔子地位等同。在小说《三国演义》中，名列“五虎上将”之首，使用青龙偃月刀。毛宗岗称其为《演义》三绝中的“义绝”。在宗教文化方面，关羽被道教尊为关圣帝君、文衡帝君，被佛教尊为护法伽蓝菩萨（伽蓝神） 、盖天古佛，被道教尊为协天大帝、翔汉天神等。

### 图书信息卡片 bookinfo

> [!bookinfo]+ 《从零开始的女性主义》
> ![bookcover|200](https://img2.doubanio.com/view/subject/l/public/s33984963.jpg)
>

| 属性     | 内容                                           |
|:-------|:---------------------------------------------|
|  ISBN  |  9787559652317                              |
|  作者    |   '[日]上野千鹤子/[日]田房永子'                           |
|  出版社   |  北京联合出版公司                           |
|  来源    |  [从零开始的女性主义](https://book.douban.com/subject/35523099/)  |
|  评分    |   8.7                             |
|  页码    |  192                         |

### 自定义宽度 位置 
> 目前支持的位置属性有 right，center，left
支持的宽度属性 10%-100% 比如10% 15% 20% 等
它们可以组合使用，支持下面两种写法

```html
 > [!note|30%]
 > [!note 30%]
```

> [!note|right 35% indent ]+ TextBox
> With the development of Chinese economy, the world is watching us. More and more foreigners have sensed the great potential market and come to China to seek for cooperation. Chinese film market had been ignored before, but now more Hollywood directors show their willingness to work with Chinese actors, so as to catch more Chinese audiences and increase the box office.   

> [!tips right 35% ]+ Title
>  Indeed, Chinese box office is increasing every year, even surpasses the foreign’s, which makes the foreign directors pay so much attention to Chinese audiences. It also shows that China has influnced the world and it plays more and more important role in the world economy. There is no doubt that more cooperations will happen during foreign enterprises and Chinese business. 

With the development of Chinese economy, the world is watching us. More and more foreigners have sensed the great potential market and come to China to seek for cooperation. Chinese film market had been ignored before, but now more Hollywood directors show their willingness to work with Chinese actors, so as to catch more Chinese audiences and increase the box office.  
 Indeed, Chinese box office is increasing every year, even surpasses the foreign’s, which makes the foreign directors pay so much attention to Chinese audiences. It also shows that China has influnced the world and it plays more and more important role in the world economy. There is no doubt that more cooperations will happen during foreign enterprises and Chinese business.
 > [!tips center]+ Title
>  Indeed, Chinese box office is increasing every year, even surpasses the foreign’s, which makes the foreign directors pay so much attention to Chinese audiences. It also shows that China has influnced the world and it plays more and more important role in the world economy. There is no doubt that more cooperations will happen during foreign enterprises and Chinese business. 
 With the development of Chinese economy, the world is watching us. More and more foreigners have sensed the great potential market and come to China to seek for cooperation. Chinese film market had been ignored before, but now more Hollywood directors show their willingness to work with Chinese actors, so as to catch more Chinese audiences and increase the box office.  

### 首行缩进2字符 indent 
> 支持下面两种写法

```html
 > [!note|indent]
 > [!note indent]
```

> [!NOTE|indent] Title
> In China, millions of high school students will take part in the very important exam on June, it is the turning point of their lives, because the exam will decide what kind of university they will enter. Most people believe that it even decides their fates. While it is just the beginning of their new lives.
在中国,数以百万计的高中学生会在6月参加重要的考试,这是他们生活的转折点,因为考试将决定他们将进入什么样的大学。大多数人认为,这甚至决定他们的命运。然而这只是他们的新生活的开端。
When high school students finish their study, it is time to think about what kind of major they need to choose. This is a very important question, choosing a major needs to consider many factors. The first is about interest. Studying with passion can make a student happy and love what the major. The second is about foreground. The major always decide the future job, so students need to think about the prospect.
当高中学生完成他们的学业,是时候考虑需要选择什么样的专业。这是一个非常重要的问题,选择专业需要考虑很多因素。第一个是关于兴趣。有激情的学习可以让学生感受到快乐和爱。第二个是关于前景。专业总会决定未来的工作,所以学生需要思考前景。


> [!Example|nowrap] 表格 图片等元素单行显示 nowrap
> 
![](https://i.pinimg.com/564x/13/1f/e4/131fe4d97e3be0a49a5d07431a917d31.jpg)
![](https://i.pinimg.com/564x/84/6c/1c/846c1cab0d47dd7970f9a008eeebd68f.jpg)
![](https://s1.ax1x.com/2022/05/18/OI7Io9.png)
![](https://i.pinimg.com/564x/84/6c/1c/846c1cab0d47dd7970f9a008eeebd68f.jpg)
![](https://i.pinimg.com/564x/c5/0f/09/c50f09d991dfcfdbea600ff139739fd8.jpg)
![](https://i.pinimg.com/564x/a4/94/01/a494019c68ed85630de16cf8f32523f0.jpg)
![[obsidian_image.png]]
![[obsidian_image.png]]
> 

| 表头1                                                    | 表头2表头2                                                 | 表头3                                                                      |
|:-------------------------------------------------------|:-------------------------------------------------------|:-------------------------------------------------------------------------|
| 这是很长的表格内容看 会不会自动换行                                     | 这是很长的表格内容看 会不会自动换行                                     | 这是很长的表格内容看 会不会自动换行                                                       |
| 这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行 | 这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行 | 这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行这是很长的表格内容看 会不会自动换行 |

>

> [!Example|noborder grid]+ 表格 图片等元素网格显示 grid
> 
![](https://i.pinimg.com/564x/13/1f/e4/131fe4d97e3be0a49a5d07431a917d31.jpg)
![](https://i.pinimg.com/564x/84/6c/1c/846c1cab0d47dd7970f9a008eeebd68f.jpg)
![](https://s1.ax1x.com/2022/05/18/OI7Io9.png)
![](https://i.pinimg.com/564x/84/6c/1c/846c1cab0d47dd7970f9a008eeebd68f.jpg)
![](https://i.pinimg.com/564x/c5/0f/09/c50f09d991dfcfdbea600ff139739fd8.jpg)
![](https://i.pinimg.com/564x/a4/94/01/a494019c68ed85630de16cf8f32523f0.jpg)


### 内容居中
![[涂黑和挖空效果（三种语法）#例子2]]



### timeline
![[timeline callout效果]]

### 便签效果
![[callout 便签效果]]

